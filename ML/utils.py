# utils.py
from sentence_transformers import SentenceTransformer
import os
import psycopg2
import requests
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
# ollama pull hf.co/mradermacher/Qwen-2.5-3b-Text_to_SQL-GGUF:Q4_K_M

# Load the embedding model once (global, not per request)
model = SentenceTransformer('all-MiniLM-L6-v2')

def format_context(results):
    """
    Format search results into an LLM-ingestible context.
    """
    formatted = ["Relevant context (ranked by similarity):\n"]
    for idx, (content, similarity) in enumerate(results, start=1):
        formatted.append(f"{idx}. [Similarity {similarity:.2f}] {content}")
    return "\n".join(formatted)


def fetch_rag_context(prompt: str) -> str:
    """
    Given a user prompt, generate embedding, query pgvector, and return top-k context chunks.
    """
    
    context = None
    cursor=None
    conn=None

    try:
        # 1. Generate embedding for the user query
        query_embedding = model.encode(prompt)
        embedding_str = str(query_embedding.tolist())

        conn = psycopg2.connect(
            host=os.getenv("SUPABASE_DB_HOST"),
            port=os.getenv("SUPABASE_DB_PORT"),
            dbname=os.getenv("SUPABASE_DB_NAME"),
            user=os.getenv("SUPABASE_DB_USER"),
            password=os.getenv("SUPABASE_DB_PASSWORD"),
            sslmode='require'
        )
        cursor = conn.cursor()

        # 3. Perform similarity search in pgvector
        search_query = """
            SELECT content, 1 - (embedding <=> %s) AS similarity
            FROM documents
            ORDER BY embedding <=> %s
            LIMIT 3;
        """

        cursor.execute(search_query, (embedding_str, embedding_str))
        results = cursor.fetchall()
        context = format_context(results)


    except Exception as e:
        return f"[RAG ERROR] {str(e)}"

    finally:
        if cursor: cursor.close()

    # Return concatenated context for the LLM
    if context:
        return context
    else:
        return "[No relevant knowledge found]"







def call_ollama_for_sql(prompt: str) -> str:
    """
    Ask Ollama to generate a SQL SELECT query for the given NL prompt.
    """
    system_prompt = (
        "You are an expert in making PostgreSQL queries related to the Indian AGRO float dataset. "
        "Given a natural language question, generate a valid SQL query for PostgreSQL. "
        "GIVE ME PROFESSIONAL AND WELL WRITTEN QUERIES WCHICH ONLY CONTAINS RELEVANT DATA KEEP THIS IN MIND"

        "STRICT RULES:\n"
        "- Only generate SELECT queries.\n"
        "- Always include the extracted month from profiles.timestamp as a column (e.g., EXTRACT(MONTH FROM profiles.timestamp) AS month).\n"
        "- Only use relevant tables and columns: profiles (profile_id, cycle_number, timestamp, latitude, longitude), "
        "measurements (measurement_id, profile_id, pressure, temperature, salinity).\n"
        "- Allowed aggregate functions: AVG(), PERCENTILE_CONT() (for median).\n"
        "- If asked for median, always use PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY column).\n"
        "- Never use unsupported or invalid functions (e.g., MEDIAN()).\n"
        "- You may use GROUP BY when needed (e.g., GROUP BY month).\n"
        "- Do not generate INSERT, UPDATE, DELETE, DROP, ALTER, or any non-SELECT statements.\n"
        "- Return only the SQL query text, no explanations or comments.\n"
        "- The query must be clean, professional, and only contain relevant data.\n"
        "- The database has the following tables:\n"
        """Table: profiles(
                profile_id SERIAL PRIMARY KEY,
                cycle_number INT,
                timestamp TIMESTAMP,
                latitude DOUBLE PRECISION,
                longitude DOUBLE PRECISION,
            )"""
        """Table: measurements(
                measurement_id SERIAL PRIMARY KEY,
                profile_id INT REFERENCES profiles(profile_id),
                pressure DOUBLE PRECISION,  
                temperature DOUBLE PRECISION, 
                salinity DOUBLE PRECISION,
             
            )"""
    )
   
    payload = {
        "model": "hf.co/tensorblock/NaturalSQL-6.7B-v0-GGUF:Q4_K_M",  # adjust to whichever model you run in Ollama
        "prompt": f"{system_prompt}\n\nQuestion: {prompt}",
        "stream": False
    }

    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    sql_query = response.json().get("response", "").strip()
    # Clean up
    if sql_query.startswith("SQL Query:\n"):
        sql_query = sql_query[len("SQL Query:\n"):].strip()
    # print(sql_query)
    # Safety guard
    if not sql_query.strip().lower().startswith("select"):
        raise ValueError(f"Unsafe SQL detected: {sql_query}")

    return sql_query


def format_sql_results(rows, columns):
    """
    Convert query results into an LLM-friendly context string.
    """
    if not rows:
        return "No results found for this query."

    formatted = ["Relevant data (from SQL query):\n"]
    for row in rows:
        row_dict = dict(zip(columns, row))
        formatted.append("- " + ", ".join(f"{k}: {v}" for k, v in row_dict.items()))
    return "\n".join(formatted)


def fetch_sql_context(prompt: str) -> str:
    """
    NL → SQL (safe) → Results → LLM-friendly context
    Opens/closes DB connection inside.
    """
    conn = None
    try:
        sql_query = call_ollama_for_sql(prompt)
        print(sql_query)
        # return "sucess"

        conn = psycopg2.connect(
            host=os.getenv("SUPABASE_DB_HOST"),
            port=os.getenv("SUPABASE_DB_PORT"),
            dbname=os.getenv("SUPABASE_DB_NAME"),
            user=os.getenv("SIH_DB_USER"),
            password=os.getenv("SIH_DB_PASSWORD"),
            sslmode='require'
        )

        with conn.cursor() as cursor:
            cursor.execute(sql_query)
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]

        return format_sql_results(rows, columns)
    except Exception as e:
        return f"[Error executing SQL: {e}]"

    finally:
        if conn:
            conn.close()

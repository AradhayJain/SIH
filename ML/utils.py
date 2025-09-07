# utils.py
from sentence_transformers import SentenceTransformer
import os
import psycopg2

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



def fetch_sql_context(prompt: str) -> str:
    # TODO: implement NL→SQL conversion + DB query
    return f"[SQL context placeholder for prompt: {prompt}]"
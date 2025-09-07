import os
import psycopg2
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- The Test Query ---
user_query = "What are BGC floats?"

# --- 1. Load the Same Model ---
# It's crucial to use the exact same model for searching as you did for inserting
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

# --- 2. Generate Embedding for the Query ---
query_embedding = model.encode(user_query)
print("Query embedding generated.")

# --- 3. Connect and Search ---
db_connection_string = os.getenv("DATABASE_URL")
conn = None
cursor = None

try:
    conn = psycopg2.connect(db_connection_string)
    cursor = conn.cursor()
    print("Database connection successful.")

    # Convert the embedding to the format pg_vector expects
    embedding_str = str(query_embedding.tolist())

    # This query calculates the cosine distance between the query vector and all stored vectors.
    # We order by this distance to find the closest matches (most similar).
    search_query = """
        SELECT content, 1 - (embedding <=> %s) AS similarity
        FROM documents
        ORDER BY embedding <=> %s
        LIMIT 3;
    """

    # The <-> operator gives cosine distance (smaller is better).
    # 1 - (distance) gives similarity (higher is better).

    cursor.execute(search_query, (embedding_str, embedding_str))
    results = cursor.fetchall()
    print(f"\nTop 3 results for the query: '{user_query}'")
    for row in results:
        content = row[0]
        similarity = row[1]
        print(f"- Similarity: {similarity:.4f}\n  Content: {content}\n")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if cursor: cursor.close()
    if conn: conn.close()
    print("Database connection closed.")
import os
import psycopg2
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()
# --- Your Data ---
summaries = [
    "An Argo float is an autonomous profiling float that measures ocean temperature and salinity.",
    "BGC floats are Bio-Geo-Chemical floats that measure parameters like oxygen, nitrate, and chlorophyll.",
    "The Argo program is a global array of nearly 4,000 profiling floats, providing real-time ocean data."
]

# --- 1. Load the Embedding Model ---
# This model creates 384-dimensional embeddings.
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

# --- 2. Generate Embeddings ---
embeddings = model.encode(summaries)
print("Embeddings generated.")

# --- 3. Connect to Supabase Database ---
# Get your connection string from the Supabase dashboard
# --- 3. Connect to Supabase Database ---
# Replace @ in the password with %40
db_connection_string = os.getenv("DATABASE_URL")
print("Connecting with URL:", db_connection_string) # <-- Add this line


conn = None
cursor = None

try:
    conn = psycopg2.connect(db_connection_string)
    cursor = conn.cursor()
    print("Database connection successful.")

    # --- 4. Insert Data and Embeddings ---
    for content, embedding in zip(summaries, embeddings):
        # The embedding needs to be converted to a string format for insertion
        embedding_str = str(embedding.tolist())
        
        insert_query = "INSERT INTO documents (content, embedding) VALUES (%s, %s)"
        cursor.execute(insert_query, (content, embedding_str))

    conn.commit()
    print(f"{cursor.rowcount} records inserted successfully.")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if cursor: cursor.close()
    if conn: conn.close()
    print("Database connection closed.")
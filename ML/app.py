from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import fetch_sql_context, fetch_rag_context
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()


# Request schema
class QueryRequest(BaseModel):
    prompt: str
    category: str  # "DATA_QUERY" or "KNOWLEDGE_QUERY"

# Response schema
class QueryResponse(BaseModel):
    prompt: str
    category: str
    context: str

app = FastAPI(title="ARGO LLM Server", version="0.1")
# db_connection_string = os.getenv("DATABASE_URL_PG_VECTOR_SEARCH")
try :
    conn = psycopg2.connect(
        host=os.getenv("SUPABASE_DB_HOST"),
        port=os.getenv("SUPABASE_DB_PORT"),
        dbname=os.getenv("SUPABASE_DB_NAME"),
        user=os.getenv("SUPABASE_DB_USER"),
        password=os.getenv("SUPABASE_DB_PASSWORD"),
        sslmode='require'
    )
    print("Connected to the database successfully.")
except Exception as e:
    print(f"Error connecting to the database: {e}")
    conn = None

@app.post("/query", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """
    Endpoint that takes user prompt + category and fetches the right context.
    """
    category = request.category.upper()

    try:
        if category == "DATA_QUERY":
            context = fetch_sql_context(request.prompt,conn)  # to implement in util.py
        elif category == "KNOWLEDGE_QUERY":
            context = fetch_rag_context(request.prompt,conn)  # to implement in util.py
        else:
            raise HTTPException(status_code=400, detail="Invalid category")

        return QueryResponse(
            prompt=request.prompt,
            category=category,
            context=context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# uvicorn app:app --reload --port 5000

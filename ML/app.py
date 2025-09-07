from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import fetch_sql_context, fetch_rag_context
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

@app.post("/query", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """
    Endpoint that takes user prompt + category and fetches the right context.
    """
    category = request.category.upper()

    try:
        if category == "DATA_QUERY":
            context = fetch_sql_context(request.prompt)  # to implement in util.py
        elif category == "KNOWLEDGE_QUERY":
            context = fetch_rag_context(request.prompt)  # to implement in util.py
        else:
            raise HTTPException(status_code=400, detail="Invalid category")

        return QueryResponse(
            prompt=request.prompt,
            category=category,
            context=context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# if conn: conn.close()

# uvicorn app:app --reload --port 5000

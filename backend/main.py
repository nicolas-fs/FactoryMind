from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
import openai
import requests
import re
import psycopg2
import psycopg2.extras
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from dotenv import load_dotenv
from .actions import execute_action   # Importar el módulo de acciones

load_dotenv()

MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL")
RERANK_ENABLED = os.getenv("RERANK_ENABLED", "false").lower() == "true"
RERANKER_URL = os.getenv("RERANKER_URL", "http://reranker:8001")
ACTIONS_ENABLED = os.getenv("ACTIONS_ENABLED", "false").lower() == "true"

if not MOCK_MODE:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY no configurada y MOCK_MODE no activo")
    openai.api_key = OPENAI_API_KEY

app = FastAPI(title="FactoryMind RAG Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

class ChatRequest(BaseModel):
    question: str
    history: Optional[List[dict]] = []

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "FactoryMind RAG Agent"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = ""
        if file.filename.endswith(".pdf"):
            reader = PdfReader(file.file)
            for page in reader.pages:
                content += page.extract_text()
        elif file.filename.endswith(".txt"):
            content = (await file.read()).decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Solo se admiten archivos PDF o TXT")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(content)

        if MOCK_MODE:
            return {"message": f"✅ [MOCK] Documento '{file.filename}' procesado. {len(chunks)} chunks (no se indexaron en modo mock)."}

        embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")
        
        conn = get_db_connection()
        cur = conn.cursor()
        for chunk in chunks:
            embedding = embeddings_model.embed_query(chunk)
            cur.execute(
                "INSERT INTO documents (filename, content, embedding) VALUES (%s, %s, %s)",
                (file.filename, chunk, embedding)
            )
        conn.commit()
        cur.close()
        conn.close()
        return {"message": f"✅ Documento procesado. {len(chunks)} chunks indexados."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    question = request.question
    history = request.history[-6:] if request.history else []

    if MOCK_MODE:
        return {
            "answer": f"🤖 [MOCK] Esto respondería el agente RAG a: '{question}'. Cuando configures OpenAI, tendrás respuestas reales basadas en tus documentos.",
            "source": "mock",
            "confidence": None
        }

    # Embedding de la pregunta
    embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")
    question_embedding = embeddings_model.embed_query(question)

    # Obtener chunks de pgvector (5 para reranking)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT content, filename, embedding <=> %s AS distance FROM documents ORDER BY distance LIMIT 5",
        (question_embedding,)
    )
    results = cur.fetchall()
    cur.close()
    conn.close()

    if not results:
        return {"answer": "No encontré información relevante en los documentos cargados.", "source": None, "confidence": None}

    # Reranking si está habilitado
    if RERANK_ENABLED and len(results) > 1:
        chunks_text = [r[0] for r in results]
        try:
            rerank_resp = requests.post(f"{RERANKER_URL}/rerank", json={
                "question": question,
                "chunks": chunks_text
            }, timeout=5)
            if rerank_resp.ok:
                ranked_data = rerank_resp.json()
                ranked_chunks = ranked_data["ranked_chunks"]
                # Reordenar results según ranked_chunks
                chunk_to_row = {r[0]: r for r in results}
                new_results = []
                for chunk in ranked_chunks:
                    if chunk in chunk_to_row:
                        new_results.append(chunk_to_row[chunk])
                if new_results:
                    results = new_results
        except Exception as e:
            # Fallback al orden original
            pass

    # Calcular confianza a partir de la distancia del primer chunk
    top_distance = results[0][2]  # distancia coseno
    confidence = max(0.0, 1.0 - float(top_distance))  # similitud coseno
    confidence_pct = round(confidence * 100)

    # Construir contexto
    context = "\n\n".join([f"[{r[1]}]: {r[0]}" for r in results])
    source = results[0][1]

    # Construir mensajes
    messages = [{
        "role": "system",
        "content": f"Eres un asistente para Pymes industriales. Usa este contexto para responder:\n\n{context}\n\nResponde siempre en español. Si necesitas ejecutar una acción, responde con el formato [ACTION:nombre_acción]."
    }]
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": question})

    # Llamada al LLM
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.3,
    )
    answer = response.choices[0].message.content

    # Ejecutar acción si está habilitada y el LLM lo solicitó
    if ACTIONS_ENABLED and "[ACTION:" in answer:
        match = re.search(r"\[ACTION:(.*?)\]", answer)
        if match:
            action_name = match.group(1)
            action_result = execute_action(action_name)
            messages.append({"role": "assistant", "content": answer})
            messages.append({"role": "system", "content": f"Resultado de la acción: {action_result}"})
            response2 = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.3,
            )
            answer = response2.choices[0].message.content

    return {"answer": answer, "source": source, "confidence": confidence_pct}
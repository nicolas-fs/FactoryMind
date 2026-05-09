from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import CrossEncoder

model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

app = FastAPI()

class RerankRequest(BaseModel):
    question: str
    chunks: list[str]

@app.post("/rerank")
def rerank(request: RerankRequest):
    pairs = [[request.question, chunk] for chunk in request.chunks]
    scores = model.predict(pairs)
    # Ordenar chunks por score descendente
    ranked = sorted(zip(request.chunks, scores), key=lambda x: x[1], reverse=True)
    return {
        "ranked_chunks": [chunk for chunk, _ in ranked],
        "scores": [float(score) for _, score in ranked]
    }

@app.get("/health")
def health():
    return {"status": "ok"}
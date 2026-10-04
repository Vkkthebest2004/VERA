from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .modules.ingestion.presentation.router import router as ingestion_router
from .modules.investigation.presentation.router import router as investigation_router
from .modules.research.presentation.router import router as research_router
from .modules.chat.router import router as chat_router

app = FastAPI(
    title="VERA — Financial Verification Platform API",
    description="Evidence-first financial information extraction & verification system",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register domain routers
app.include_router(ingestion_router)
app.include_router(investigation_router)
app.include_router(research_router)
app.include_router(chat_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "vera-api",
        "version": "1.0.0",
        "reasoning_model": "qwen-vera:4b (Qwen 3 / Qwen 2.5 3B-4B class)",
        "vision_model": "gemma3:4b / qwen3-vl:8b",
        "statutory_framework": "SEBI LODR Regulation 30 & 33",
        "features": {
            "ingestion": "ready",
            "qwen_reasoning_engine": "ready",
            "statutory_evidence_tracker": "ready",
            "deterministic_reconciliation": "ready",
        },
    }

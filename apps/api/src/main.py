from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .modules.ingestion.presentation.router import router as ingestion_router
from .modules.investigation.presentation.router import router as investigation_router
from .modules.research.presentation.router import router as research_router

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


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "vera-api",
        "version": "1.0.0",
        "features": {
            "ingestion": "ready",
            "evidence_engine": "planned",
            "verification_engine": "planned",
        },
    }

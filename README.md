# VERA — Autonomous Financial Claim Verification Platform

> **VERA** is an evidence-first, decision-driven financial verification platform designed to combat viral market manipulation, pump-and-dump rumors, and fabricated corporate news across social channels.

---

## ⚡ Core Architecture

VERA runs a **Perplexity-style 5-Stage Verification Pipeline**:

$$\text{SearXNG MetaSearch} \longrightarrow \text{Crawl4AI Scraping} \longrightarrow \text{Evidence Normalization} \longrightarrow \text{Source Credibility} \longrightarrow \text{Decision-First Verification}$$

1. **SearXNG MetaSearch Discovery**: Multi-engine search across Google, Bing, DuckDuckGo, and financial registries without API keys or rate limits.
2. **Crawl4AI Asynchronous Web Scraper**: Headless browser automation extracting LLM-ready markdown from corporate disclosures and news wires with built-in SSRF protection.
3. **Evidence Normalization Engine**: Deterministic normalization of monetary figures (₹/INR, $, Crore, Lakh, Trillion), dates, and YoY percentages.
4. **4-Tier Provenance Scoring**:
   - **Tier 1 (1.00)**: Statutory exchange filings (BSE, NSE, SEBI, SEC EDGAR, MCA)
   - **Tier 2 (0.85)**: Accredited news wires (Reuters, Bloomberg, Mint, PTI)
   - **Tier 3 (0.50)**: Secondary media outlets
   - **Tier 4 (0.15)**: Social platforms and anonymous tips (WhatsApp, Telegram)
5. **Decision-First Claim Checker**: Concise (<100 words) verdicts (🟢 **VERIFIED**, 🟡 **PARTIALLY VERIFIED**, 🔴 **UNVERIFIED**) with clickable numbered citations (`[1]`, `[2]`) and investor protection guidance.

---

## 👁️ Multimodal Ingestion Pipeline

- **Vision & Charts**: **Google Gemma 3** (`gemma3:4b`) & **Qwen 3 VL** (`qwen3-vl:8b`) for semantic infographic and balance-sheet understanding.
- **Pixel-Level OCR**: **Apple Vision Neural Engine OCR** (`scripts/sutra-ocr`) for zero-hallucination verbatim text extraction with automated Indian Rupee (`₹`) symbol normalization.
- **Audio & Earnings Calls**: **Faster-Whisper** (`base_int8`) for audio transcriptions.
- **Statutory PDFs**: **PyMuPDF** (`fitz`) for PDF corporate filing extraction.

---

## 📁 Modular Directory Structure

```text
VERA/
├── apps/
│   ├── api/                           # FastAPI backend
│   │   └── src/
│   │       ├── main.py                # API root router
│   │       └── modules/
│   │           ├── ingestion/         # Intake, file parsing & OCR
│   │           │   ├── domain/        # Entities & de-hyping engine
│   │           │   └── infrastructure/
│   │           │       └── extractors/# Dedicated PDF, Image, Audio extractors
│   │           ├── research/          # Autonomous web crawler & SearXNG
│   │           │   ├── domain/        # Normalization, decomposition, credibility
│   │           │   └── infrastructure/
│   │           │       └── crawler/   # SSRF guard, browser client, fixtures, service
│   │           └── investigation/     # Verification service & decision cards
│   │               └── infrastructure/
│   │                   └── data/      # Canonical filing registries
│   └── web/                           # Next.js 16 (Day Mode Black & White UI)
│       └── src/
│           ├── app/                   # App router & layouts
│           └── components/            # VeraChatResponse, IngestionStudio, CrawlerAnimationScreen
├── infrastructure/
│   └── searxng/                       # SearXNG configuration
├── tests/                             # Unit & 15-case verification stress test suites
├── docker-compose.yml                 # SearXNG, Redis, Postgres/pgvector, MinIO
└── Makefile
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.12+
- Node.js 18+
- Docker & Docker Compose
- Ollama (`gemma3:4b` and/or `qwen3-vl:8b`)

### 2. Start Supporting Infrastructure
```bash
docker compose up -d searxng redis postgres minio
```

### 3. Backend Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn apps.api.src.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Frontend Setup
```bash
cd apps/web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the VERA Verification Studio.

---

## 🧪 Running Tests

```bash
# Run all unit tests
pytest tests/test_research_engine.py tests/test_investigation.py tests/test_ingestion.py

# Run comprehensive 15-scenario stress verification suite
pytest tests/test_verification_stress.py
```

---

## 📜 License
Proprietary & Confidential. All rights reserved.

# VERA — Autonomous Financial Claim Verification Platform

> **VERA** is an evidence-first, decision-driven financial verification platform designed to combat viral market manipulation, pump-and-dump rumors, and fabricated corporate news across social channels.


---

## 🎬 Live Interactive Workflow Showcase

![VERA Full Workflow Demo](docs/recordings/vera_full_workflow.gif)

> 📹 **High-Definition Master Video**: [Download / Watch MP4 (1440x900, 50.9s)](docs/recordings/vera_full_workflow.mp4) | [WebM Format](docs/recordings/vera_full_workflow.webm)

### 🚀 Key Functional Modules Shown in Workflow
| Feature | Capabilities Demonstrated | Visual Evidence |
| :--- | :--- | :--- |
| **Search-First Front Page** | Mission badge *"Making financial information simple, transparent, verified, and easy to understand"*, live autocomplete across BSE/NSE tickers. | [`docs/screenshots/workflow/01_front_page_mission_statement.png`](docs/screenshots/workflow/01_front_page_mission_statement.png) |
| **20 Indian Languages Hub** | Real-time script & terminology localization across Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, and 10 more languages. | [`docs/screenshots/workflow/02_language_selector_20_languages.png`](docs/screenshots/workflow/02_language_selector_20_languages.png) |
| **Audited Financial Terminal** | 10-Year historical statements (P&L, Balance Sheet, Cash Flow), DuPont capital efficiency metrics, and credit ratios. | [`docs/screenshots/workflow/07_reliance_terminal_overview.png`](docs/screenshots/workflow/07_reliance_terminal_overview.png) |
| **Visualizer & Time Machine** | Interactive time-travel scrubber (FY15-FY24), multi-metric financial curves (Revenue, EBITDA, PAT, OCF). | [`docs/screenshots/workflow/08_visualizer_canvas_charts.png`](docs/screenshots/workflow/08_visualizer_canvas_charts.png) |
| **Artha Multilingual Copilot** | Evidence-first conversational copilot answering in native languages (Hindi/English), expandable verified source citations drawer, Supabase memory vault. | [`docs/screenshots/workflow/09_artha_chat_hindi.png`](docs/screenshots/workflow/09_artha_chat_hindi.png) |
| **SEBI LODR 30/33 Verifier** | Mathematical Invariant Verifier, statutory filing audit trail, debunking fabricated rumors with official exchange confirmations. | [`docs/screenshots/workflow/13_evidence_tracker_verifier.png`](docs/screenshots/workflow/13_evidence_tracker_verifier.png) |

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

> For an in-depth breakdown of every folder, file responsibility, and architectural layer, see the master [**`PROJECT_STRUCTURE.md`**](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/PROJECT_STRUCTURE.md).

```text
VERA/
├── apps/
│   ├── api/                           # FastAPI backend (chat, ingestion, research, investigation)
│   ├── web/                           # Next.js 16 frontend (analytical workstation, chat, charts)
│   └── worker/                        # Celery background worker service
├── assets/                            # Static brand logos and UI design reference assets
├── data/                              # Canonical financial profiles and structured company dossiers
├── docs/                              # Architecture specs, capability vaults, and progress logs
├── infrastructure/                    # SearXNG, Postgres (pgvector), Docker, and Nginx configs
├── packages/                          # Shared prompts, python common utilities, and shared types
├── scripts/                           # Native Apple Vision OCR binary, eval, & profiling scripts
├── tests/                             # Integration, unit, fixtures, and verification test suites
├── training/                          # Ollama Modelfile, Qwen fine-tuning, & synthetic datasets
├── docker-compose.yml                 # Local SearXNG, Redis, Postgres, MinIO container stack
├── Makefile                           # Development lifecycle shortcuts
└── PROJECT_STRUCTURE.md               # Master directory and folder guide
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

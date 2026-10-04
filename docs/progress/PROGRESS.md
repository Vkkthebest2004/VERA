# 🚀 VERA — Project Progress & Feature Tracker

> **Core Workflow Rules**:
> 1. **One Feature at a Time**: Focus exclusively on a single feature until completion.
> 2. **Dedicated UI & Frontend**: Every feature is architected modularly with its own dedicated UI view/component.
> 3. **Complete Verification & Testing**: Each feature must be tested, validated, and approved before proceeding.
> 4. **Execution Protocol**: Do not start building features until explicitly directed by the user.

---

## 📌 Project Overview
- **Project Name**: VERA (Evidence-First Financial Information Verification Platform)
- **Repository Location**: `/Users/vaibhavkrishnakesarwani/Desktop/VERA`
- **Architecture Baseline**: Canonical Modular Monolith (Clean/Hexagonal Core) + Asynchronous Worker System + Next.js App
- **Status**: ✅ Environment & All Required Dependencies Fully Installed

---

## 🛠 Technology Stack Installed

| Layer | Technology | Details / Versions | Status |
|---|---|---|---|
| **Web / UI** | Next.js 15, React 19, TypeScript, Tailwind CSS | App router, `@/*` path alias, `lucide-react` | ✅ Installed & Ready |
| **API** | Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2 | Modular Monolith layout | ✅ Installed & Ready |
| **Workers** | Celery, Redis | Async pipeline for ingestion, parsing, verification | ✅ Installed & Ready |
| **Supabase** | `@supabase/supabase-js`, `@supabase/ssr`, `supabase-py` | Auth, Managed Postgres + pgvector, Storage, Realtime | ✅ Installed & Ready |
| **Database** | PostgreSQL 16 + pgvector (Supabase / Local) | Full-text search, relational tables, vector embeddings | ✅ Configured |
| **Cache / Queue** | Redis 7 | Task broker, result backend, ephemeral cache | ✅ Configured in Docker Compose |
| **Object Storage** | MinIO / S3-compatible | Storage for PDFs, screenshots, OCR artifacts | ✅ Configured in Docker Compose |
| **Document Processing** | PyMuPDF + Apple Vision OCR | Native text & pixel-level OCR extraction | ✅ Installed & Ready |
| **Multimodal AI Model** | Google Gemma 3 4B Multimodal (`gemma3:4b` via Ollama) | Visual document analysis, financial table extraction, and claim grounding | ✅ Installed & Online |
| **Local Tooling** | `uv`, `ruff`, `pytest`, `docker-compose`, `Makefile` | Fast virtualenv & testing tools | ✅ Configured & Ready |

---

## 🧭 Feature Roadmap & Status Board

| # | Feature Name | Description | UI / Frontend Scope | Backend / Logic Scope | Testing & QA Status | Overall Status |
|---|--------------|-------------|---------------------|-----------------------|---------------------|----------------|
| **00** | **Environment & Infrastructure Setup** | Monorepo scaffolding, Next.js bootstrap, Python 3.12 `.venv` with `uv`, Docker compose for Postgres+pgvector/Redis/MinIO | Next.js 15 + Tailwind CSS initialized | FastAPI, Celery, SQLAlchemy 2, PyMuPDF, Alembic installed | ✅ Verified | 🟢 Completed |
| **01** | **Multi-Modal Financial Information Ingestor & Fact-Check Dossier Engine** | Ingests WhatsApp forwards, Instagram finfluencer posts/screenshots, voice notes, PDFs, and links. Strips viral hype, isolates atomic factual assertions, detects financial entities/metrics, flags pump-and-dump/FOMO red flags, and outputs a structured Fact-Check Dossier. | Dedicated Ingestion Studio with WhatsApp/Instagram/Audio/PDF tabs, live extraction visualizer, de-hyped summary, red flag barometer, and atomic claim cards. | Specialized financial parser, regex & heuristic financial entity/metric extraction, red-flag detector, PyMuPDF & OCR extraction, clean architecture use cases. | ✅ 6/6 Pytest Passed + Live API & UI Validated | 🟢 Completed & Verified |
| **02** | **Evidence Investigation, Cross-Filing Verification & Investor Protection Engine** | Full SANGYAN pipeline: Authoritative filing retrieval (BSE/NSE/SEBI), source provenance hierarchy (Tier 1-4), claim ↔ evidence reconciliation (Supported/Partial/Contradicted/Insufficient), numerical & temporal contradiction detection, traceable evidence trail, uncertainty-aware assessment, and investor rights & recovery layer (SEBI SCORES). | Full Evidence Investigation Studio: Master Verdict banner, Evidence Trail viewer (page/paragraph coordinates), Numerical Reconciliation comparison table, and Investor Protection action card. | Domain verification service, filings repository, cross-document comparison, numerical comparator, investor rights guidance, FastAPI endpoints. | ✅ 10/10 Pytest Passed + Live API & UI Validated | 🟢 Completed & Verified |
| **03** | **SUTRA Web Research, Crawler & Evidence Investigation Engine** | Autonomous evidence pipeline: Atomic claim decomposition, targeted query generation, authoritative search provider, Crawlee/Playwright web crawler with strict SSRF protection, Trafilatura/BeautifulSoup/PyMuPDF document processor, deterministic numerical & temporal reasoning, uncertainty-aware evidence status, and dedicated investigation workstation. | Dedicated Research Workstation: Query generator trace, crawler audit view, claim ↔ evidence breakdown table, deterministic numerical comparison, temporal lifecycle stage, and granular citation trail. | Modular domain: `ClaimDecompositionService`, `QueryGenerationService`, `SourceRegistry`, `NumericalReasoningEngine`, `TemporalReasoningEngine`, `EvidenceExtractionService`, `EvidenceStatusEngine`, `InvestigationService`, FastAPI router. | ✅ 18/18 Pytest Passed + Live API & UI Validated | 🟢 Completed & Verified |

*Status Legend:*
- ⚪ **Not Started** — Queued in backlog
- 🟡 **In Progress** — Under active design & development
- 🧪 **Testing & Verification** — Built, undergoing functional and UI tests
- 🟢 **Completed & Verified** — Fully signed off and verified

---

## 🎯 Current Active Sprint: Unified Autonomous Crawler & Single ChatGPT-Style Verification Response Completed & Verified
- **Active Accomplishments**:
  - [x] Feature #1: Multi-Modal Ingestor & Fact-Check Dossier (Apple Vision OCR + Faster-Whisper + Gemma 3 Multimodal)
  - [x] Feature #2: Evidence Investigation, Verification & Investor Protection (BSE/NSE Reg 30 Filings, SEBI SCORES)
  - [x] Feature #3: VERA Web Research, Crawler & Evidence Investigation Engine (SSR-safe crawler, deterministic numerical & temporal comparison)
  - [x] **Unified Crawler & Verification Experience**: Merged the web crawler and verification pipeline into **ONE single unified platform flow**. Removed split modes/workstations.
  - [x] **Single Conversational ChatGPT-Style Response**: Eliminated multiple complex tabs and sections. All findings across regulatory filings, financial news, and social media channels (Reddit, Twitter/X, Telegram) are synthesized into one clear, conversational, markdown response formatted like ChatGPT.
  - [x] **Plain-Language Financial Takeaways**: Simple, jargon-free explanations understandable by everyday people with zero finance background, clearly answering what was claimed, what was found across all sources, what the numbers mean, and what needs to be verified.
  - [x] **Gemma 3 Multimodal & Plain-Language Pipeline**: Powered by Google Gemma 3 (`gemma3:4b`), translating raw web and image inputs into conversational clarity.
  - [x] **Rebranding to VERA**: Completed 100% rebranding to VERA across web, API, and documentation.
  - [x] **Animated Web Crawler Surfing Screen**: Seamless animated radar-sweep and orbital node transitions displaying live audited sources (Instagram, Telegram, WhatsApp, X, Reddit, BSE, NSE, SEBI).
  - [x] Canonical Test Case Verified: *"ABC Ltd secretly acquired ₹45 crore land in Noida"* decomposing into 4 atomic assertions, discovering ₹31.4 Cr filing on NSE/BSE, computing 1.4x exaggeration, temporal lifecycle reasoning, and outputting `PARTIAL_EVIDENCE` without hallucination.
  - [x] **Submitted Post & Media Information Section**: Prominent dedicated overview card displaying the exact claim, source platform badge, identified entities/tickers, detected urgency flags, and full raw extracted post text with one-click copy and expand/collapse.
  - [x] **Qwen 3 VL Multimodal Vision Engine**: Integrated `qwen3-vl:8b` as the primary vision model for image, screenshot, and visual document analysis. Leverages deep visual chain-of-thought extraction across tabular figures, company logos, fine print, and statutory citations.
  - [x] Full automated test suite passing (18/18 tests in `pytest`).
  - [x] Next.js frontend builds cleanly (`npm run build` with zero TypeScript or Turbopack errors).
  - [x] **Multi-Website Web Search & Crawler Enhancement**: Integrated Google News RSS, Bing News direct link decoding, DuckDuckGo, SearXNG, and canonical filings. Scrapes live multi-website news across Reuters, Bloomberg, LiveMint, Financial Express, Economic Times, Moneycontrol, NDTV, etc.
  - [x] **HTML Text Extraction via BeautifulSoup**: Enhanced `CrawlerService` to strip scripts, styles, and ads, returning clean article markdown text.
  - [x] **Evidence Checker Denial & Timeline Logic**:
    - `THE REALITY`: Synthesizes exact factual reality of the entity or contract.
    - `BASIS OF DENIAL`: Identifies statutory grounds (SEBI LODR Regulation 30 24-hour mandatory disclosure window, Companies Act 2013 Section 129 audited reports).
    - `WHAT ACTUALLY HAPPENED`: Details authentic corporate actions and filings that occurred during that query's timeline.
  - [x] **Frontend Cards**: Added dedicated "The Reality", "Basis of Denial / Statutory Rule", and "What Actually Happened in this Timeline" visual cards in day-mode.
  - [x] Environment configuration (`.env`, `.env.example`) and `Makefile` created

---

## 📝 Activity & Change Log

### [2026-10-03] - Feature #2 Completed & Verified: Full SANGYAN Evidence Investigation Pipeline
- Expanded SUTRA beyond ingestion to the complete SANGYAN architecture:
  `INPUT -> UNDERSTAND -> DECOMPOSE -> INVESTIGATE -> VERIFY -> TRACE EVIDENCE -> EXPLAIN -> PROTECT -> USER DECIDES`
- Built **`AuthoritativeFilingsRepository`**:
  - Implemented Tier 1-4 source hierarchy (Tier 1: BSE/NSE/SEBI statutory filings).
  - Loaded canonical regulatory filings with exact page numbers, paragraph coordinates, and reference URLs.
- Built **`EvidenceInvestigationService`**:
  - Reconciles claims against statutory filings using the 5 canonical statuses (`SUPPORTED`, `PARTIALLY_SUPPORTED`, `CONTRADICTED`, `INSUFFICIENT_EVIDENCE`, `UNVERIFIED`).
  - Automatic numerical reconciliation (e.g. caught 10x value inflation: ₹12,500 Cr claimed vs ₹1,250 Cr actual filing).
  - Contradiction detection against audited quarterly financials.
  - Uncertainty-aware assessment: *Absence of filing does NOT automatically mean false*, but flags unverified social rumor.
- Built **Investor Protection & Recovery Layer (SANGYAN Core)**:
  - Generates actionable safety checklist for retail investors.
  - Direct integration links for lodging grievances on **SEBI SCORES** (`https://scores.sebi.gov.in`) and checking the **SEBI Intermediary Database**.
- Created **`InvestigationView`** in `apps/web`:
  - Master Verdict Banner (`OFFICIALLY VERIFIED`, `MISLEADING / 10x EXAGGERATION`, `DEBUNKED / CONTRADICTED`, `UNSUBSTANTIATED SPECULATION`).
  - Numerical Reconciliation table.
  - Traceable Evidence Trail with page/paragraph coordinates and links.
  - Investor Rights & Protection tab.
- **10/10 automated tests passing** across `tests/test_ingestion.py` and `tests/test_investigation.py`.
- Next.js production build compiled in 286ms.
- Running live on: Frontend `http://localhost:3000` & Backend `http://localhost:8000`.

### [2026-10-03] - Audio Voice Note Transcription Engine Verified (Whisper + Gemma 3)
- Integrated **Faster-Whisper** (`faster_whisper_base_int8`) for high-precision audio transcription of voice notes and earnings calls.
- Integrated **Gemma 3 Multimodal (`gemma3:4b`)** to generate plain-English human-readable executive summaries directly from transcribed voice audio.
- Tested on actual financial voice note audio (`.wav`) containing spoken earnings updates and pump rumors:
  - Language detected: `en` (99.3% confidence).
  - Verbatim text extracted word-for-word.
  - Automatically isolated atomic assertions, financial metrics (`300% YoY`), and flagged `Upper Circuit / Pump Signal`.
- **6/6 pytest suites passing** (`tests/test_ingestion.py`).
- Next.js production build compiled in 514ms.
- Running live on: Frontend `http://localhost:3000` & Backend `http://localhost:8000`.

### [2026-10-03] - Human-Readable Translation Layer & Verbatim Viewer Integrated
- Integrated Google **Gemma 3 Multimodal (`gemma3:4b`)** and native Apple Vision Neural Engine OCR into the live extraction pipeline.
- Built **`HumanReadableExplanationLayer`**:
  - Translates dense financial jargon into plain-English executive summaries.
  - Decodes financial metrics (translates basis points, Crores/Lakhs, and YoY/QoQ percentages into everyday meanings).
  - Automatically identifies critical fact-checking questions for Stage 2.
- Added **Exact Verbatim Document Content Viewer** with line numbering and one-click copy, displaying the exact text transcribed from image pixels and files.
- 5/5 backend tests passing (`tests/test_ingestion.py`).
- Next.js production build compiled in 514ms with zero errors.
- Running live on: Frontend `http://localhost:3000` & Backend `http://localhost:8000`.

### [2026-10-03] - Feature #1 Completed, Verified & Refined to Production Minimal UI
- Built clean architecture backend in `apps/api/src/modules/ingestion/` (`domain`, `application`, `infrastructure`, `presentation`).
- Implemented financial dehyping service, red-flag detector, entity & ticker recognition, metric extraction, and atomic claim decomposition.
- Implemented multi-modal extractors for PDFs (PyMuPDF), screenshots/images, and audio clips.
- Redesigned frontend to a production-grade minimal layout:
  - Streamlined header with only brand (`SUTRA`) and mode tag (`De-Hyping Engine`).
  - Single unified omni-box input supporting text, links, drag-and-drop file/audio attachments, and discreet example loading.
  - Eliminated demo clutter, hackathon presets, duplicate tabs, and internal state badges.
  - Clean Fact-Check Preparation Dossier (`DossierView`) rendered on demand.
- Verified 5/5 pytest suites passing (`tests/test_ingestion.py`).
- Next.js production build compiled in 244ms with zero errors.
- Services running live on: Frontend `http://localhost:3000` & Backend `http://localhost:8000`.

### [2026-10-03] - Project Environment & Dependency Installation
- Read and aligned with the canonical architecture specification `SUTRA_System_Architecture_Specification.md`.
- Initialized git tracking with complete `.gitignore`.
- Set up `apps/web` with Next.js 15, TypeScript, Tailwind CSS, and `lucide-react`.
- Set up high-performance Python 3.12 virtual environment using `uv`.
- Installed all 60 core backend & worker dependencies (FastAPI, Pydantic v2, SQLAlchemy 2, Celery, Redis, PyMuPDF, pgvector, etc.).
- Created `docker-compose.yml` for PostgreSQL 16 + pgvector, Redis, and MinIO.
- Created `Makefile` and `.env` template.
- Updated `PROGRESS.md`.

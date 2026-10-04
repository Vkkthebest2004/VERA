# VERA — Complete Project Structure & Folder Directory Guide

> **VERA (Autonomous Financial Intelligence & Claim Verification Platform)**  
> This document provides an accurate, exhaustive guide to every directory, folder location, file responsibility, and architectural layer across the entire repository.

---

## 📑 Table of Contents

1. [High-Level Directory Tree](#-high-level-directory-tree)
2. [Folder-by-Folder Breakdown](#-folder-by-folder-breakdown)
   - [Root Directory (`/`)](#1-root-directory-)
   - [Applications (`apps/`)](#2-applications-apps)
     - [FastAPI Backend (`apps/api/`)](#21-fastapi-backend-appsapi)
     - [Next.js Frontend (`apps/web/`)](#22-nextjs-frontend-appsweb)
     - [Background Worker (`apps/worker/`)](#23-background-worker-appsworker)
   - [Assets (`assets/`)](#3-assets-assets)
   - [Data Store (`data/`)](#4-data-store-data)
   - [Documentation (`docs/`)](#5-documentation-docs)
   - [Infrastructure (`infrastructure/`)](#6-infrastructure-infrastructure)
   - [Shared Packages (`packages/`)](#7-shared-packages-packages)
   - [Scripts & Binaries (`scripts/`)](#8-scripts--binaries-scripts)
   - [Automated Test Suite (`tests/`)](#9-automated-test-suite-tests)
   - [Model Training & Ollama Specs (`training/`)](#10-model-training--ollama-specs-training)
3. [Component Interaction & Data Flow](#-component-interaction--data-flow)
4. [Development & Execution Commands](#-development--execution-commands)

---

## 🌳 High-Level Directory Tree

```text
VERA/
├── .env                                # Environment variables (Ollama, Redis, Postgres, SearXNG)
├── .env.example                        # Template environment variables
├── .gitignore                          # Git exclusions (caches, venvs, build artifacts)
├── docker-compose.yml                  # Multi-container orchestration (SearXNG, Redis, Postgres, MinIO)
├── Makefile                            # Standard development lifecycle commands
├── pytest.ini                          # Pytest configuration and asyncio loop settings
├── requirements.txt                    # Root Python dependencies
├── README.md                           # Project introduction & high-level overview
├── PROJECT_STRUCTURE.md                # (This Document) Complete folder directory guide
│
├── apps/                               # Monorepo applications
│   ├── api/                            # FastAPI backend service (Port 8000)
│   │   ├── requirements.txt            # API-specific Python dependencies
│   │   └── src/
│   │       ├── main.py                 # FastAPI application factory, CORS & route registry
│   │       ├── core/                   # Core settings, logging, Supabase client & JWT auth
│   │       ├── shared/                 # Cross-module internal utilities
│   │       └── modules/
│   │           ├── auth/               # Supabase JWT authentication & session introspection
│   │           ├── chat/               # Conversational financial intelligence endpoint with memory injection
│   │           ├── memory/             # Supabase pgvector long-term memory, conversation history & extractor
│   │           ├── ingestion/          # Multimodal document parsing, OCR & audio intake
│   │           ├── investigation/      # Perplexity-style statutory verification & auditing
│   │           └── research/           # Real-time web crawler, SearXNG client & financial engine
│   ├── web/                            # Next.js 16 (React 19, TypeScript, Vanilla CSS/Tailwind)
│   │   ├── package.json                # Frontend dependencies & scripts
│   │   ├── next.config.ts              # Next.js configuration
│   │   ├── tsconfig.json               # TypeScript compiler options
│   │   ├── public/                     # Static public assets (SVGs, logos)
│   │   └── src/
│   │       ├── app/                    # Next.js App Router (layout, page)
│   │       ├── components/             # UI Components (Chat, Visualizers, Workstation, Screener)
│   │       ├── data/                   # Client-side company profiles & market registry
│   │       ├── lib/                    # Client utility functions & formatting helpers
│   │       ├── state/                  # State management & reactive stores
│   │       └── types/                  # TypeScript interface definitions
│   └── worker/                         # Celery background worker service
│       └── requirements.txt            # Worker Python dependencies
│
├── assets/                             # Static brand and design assets
│   ├── brand/                          # Official logos and vectors
│   │   └── vera_logo.svg               # Vector brand logo
│   └── reference/                      # Visual reference assets and UI design snapshots
│       └── PHOTO-2026-10-03-15-59-48.jpg
│
├── data/                               # Canonical datasets and financial dossiers
│   └── financials/                     # Structured financial records for benchmark companies
│       ├── raw/                        # Raw scraped corporate filings and disclosures
│       │   ├── data_reliance_raw.html
│       │   └── data_tatapower_raw.html
│       ├── RELIANCE_INDUSTRIES_FINANCIAL_PROFILE.md
│       ├── TATA_AND_RELIANCE_MASTER_FINANCIAL_DOSSIER.md
│       ├── TATA_POWER_FINANCIAL_PROFILE.md
│       ├── reliance_extracted.json
│       ├── reliance_industries.json
│       ├── tata_power.json
│       └── tatapower_extracted.json
│
├── docs/                               # System documentation and knowledge vault
│   ├── architecture/                   # High-level architecture and system design specs
│   │   ├── SUTRA_System_Architecture_Specification.md
│   │   └── VERA_CONCEPT_AND_SYSTEM_ARCHITECTURE.md
│   ├── capabilities/                   # Feature registries and capability vaults
│   │   ├── SUTRA_MASTER_CODE_AND_CAPABILITY_VAULT.md
│   │   └── SYSTEM_CAPABILITIES_REGISTRY.md
│   └── progress/                       # Milestones and execution changelogs
│       └── PROGRESS.md
│
├── infrastructure/                     # Deployment and local services configuration
│   ├── docker/                         # Production multi-stage Dockerfiles
│   │   └── README.md
│   ├── nginx/                          # Nginx reverse proxy configuration
│   │   └── README.md
│   ├── postgres/                       # Postgres database initialization scripts
│   │   └── init.sql                    # pgvector extension & database bootstrap
│   └── searxng/                        # SearXNG meta-search engine settings
│       └── settings.yml                # Configured search engines (Google, Bing, DDG, News)
│
├── packages/                           # Shared monorepo packages
│   ├── prompts/                        # System prompts and LLM templates
│   ├── python-common/                  # Shared Python utilities across api and worker
│   └── shared-types/                   # Shared TypeScript and Pydantic schemas
│
├── scripts/                            # Operational utilities and native binaries
│   ├── evaluate_qwen_vera.py           # Automated evaluation script for Qwen-Vera
│   ├── generate_financial_profiles.py  # Script generating financial profiles from raw data
│   ├── ocr.swift                       # Swift source code for Apple Vision Neural Engine OCR
│   └── sutra-ocr                       # Compiled native ARM64 Mach-O binary for zero-hallucination OCR
│
├── tests/                              # Automated integration and stress test suites
│   ├── fixtures/                       # Audio and document fixtures for testing
│   │   └── test_voicenote.wav          # 16kHz PCM audio sample for Whisper testing
│   ├── test_artha_conversational.py    # Tests for conversational education & general market queries
│   ├── test_financial_intelligence_upgrade.py # 19 acceptance tests across beginner/intermediate/CFA tiers
│   ├── test_ingestion.py               # Tests for multimodal PDF, Image, Audio, OCR ingestion
│   ├── test_investigation.py           # Tests for statutory evidence verification engine
│   ├── test_research_engine.py         # Tests for autonomous web crawler and SearXNG discovery
│   ├── test_supabase_memory.py         # Tests for Supabase pgvector semantic memory, conversations & auth
│   └── test_verification_stress.py     # 15-case verification stress test suite
│
└── training/                           # Fine-tuning and local Ollama model management
    ├── Modelfile.qwen-vera             # Ollama Modelfile bundling the financial system prompt
    ├── build_ollama_qwen.sh            # Build script creating `qwen-vera:4b` in local Ollama
    ├── dataset_generator.py            # Synthetic financial Q&A dataset generator
    ├── train_qwen_vera.py              # PyTorch / Unsloth fine-tuning pipeline
    ├── QWEN_3_4B_VERA_TRAINING_AND_INFERENCE_SPEC.md
    └── dataset/                        # Prepared training datasets
        ├── train.jsonl
        └── val.jsonl
```

---

## 📂 Folder-by-Folder Breakdown

### 1. Root Directory (`/`)

| File / Folder | Type | Description |
| :--- | :--- | :--- |
| `.env` / `.env.example` | Config | Environment variables for Ollama host (`http://localhost:11434`), SearXNG (`http://localhost:8080`), Redis, Postgres, and MinIO. |
| `docker-compose.yml` | Orchestration | Starts local infrastructure services: SearXNG meta-search engine, Redis cache/broker, Postgres with pgvector, and MinIO object storage. |
| `Makefile` | CLI Helper | Convenient shortcut targets: `make install`, `make infra-up`, `make api-dev`, `make web-dev`, `make test`, `make lint`. |
| `pytest.ini` | Config | Sets pytest defaults (`asyncio_mode = auto`, `testpaths = tests`). |
| `requirements.txt` | Dependency | Root Python requirements pinning FastAPI, Pydantic, httpx, Crawl4AI, PyMuPDF, Faster-Whisper, and testing libraries. |
| `README.md` | Documentation | High-level summary of VERA platform capabilities, quickstart, and features. |
| `PROJECT_STRUCTURE.md`| Documentation | Master guide documenting folder locations, contents, and architecture. |

---

### 2. Applications (`apps/`)

Contains the core microservices of the VERA platform.

#### 2.1 FastAPI Backend (`apps/api/`)
- **Location**: `apps/api/`
- **Entrypoint**: `apps/api/src/main.py`
- **Port**: `8000`
- **Sub-folders & Modules**:
  - `src/main.py`: Creates FastAPI application, applies CORS middleware, registers routers (`/api/v1/chat`, `/api/v1/ingestion`, `/api/v1/investigation`, `/api/v1/research`).
  - `src/core/`:
    - `config.py`: Core application settings, Redis, Ollama, and database connection strings.
    - `logging.py`: Structured logger configuration.
    - `supabase.py`: Privileged backend Supabase client singleton (`get_supabase`) utilizing service role authentication.
    - `auth.py`: Supabase JWT validation dependency (`get_current_user`) for multi-user isolation with guest fallback.
  - `src/modules/auth/`:
    - `router.py`: Identity and session introspection (`GET /api/v1/auth/me`).
  - `src/modules/chat/`:
    - `router.py`: Handles conversational financial intelligence chat requests (`POST /api/v1/chat`). Dispatches messages to `FinancialIntelligenceEngine` or `EvidenceInvestigationService`, with automatic Supabase conversation session tracking, memory context injection, and asynchronous background memory extraction.
  - `src/modules/memory/`:
    - `domain/models.py`: Domain entities for conversations, messages, and memories.
    - `domain/extractor_models.py`: Pydantic candidate models for LLM-driven memory extraction.
    - `infrastructure/embeddings.py`: SentenceTransformer 384-dimensional vector embedding generator (`paraphrase-multilingual-MiniLM-L12-v2`).
    - `infrastructure/repository.py`: Supabase PostgreSQL repository for CRUD on `vera_conversations`, `vera_messages`, and `vera_memories` with `match_vera_memories` pgvector cosine similarity RPC.
    - `application/service.py`: `MemoryService` managing conversation history, deduplication-aware storage (`remember_safely`), context aggregation, and background extraction.
    - `application/extractor.py`: Ollama-based preference, project, and fact extractor for long-term user memory.
    - `application/context.py`: Formatter bridging database memories into LLM prompt contexts.
    - `presentation/router.py`: Endpoints for remembering and semantic memory recall (`/api/v1/memory`).
    - `presentation/conversation_router.py`: Endpoints for managing conversations (`/api/v1/conversations`).
  - `src/modules/ingestion/`:
    - `domain/entities.py`: Pydantic models for ingested claims, assertions, extracted numbers, and channels (`IMAGE`, `PDF`, `AUDIO`, `TEXT`).
    - `domain/services.py`: De-hyping engine and assertion decomposition separating factual/informational inquiries from viral claims.
    - `infrastructure/extractors/`:
      - `pdf_extractor.py`: Extracts corporate PDF disclosures using PyMuPDF.
      - `vision_extractor.py`: Pixel-level OCR via Apple Vision Neural Engine binary (`scripts/sutra-ocr`) and semantic visual analysis via Gemma 3/Qwen.
      - `audio_extractor.py`: Transcribes earnings calls and audio voice notes using Faster-Whisper.
    - `presentation/router.py`: Exposes `POST /api/v1/ingestion/analyze-file` and `POST /api/v1/ingestion/analyze-text`.
  - `src/modules/investigation/`:
    - `domain/verification_service.py`: Decision-first claim verification engine. Matches claims against Tier-1 statutory filings (BSE/NSE/SEBI), checks monetary tolerances, and computes verdicts (`CONFIRMED_TRUE`, `EXAGGERATED_FALSE`, `BASELESS_RUMOR`).
    - `presentation/router.py`: Exposes `POST /api/v1/investigation/verify-claim`.
  - `src/modules/research/`:
    - `domain/intent_taxonomy.py`: 18-layer financial intent classifier and dynamic entity resolver. Handles pronouns (`its`, `it`, `iska`) from conversation history.
    - `application/financial_intelligence_engine.py`: Core financial intelligence assistant. Routes intents, calculates financial ratios deterministically via `FinancialCalculator`, incorporates Supabase user memory context, and calls local Ollama models (`qwen-vera:4b`, `qwen2.5:3b`, `gemma3:4b`) to generate human-readable, educational responses.
    - `application/gemma_simplification_pipeline.py`: Dynamically synthesizes Perplexity-grade decision-first audit reports for the Evidence Tracker tab.
    - `application/qwen_reasoning_pipeline.py`: Complex multi-step reasoning pipeline for forensic analysis.
    - `infrastructure/crawler/`:
      - `client.py`: Asynchronous headless web crawler via Crawl4AI.
      - `ssrf_guard.py`: Enforces SSRF protection blocking localhost, private subnets, and metadata endpoints.
      - `searxng_client.py`: Queries local SearXNG meta-search engine across Google, Bing, and DuckDuckGo.
      - `service.py`: Orchestrates discovery, scraping, and LLM-ready markdown extraction.
    - `infrastructure/data_gatherer.py`:
      - `ArthaDataGatherer`: Live web intelligence gatherer crawling Google News RSS, Bing News, live stock prices, and statutory filings for any company.

#### 2.2 Next.js Frontend (`apps/web/`)
- **Location**: `apps/web/`
- **Framework**: Next.js 16 (Turbopack, React 19, TypeScript)
- **Port**: `3000`
- **Sub-folders & Modules**:
  - `public/`: Static vectors (`vera_logo.svg`, standard icons).
  - `src/app/`: Next.js App Router entrypoint (`page.tsx`, `layout.tsx`, `globals.css`).
  - `src/components/`:
    - `VeraLandingPage.tsx`: Institutional search-first landing page with mission statement badge (*"Making financial information simple, transparent, verified, and easy to understand"*) and live BSE/NSE ticker resolution.
    - `VeraNavbar.tsx`: Screener-style top navigation bar with live indices ticker, overview, terminal, screens, and visualizer switches.
    - `ui/LanguageSelector.tsx`: Glassmorphism 20 Indian languages selector modal with instant search and native script rendering.
    - `CompanyView.tsx`: 10-Year historical statements (Profit & Loss, Balance Sheet, Cash Flow), DuPont capital efficiency metrics, and credit ratios.
    - `VeraConversationalChat.tsx` (in `chat/`): Conversational Financial Intelligence interface supporting bilingual questions, follow-ups, verified source expansion, and interactive financial topic pills.
    - `VeraEvidenceTracker.tsx`: Full statutory audit studio displaying official exchange filing comparisons, math discrepancy breakdowns, and source credibility bars.
    - `VeraAssistantDrawer.tsx`: Slide-in dual-mode drawer hosting both Artha Copilot and the SEBI Evidence Tracker.
    - `WatchlistView.tsx`: Tracked equities list with custom metric sorting and quick audit triggers.
    - `CrawlerAnimationScreen.tsx`: Real-time radar visualization of active web crawling and SearXNG engine queries.
    - `IngestionStudio.tsx`: Drag-and-drop file upload studio for PDFs, screenshots, and audio recordings.
    - `financial/`: 15 interactive financial chart components (Waterfall, Treemap, Working Capital, ROIC vs WACC, Capital Allocation, Valuation Multiples).
    - `chat/`: Chat message renderers, bento grids, and Supabase vector memory vault drawer.
    - `visualization/`: EChart wrappers, Global Financial Time Machine slider, and interactive metric visualizers.
  - `src/data/`:
    - `mockCompanies.ts`: Curated database of listed companies (Reliance, Tata Power, Adani Wilmar, All E Tech) with audited 10-year financials, ratios, and filings.
  - `src/lib/`:
    - `supabase.ts`: Supabase client and vector memory authentication helpers.
    - `utils.ts`: Number formatting (Lakh, Crore, INR ₹, percentages) and CSS class merging.
  - `src/state/`:
    - `languageStore.ts`: Constitutional 20 Indian languages store providing full-platform localization and translations.
    - `chatStore.ts`: Client-side state store for chat history and active company selection.
    - `visualizationStore.ts`: Dynamic visualizer state, time slider indices, and multi-metric curves.

#### 2.3 Background Worker (`apps/worker/`)
- **Location**: `apps/worker/`
- **Role**: Celery asynchronous worker processing long-running batch ingestion, continuous RSS news feeds, and recurring scraping tasks.

---

### 3. Assets (`assets/`)

- **Location**: `assets/`
- **Contents**:
  - `brand/vera_logo.svg`: Canonical vector logo for VERA.
  - `reference/PHOTO-2026-10-03-15-59-48.jpg`: Reference UI mockup and financial design system guidelines.

---

### 4. Data Store (`data/`)

- **Location**: `data/`
- **Contents**:
  - `data/financials/`:
    - `raw/`: Raw scraped HTML pages from official disclosures (Reliance Industries, Tata Power).
    - `RELIANCE_INDUSTRIES_FINANCIAL_PROFILE.md`: Verified fundamental profile for Reliance Industries (FY24 / Q3 FY25).
    - `TATA_POWER_FINANCIAL_PROFILE.md`: Verified profile for Tata Power.
    - `TATA_AND_RELIANCE_MASTER_FINANCIAL_DOSSIER.md`: Comprehensive financial audit and peer benchmark dossier.
    - `*.json`: Extracted structured balance sheets, P&L statements, cash flow statements, and segment revenue breakdowns.

---

### 5. Documentation (`docs/`)

- **Location**: `docs/`
- **Contents**:
  - `architecture/`:
    - `VERA_CONCEPT_AND_SYSTEM_ARCHITECTURE.md`: Complete theoretical and architectural specification of the VERA platform.
    - `SUTRA_System_Architecture_Specification.md`: Technical specification covering 5-stage pipeline, provenance scoring, and multimodal extractors.
  - `capabilities/`:
    - `SYSTEM_CAPABILITIES_REGISTRY.md`: Registry of verified capabilities, endpoints, and accuracy metrics.
    - `SUTRA_MASTER_CODE_AND_CAPABILITY_VAULT.md`: Repository of core algorithms, normalizers, and forensic prompt specifications.
  - `progress/`:
    - `PROGRESS.md`: Execution timeline, milestones completed, and test logs.

---

### 6. Infrastructure (`infrastructure/`)

- **Location**: `infrastructure/`
- **Contents**:
  - `docker/`: Production containerization files.
  - `nginx/`: Nginx reverse proxy templates for production SSL and load balancing.
  - `postgres/init.sql`: SQL script enabling `pgvector` extension for semantic embedding storage.
  - `searxng/settings.yml`: Configuration for private SearXNG meta-search instance. Enables Google, Bing, DuckDuckGo, and financial registries.

---

### 7. Shared Packages (`packages/`)

- **Location**: `packages/`
- **Contents**:
  - `prompts/`: Centralized prompt templates for extraction, classification, and verification.
  - `python-common/`: Shared database, logging, and networking utilities.
  - `shared-types/`: Shared TypeScript and Pydantic schemas ensuring end-to-end type safety between API and Web.

---

### 8. Scripts & Binaries (`scripts/`)

- **Location**: `scripts/`
- **Contents**:
  - `sutra-ocr`: Compiled native ARM64 Mach-O binary utilizing Apple Vision Neural Engine. Performs zero-hallucination OCR on screenshots and balance sheets with native Rupee (`₹`) symbol normalization.
  - `ocr.swift`: Swift source code for compiling `sutra-ocr`.
  - `generate_financial_profiles.py`: Extracts structured JSONs from raw financial HTML tables.
  - `evaluate_qwen_vera.py`: Evaluates local Ollama models on accuracy, de-hyping, and financial reasoning.

---

### 9. Automated Test Suite (`tests/`)

- **Location**: `tests/`
- **Contents**:
  - `fixtures/test_voicenote.wav`: 16kHz PCM audio file containing a synthetic financial rumor note for testing Faster-Whisper.
  - `test_financial_intelligence_upgrade.py`: 19 comprehensive tests validating beginner (Hinglish/simple), intermediate, and advanced CFA queries with live Ollama generation.
  - `test_artha_conversational.py`: Tests general market conceptual questions and statutory rumor verification.
  - `test_ingestion.py`: Verifies multimodal intake across PDFs, images, OCR, and audio.
  - `test_investigation.py`: Verifies Perplexity-style statutory evidence checking and verdict cards.
  - `test_research_engine.py`: Verifies SearXNG discovery, Crawl4AI scraping, and SSRF security guard.
  - `test_verification_stress.py`: 15-case verification stress test suite.

---

### 10. Model Training & Ollama Specs (`training/`)

- **Location**: `training/`
- **Contents**:
  - `Modelfile.qwen-vera`: Ollama configuration bundling the customized financial intelligence system prompt.
  - `build_ollama_qwen.sh`: Script to automatically build and register `qwen-vera:4b` in local Ollama.
  - `dataset_generator.py`: Synthetic dataset generator producing high-quality bilingual financial question/answer pairs.
  - `train_qwen_vera.py`: Fine-tuning pipeline using PyTorch / Unsloth for Qwen models.
  - `dataset/train.jsonl` & `dataset/val.jsonl`: Training and validation datasets for model fine-tuning.
  - `QWEN_3_4B_VERA_TRAINING_AND_INFERENCE_SPEC.md`: Inference benchmarks and training specification.

---

## 🔄 Component Interaction & Data Flow

```text
[ User Query / Document / Audio / Claim ]
                   │
                   ▼
       [ Ingestion Pipeline ]
  (PyMuPDF / Apple Vision OCR / Faster-Whisper)
                   │
                   ▼
       [ Intent & Entity Classifier ]
           (intent_taxonomy.py)
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
[ General Financial Query ]   [ Statutory Rumor / Claim ]
      │                         │
      │                         ▼
      │              [ Autonomous Web Crawler ]
      │           (SearXNG + Crawl4AI + Live Search)
      │                         │
      │                         ▼
      │              [ Provenance Scoring ]
      │           (Tier-1 Exchange Filings Audit)
      │                         │
      ▼                         ▼
[ Financial Calculator ] ───► [ Ollama LLM Inference ]
(PAT, CFO, ROIC, Debt)      (qwen-vera:4b / gemma3:4b)
                                │
                                ▼
                   [ Decision-First Response ]
               - Beginner / Advanced Explanation
               - Verifiable BSE/NSE Citations
               - Investor Protection Notice
```

---

## 💻 Development & Execution Commands

### Prerequisites
- Python 3.12+ (Active virtual environment in `.venv/`)
- Node.js 18+ (in `apps/web/`)
- Local Ollama running with `qwen-vera:4b` or `qwen2.5:3b` (`ollama serve`)

### Running the Full Stack

```bash
# 1. Start Docker Infrastructure (SearXNG, Redis, Postgres)
docker compose up -d searxng redis postgres

# 2. Start FastAPI Backend (Port 8000)
source .venv/bin/activate
uvicorn apps.api.src.main:app --host 0.0.0.0 --port 8000 --reload

# 3. Start Next.js Frontend (Port 3000)
cd apps/web
npm run dev
```

### Running Test Suites

```bash
# Run all financial intelligence & conversational tests
PYTHONPATH=. ./.venv/bin/pytest tests/test_financial_intelligence_upgrade.py tests/test_artha_conversational.py

# Run multimodal ingestion & OCR tests
PYTHONPATH=. ./.venv/bin/pytest tests/test_ingestion.py

# Run web crawler & statutory verification tests
PYTHONPATH=. ./.venv/bin/pytest tests/test_research_engine.py tests/test_investigation.py

# Build frontend to check TypeScript correctness
npm --prefix apps/web run build
```

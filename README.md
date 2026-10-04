<div align="center">

# 🏛️ VERA: Verified Evidence & Regulatory Analysis
### *India’s Digital Public Good for Capital Market Integrity & Investor Defense*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![SEBI LODR](https://img.shields.io/badge/SEBI%20LODR-Reg%2030%2F33-emerald?style=for-the-badge)](https://www.sebi.gov.in)
[![20 Indian Languages](https://img.shields.io/badge/Languages-20%20Bhartiya%20Bhashayein-orange?style=for-the-badge)](#-2-financial-inclusion-in-20-indian-languages)
[![License](https://img.shields.io/badge/Charter-Digital%20Public%20Good-purple?style=for-the-badge)](#-public-good-charter--regulatory-notice)

<br/>

> ### 🟢 **“Making financial information simple, transparent, verified, and easy to understand for every Indian citizen.”**

</div>

---

## 🎬 Master Workflow Demonstration (1:42)

![VERA Full Workflow Demo](docs/recordings/vera_full_workflow.gif)

* **📹 High-Definition Master Video**: [Download / Watch MP4 (1440x900, 1m 42s)](docs/recordings/vera_full_workflow.mp4) | [Open WebM Video](docs/recordings/vera_full_workflow.webm)
* **🎙️ Voiceover Narration Script**: [`docs/VERA_VOICEOVER_SCRIPT.md`](docs/VERA_VOICEOVER_SCRIPT.md) *(Includes both plain-English teleprompter and high-energy Hindi script)*
* **📸 Screenshot Walkthrough Gallery**: [`docs/screenshots/workflow/`](docs/screenshots/workflow/)

---

## 💡 Why VERA Exists: The Crisis in Indian Retail Investing

India is experiencing the largest retail wealth-creation wave in human history, with over **160 million Demat accounts**. Yet, everyday retail citizens face an asymmetric, unfair dilemma:

1. **The Noise Extreme (Social Speculation & Fraud)**: Predatory WhatsApp tip cartels, Telegram pump-and-dump groups, and fraudulent finfluencers hyping penny stocks.
2. **The Friction Extreme (Statutory Inaccessibility)**: Authentic corporate truth is buried inside 400-page annual reports, dense SEBI LODR filings, and cryptic stock exchange circulars that average citizens cannot easily parse.
3. **The Commercial Conflict of Interest**: Legacy terminals (Bloomberg, Refinitiv) cost ₹20+ Lakhs/year, while retail brokerages are commercially incentivized to maximize trade volume, not truth.

### The Solution: VERA as a Digital Public Good
Just as **UPI** turned digital payments into open national public infrastructure, **VERA** provides an open, evidence-first, zero-paywall truth layer for capital markets. VERA guarantees one foundational invariant: **Financial facts must be strictly derived from authentic stock exchange filings and deterministic math, never from LLM hallucinations or unverified social tips.**

---

## 🚀 Key Features & Capabilities

### 1. Search-First Universal Terminal
* **Sub-Second BSE & NSE Resolution**: Instant multi-exchange ticker matching with live share prices, 52-week channels, market capitalization, and audited badges.
* **10-Year Audited Financial Statements**: Complete historical Profit & Loss, Balance Sheet, Cash Flow, and working capital cycles without clutter or paywalls.
* **DuPont Capital Efficiency Breakdown**: Institutional-grade return on capital employed (ROCE) and return on equity (ROE) decomposition.

### 2. Financial Inclusion in 20 Indian Languages
* Native support across **twenty Eighth Schedule Indian languages**:
  * *Hindi (`हिन्दी`), Bengali (`বাংলা`), Telugu (`తెలుగు`), Marathi (`मराठी`), Tamil (`தமிழ்`), Urdu (`اردو`), Gujarati (`ગુજરાતી`), Kannada (`ಕನ್ನಡ`), Malayalam (`മലയാളം`), Odia (`ଓଡ଼ିଆ`), Punjabi (`ਪੰਜਾਬੀ`), Assamese (`অসমীয়া`), Maithili (`मैथिली`), Santali (`ᱥᱟᱱᱛᱟᱲᱤ`), Kashmiri (`کٲشُر`), Nepali (`नेपाली`), Konkani (`कोंकणी`), Sindhi (`سنڌي`), Dogri (`डोगरी`), Sanskrit (`संस्कृतम्`).*
* Instant, one-click localization across terminal statements, search placeholders, and conversational AI.

### 3. The 10-Year Global Financial Time Machine
* Interactive visual canvas with a **decade-long Time Machine slider** (FY15 to FY24).
* Watch operating revenue, EBITDA margins, PAT, and free cash flows recalculate dynamically across economic cycles with zero lag.

### 4. Artha — The Non-Advisory AI Financial Copilot
* A conversational tutor built on a 60-point pedagogical specification.
* Answers complex business model and segment mix queries in plain, human language.
* **Traceable Regulatory Citations**: Every single answer includes clickable links to official corporate disclosures.
* **Supabase Vector Memory Vault**: Stores long-term user context and investor preferences via 384-dimensional semantic embeddings (`pgvector`).

### 5. SEBI LODR 30/33 Statutory Evidence Tracker & Rumor Buster
* Cross-examines viral claims directly against BSE and NSE continuous disclosure archives.
* **Mathematical Invariant Verifier**: Audits claimed contract numbers vs official letter of awards.
* Computes unbiased verdicts (`CONFIRMED_TRUE`, `EXAGGERATED`, `DEBUNKED_FAKE`, `UNSUBSTANTIATED`) with an authoritative **Tier-1 Credibility Score (1.00)**.

---

## 🗺️ Visual Architecture & Codebase Map

```text
VERA/
├── apps/
│   ├── api/                          # FastAPI Backend Engine (Port 8000)
│   │   ├── src/main.py               # API factory, CORS, router registry
│   │   └── src/modules/
│   │       ├── chat/                 # Artha Conversational Copilot & intent routing
│   │       ├── investigation/        # SEBI LODR 30/33 Invariant Verifier & claim audit
│   │       ├── research/             # Live crawler, SearXNG client & financial math
│   │       ├── ingestion/            # Multimodal PDF, OCR & Whisper audio intake
│   │       └── memory/               # Supabase pgvector semantic memory store
│   │
│   ├── web/                          # Next.js 16 Web Application (Port 3000)
│   │   ├── src/app/page.tsx          # Main multi-view navigation & layout
│   │   ├── src/components/
│   │   │   ├── VeraLandingPage.tsx   # Search-first landing page & mission badge
│   │   │   ├── CompanyView.tsx       # 10-Yr audited financial terminal
│   │   │   ├── VeraAssistantDrawer.tsx # Slide-in drawer for Artha & Evidence Tracker
│   │   │   ├── VeraEvidenceTracker.tsx # Rumor Buster & statutory filings auditor
│   │   │   ├── ui/LanguageSelector.tsx # 20 Indian languages glassmorphism modal
│   │   │   └── visualization/        # Time Machine slider & 15 financial charts
│   │   └── src/state/
│   │       ├── languageStore.ts      # Constitutional 20 languages translation store
│   │       └── visualizationStore.ts # Chart state & time slider indices
│   │
│   └── worker/                       # Celery asynchronous background worker
│
├── docs/                             # Comprehensive specifications & media
│   ├── VERA_VOICEOVER_SCRIPT.md      # Teleprompter video narration guide
│   ├── VERA_SYSTEM_FUNCTIONALITY_AND_ARCHITECTURE.md # Full architecture manual
│   ├── recordings/                   # Master MP4, WebM, and animated GIF files
│   └── screenshots/workflow/         # Complete 14-step high-res screenshot suite
│
├── tests/                            # Automated unit & stress verification tests
├── docker-compose.yml                # SearXNG, Redis, Postgres, MinIO container stack
├── Makefile                          # Development lifecycle shortcuts
└── PROJECT_STRUCTURE.md              # Complete file-by-file directory guide
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Python 3.12+**
- **Node.js 18+** & **npm**
- **Docker & Docker Compose** (for SearXNG and local vector stores)

### 2. Start Supporting Infrastructure
```bash
docker compose up -d searxng redis postgres minio
```

### 3. Start the Backend API (FastAPI)
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn apps.api.src.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Start the Web Frontend (Next.js 16)
```bash
cd apps/web
npm install
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing & Code Verification

VERA enforces strict testing across financial calculations, multi-modal ingestion, and statutory verification:

```bash
# Run backend test suite
.venv/bin/pytest tests/test_research_engine.py tests/test_investigation.py tests/test_ingestion.py

# Run TypeScript compile & type safety check
cd apps/web && npm run type-check

# Run linters
make lint
```

---

## 🏛️ Public Good Charter & Regulatory Notice

**VERA is an open, non-profit digital public good.**  
- **No Commercial Bias**: VERA does not execute trades, sell sponsored stock placements, or push trading ideas.
- **Educational & Verification Tool**: VERA is not a registered SEBI Investment Advisor or Research Analyst. It does not provide buy/sell recommendations.
- **Statutory Reliance**: All corporate assertions are strictly cross-examined against public BSE and NSE regulatory disclosures under SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.

---

<div align="center">

**VERA — Simple. Transparent. Verified.**  
*Democratizing institutional financial intelligence for 1.4 billion citizens.*

</div>

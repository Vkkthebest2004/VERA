# 🔒 SUTRA — System Capabilities & Codebase Registry

> **STRICT ENGINEERING DIRECTIVE**:  
> This document is the canonical registry of all implemented features, domain modules, AI engines, and UI components in the SUTRA codebase. **No feature, route, extractor, or component documented here may be deleted, stripped, or bypassed in future iterations.**

---

## 📌 Master System Architecture Overview

```text
USER MULTI-MODAL INPUT (Text, WhatsApp Forward, Image, Screenshot, Voice Note, Audio, PDF, URL)
                                      ↓
[1. MULTI-MODAL INGESTION LAYER]
├── PyMuPDF Engine (Native PDF text & page geometry)
├── Apple Vision Neural Engine OCR (`scripts/sutra-ocr` — pixel-accurate text & table extractor)
└── Faster-Whisper Engine (`faster_whisper_base_int8` — speech-to-text with language probability)
                                      ↓
[2. INTELLIGENCE & DE-HYPING ENGINE]
├── Emojis & Sensationalism Filter (Calculates Hype Score: 0.0 to 1.0)
├── SEBI-Aligned Red Flag Detector (Guaranteed Returns, Upper Circuit Pumps, Urgency/FOMO, Anonymous Tips)
├── Financial Anchor Extractor (BSE/NSE Tickers, Companies, Currencies, Crores/Lakhs/BPS)
└── Atomic Assertion Decomposer (Breaks compound claims into isolated verifiable statements)
                                      ↓
[3. HUMAN-READABLE TRANSLATION LAYER]
├── Google Gemma 3 Multimodal (`gemma3:4b` via Ollama) plain-English executive narrative
├── Financial Metric Decoder (Translates basis points, crores, YoY/QoQ percentages into everyday meaning)
└── Verification Questions Generator (Formulates critical queries for exchange cross-examination)
                                      ↓
[4. EVIDENCE INVESTIGATION & VERIFICATION ENGINE]
├── Authoritative Filings Repository (`CANONICAL_FILINGS` — BSE, NSE, SEBI statutory disclosures)
├── Source Provenance Hierarchy (Tier 1 Regulatory, Tier 2 Company Filings, Tier 3 Media, Tier 4 Social)
├── Claim ↔ Evidence Reconciler (5 Statuses: SUPPORTED, PARTIALLY_SUPPORTED, CONTRADICTED, INSUFFICIENT, UNVERIFIED)
├── Numerical Reconciliation Engine (Compares claimed figures vs official filing numbers; e.g. 10x overstatement)
└── Evidence Trail with Coordinates (Document Title, Date, Page Number, Paragraph Number, Exact Quote)
                                      ↓
[5. INVESTOR PROTECTION & RECOVERY LAYER]
├── Risk Level Classification (`HIGH_RISK`, `EXTREME_RISK`, `LOW`)
├── SEBI SCORES Integration (`https://scores.sebi.gov.in` for grievance filing)
├── SEBI Intermediary Registry Check (Verifies legal license of tip providers)
└── Actionable Safe Capital Checklist
                                      ↓
[6. PRODUCTION MINIMAL FRONTEND STUDIO (`apps/web`)]
├── Unified Omni-Box (Accepts text, URLs, drag-and-drop attachments for PDF, images, audio)
├── Master Verdict Banner (`OFFICIALLY VERIFIED`, `MISLEADING / 10x EXAGGERATED`, `DEBUNKED`, `UNSUBSTANTIATED`)
├── Numerical Variance Table (Claimed vs Official Filing)
├── Traceable Evidence Explorer (Tier badges, page/para coordinates, raw filing links)
├── Human-Readable Translation & Decoded Figures
├── Exact Verbatim Monospace Viewer (Line-numbered verbatim transcript with copy button)
└── Investor Rights Action Card (SEBI SCORES & Advisory Verification)
```

---

## 📂 File Registry & Protected Assets

The following files must be preserved and maintained:

### 1. Ingestion & Multi-Modal Domain (`apps/api/src/modules/ingestion/`)
* **[`domain/entities.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/ingestion/domain/entities.py)**:
  * Entities: `ChannelType`, `RedFlagSeverity`, `RedFlagIndicator`, `FinancialEntity`, `FinancialMetric`, `ExtractedAssertion`, `FactCheckDossier`.
  * **Protected**: Do not remove `raw_verbatim_text` or `human_readable_explanation`.
* **[`domain/services.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/ingestion/domain/services.py)**:
  * `FinancialInformationDehypingService`: Calculates hype score, detects SEBI red flags, extracts entities and metrics, decomposes claims into assertions.
* **[`domain/explanation_layer.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/ingestion/domain/explanation_layer.py)**:
  * `HumanReadableExplanationLayer`: Translates dense financial jargon into plain English; decodes basis points and crores; connects to Gemma 3.
* **[`infrastructure/extractors.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/ingestion/infrastructure/extractors.py)**:
  * `MultiModalExtractor`:
    * `extract_from_pdf`: Native PyMuPDF text & page parsing.
    * `extract_from_image`: Native Apple Vision Neural Engine OCR (`scripts/sutra-ocr`) + Google Gemma 3 Multimodal (`gemma3:4b` via Ollama).
    * `extract_from_audio`: Faster-Whisper (`faster_whisper_base_int8`) speech-to-text with language detection.
* **[`presentation/router.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/ingestion/presentation/router.py)**:
  * Endpoints: `POST /api/v1/ingestion/analyze-text`, `POST /api/v1/ingestion/analyze-file`, `POST /api/v1/ingestion/analyze-url`, `GET /api/v1/ingestion/presets`.

### 2. Evidence Investigation & Verification Domain (`apps/api/src/modules/investigation/`)
* **[`domain/entities.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/investigation/domain/entities.py)**:
  * Entities: `SourceTier`, `VerificationStatus`, `OverallVerdict`, `EvidencePassage`, `NumericalReconciliation`, `AssertionInvestigation`, `InvestorProtectionGuidance`, `InvestigationDossier`.
* **[`infrastructure/filings_repository.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/investigation/infrastructure/filings_repository.py)**:
  * `AuthoritativeFilingsRepository`: Canonical database of BSE/NSE Regulation 30 disclosures, Audited Financial Statements, and SEBI circulars with page/paragraph coordinates.
* **[`domain/verification_service.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/investigation/domain/verification_service.py)**:
  * `EvidenceInvestigationService`: Evaluates assertions against filings, performs numerical variance reconciliation, identifies contradictions, enforces **Absence of Evidence != False**, and generates investor protection action plans.
* **[`presentation/router.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/api/src/modules/investigation/presentation/router.py)**:
  * Endpoints: `POST /api/v1/investigation/verify-claim`, `POST /api/v1/investigation/verify-file`.

### 3. Frontend Web Application (`apps/web/`)
* **[`src/types/ingestion.ts`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/web/src/types/ingestion.ts)** & **[`src/types/investigation.ts`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/web/src/types/investigation.ts)**: Complete TypeScript data models.
* **[`src/lib/api.ts`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/web/src/lib/api.ts)**: API client for live FastAPI integration (`analyzeText`, `analyzeFile`, `investigateClaim`, `investigateFile`).
* **[`src/components/Header.tsx`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/web/src/components/Header.tsx)**: Production minimal top bar with `SUTRA` brand and `De-Hyping Engine` mode pill.
* **[`src/components/IngestionStudio.tsx`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/web/src/components/IngestionStudio.tsx)**: Unified Omni-box with drag-and-drop file attachment and quick example loader.
* **[`src/components/InvestigationView.tsx`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/web/src/components/InvestigationView.tsx)**: Full SANGYAN investigation report (Verdict banner, Numerical table, Evidence trail, Investor Protection).
* **[`src/components/DossierView.tsx`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/apps/web/src/components/DossierView.tsx)**: Verbatim text viewer, plain-English translation layer, and red-flag barometer.

### 4. Native Tools & Infrastructure
* **[`scripts/sutra-ocr`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/scripts/sutra-ocr)**: Compiled Apple Vision Neural Engine binary for local, sub-second pixel text extraction.
* **[`docker-compose.yml`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/docker-compose.yml)**: Local infrastructure for PostgreSQL + pgvector, Redis, and MinIO.
* **[`requirements.txt`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/requirements.txt)**: Fast-Whisper, PyMuPDF, FastAPI, SQLAlchemy 2, Alembic, Ollama integrations.

### 5. Automated Test Suites
* **[`tests/test_ingestion.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/tests/test_ingestion.py)**: Ingestion, de-hyping, OCR, and audio transcription tests (6 tests).
* **[`tests/test_investigation.py`](file:///Users/vaibhavkrishnakesarwani/Desktop/VERA/tests/test_investigation.py)**: Evidence investigation, 10x numerical inflation detection, contradiction testing, and unsubstantiated stock handling (4 tests).
* **Total**: `10/10 automated tests passing`.

---

## 🛡️ Invariant Rules for Future Engineering
1. **Never Remove Verified Capabilities**: Do not replace working native OCR, Whisper, or Gemma 3 logic with mock strings.
2. **Always Preserve Provenance**: Every evidence quote must retain document title, filing date, and page/paragraph coordinates.
3. **Absence of Evidence != False**: An unverified claim must be flagged as *Unsubstantiated Speculation* with a clear note that absence of filing is not proof of falsehood.
4. **Preserve Investor Protection**: Every investigation result must retain actionable steps, the SEBI SCORES link (`https://scores.sebi.gov.in`), and the intermediary check tool.

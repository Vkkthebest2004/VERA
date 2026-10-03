# SUTRA — System Architecture Specification

**Document Status:** Canonical Architecture Baseline  
**Version:** 1.0  
**Purpose:** Source-of-truth architecture for engineering agents, backend/frontend developers, AI engineers, and infrastructure work.

---

## 1. Executive Summary

SUTRA is an evidence-first financial information verification platform. It accepts financial claims in forms such as text, screenshots, PDFs, URLs, and eventually voice; decomposes those claims into atomic assertions; identifies relevant entities and events; discovers authoritative sources; retrieves and ranks evidence; compares claims against evidence; reconstructs historical context; and produces an uncertainty-aware explanation with traceable provenance.

SUTRA is not designed as a generic chatbot. The LLM is an orchestration and reasoning component operating over retrieved evidence; it is not the source of truth. The architecture therefore treats claims, evidence, documents, sources, events, and provenance as first-class data objects.

The initial system will use a **modular monolith for the synchronous API**, an **asynchronous worker system for long-running ingestion and AI jobs**, and a **shared evidence/data layer**. This gives the project production-quality boundaries without prematurely introducing many independently deployed microservices.

The baseline technology stack is:

- Web: Next.js, React, TypeScript, Tailwind CSS
- API: Python, FastAPI, Pydantic, SQLAlchemy 2, Alembic
- Data: PostgreSQL + pgvector
- Cache/queue: Redis + Celery
- Object storage: S3-compatible storage
- Search: PostgreSQL full-text search + pgvector + reranking initially; OpenSearch is a later scale-out option
- Document processing: PyMuPDF + OCR pipeline
- AI: pluggable LLM, embedding, and reranker providers behind internal interfaces
- Observability: structured logs, request IDs, audit logs; OpenTelemetry/Sentry/metrics as deployment maturity increases
- Delivery: Docker, Docker Compose for local development, GitHub Actions for CI/CD

The existing SUTRA concept defines the same core evidence flow: claim decomposition, entity identification, source discovery, evidence retrieval, source validation, cross-document comparison, historical context, evidence assessment, and explanation. It also explicitly requires provenance and warns that absence of evidence must not automatically be treated as proof that a claim is false. fileciteturn2file3

---

# 2. Product Mission

SUTRA should turn a difficult question such as:

> “Is this financial claim actually supported by reliable evidence?”

into a transparent evidence trail:

```text
USER INPUT
   ↓
CLAIM
   ↓
ATOMIC ASSERTIONS
   ↓
ENTITIES / EVENTS
   ↓
SOURCE DISCOVERY
   ↓
DOCUMENT RETRIEVAL
   ↓
EVIDENCE EXTRACTION
   ↓
CROSS-SOURCE COMPARISON
   ↓
HISTORICAL CONTEXT
   ↓
EVIDENCE ASSESSMENT
   ↓
UNCERTAINTY-AWARE EXPLANATION
   ↓
ORIGINAL SOURCES
```

The user remains responsible for any decision made after understanding the information. SUTRA does not provide investment recommendations, price forecasts, or trading signals.

---

# 3. Architectural Goals

## 3.1 Primary goals

### Evidence-first reasoning
Every significant factual output should be grounded in retrieved evidence, structured data, or explicitly stated uncertainty.

### Strong provenance
Every evidence item must be traceable to its originating source, document, page/paragraph or equivalent location, and retrieval context where applicable.

### Source-aware retrieval
The system must distinguish between source discovery, document retrieval, evidence extraction, and interpretation.

### Modular evolution
The system should start as a modular monolith and allow search, graph, AI, or ingestion components to be extracted later without rewriting business logic.

### Async by default for heavy work
Document processing, crawling, OCR, embedding, indexing, large AI analysis, and report generation must run as background jobs.

### Provider independence
LLM, embedding, reranking, storage, and search providers must sit behind internal abstractions so models/providers can be changed without rewriting domain logic.

### Auditability
Important decisions and processing steps must be reconstructable after the fact.

### Privacy by design
Only necessary user data should be collected. Private user submissions should remain isolated from public-source data.

### Bharat-first usability
The system must accommodate simple language, multilingual inputs, and low-friction submission channels as the product expands.

---

# 4. Non-Goals

The system will not be architected around:

- buy/sell/hold recommendations
- personalized investment advice
- price prediction
- automated trading
- broker execution
- financial product promotion
- a single giant autonomous agent
- direct frontend access to databases or model providers

The original project definition explicitly distinguishes SUTRA from stock recommendation, screening, brokerage, trading, and prediction products. fileciteturn2file7

---

# 5. Core Architectural Principles

## Principle 1 — Evidence Before Interpretation

The system should retrieve and assess evidence before generating an explanation.

```text
BAD
User → LLM → Answer

SUTRA
User → Claim → Search → Evidence → Assessment → Explanation
```

## Principle 2 — The LLM Is Not the Database

The model may interpret information, but facts must come from the evidence layer.

## Principle 3 — Claims Are Atomic

One user statement may contain several independently verifiable assertions.

Example:

> “Company X acquired Company Y for ₹500 crore in March.”

becomes:

```text
A1: X acquired Y
A2: transaction value was ₹500 crore
A3: transaction completed
A4: date was in March
```

Each assertion gets its own evidence trail.

## Principle 4 — Provenance Is Data

A citation is not UI decoration. Provenance is part of the underlying data model.

## Principle 5 — Absence of Evidence Is Not Automatically False

The system must represent uncertainty and insufficient evidence explicitly. fileciteturn2file4

## Principle 6 — Synchronous APIs Stay Fast

Slow work is moved to workers and surfaced through job status/progress APIs or WebSockets.

## Principle 7 — Bounded Modules, Not Random Utility Code

Business capabilities are organized by domain modules. Shared utilities remain small and generic.

---

# 6. System Architecture Style

The selected architecture is:

> **Monorepo + Modular Monolith + Clean/Hexagonal Architecture + Asynchronous Worker Pipeline + Evidence-Centric Data Architecture**

This is intentionally not a microservices-first design.

At MVP scale, deploying many independent services would increase operational complexity without improving the core product. Instead, we keep strict module boundaries inside a single API application and a separate worker application.

Later extraction is possible:

```text
MVP

FastAPI API
   ├── Claims
   ├── Sources
   ├── Documents
   ├── Evidence
   ├── Search
   ├── Verification
   └── Context

                ↓ scale

Potential extracted services
   ├── Ingestion Service
   ├── Retrieval Service
   ├── Evidence Service
   ├── AI/Inference Service
   └── Graph Service
```

The domain/application layers should not depend on deployment topology.

---

# 7. High-Level System Architecture

```text
                                      ┌────────────────────┐
                                      │      SUTRA UI      │
                                      │ Next.js / React    │
                                      └─────────┬──────────┘
                                                │
                                      HTTPS / REST / WS
                                                │
                                                ▼
                              ┌────────────────────────────────┐
                              │            API LAYER             │
                              │             FastAPI              │
                              │                                  │
                              │ Auth / Claims / Sources          │
                              │ Documents / Evidence / Search    │
                              │ Verification / Context / Reports│
                              └──────────────┬───────────────────┘
                                             │
                ┌────────────────────────────┼────────────────────────────┐
                │                            │                            │
                ▼                            ▼                            ▼
       ┌─────────────────┐         ┌─────────────────┐          ┌─────────────────┐
       │   PostgreSQL    │         │      Redis      │          │ Object Storage  │
       │   + pgvector    │         │ Cache + Queue   │          │       S3         │
       └────────┬────────┘         └────────┬────────┘          └────────┬────────┘
                │                           │                            │
                │                           ▼                            │
                │                  ┌─────────────────┐                   │
                │                  │ Worker System   │                   │
                │                  │ Celery          │                   │
                │                  └────────┬────────┘                   │
                │                           │                            │
                │             ┌─────────────┼─────────────┐              │
                │             ▼             ▼             ▼              │
                │         Fetch/OCR      Parse/Chunk   Embed/Index       │
                │
                └──────────────────────────┬─────────────────────────────┘
                                           ▼
                                ┌──────────────────────┐
                                │   RETRIEVAL ENGINE   │
                                │                      │
                                │ Keyword             │
                                │ Metadata             │
                                │ Semantic             │
                                │ Reranking            │
                                └───────────┬──────────┘
                                            ▼
                                ┌──────────────────────┐
                                │   EVIDENCE ENGINE    │
                                │                      │
                                │ Extraction            │
                                │ Provenance            │
                                │ Support/Conflict      │
                                │ Source quality        │
                                └───────────┬──────────┘
                                            ▼
                                ┌──────────────────────┐
                                │   AI ORCHESTRATION   │
                                │                      │
                                │ Claim Decomposition  │
                                │ Query Generation      │
                                │ Evidence Analysis    │
                                │ Context Reasoning    │
                                │ Explanation          │
                                └───────────┬──────────┘
                                            ▼
                                ┌──────────────────────┐
                                │ VERIFICATION ENGINE  │
                                │                      │
                                │ Compare              │
                                │ Assess               │
                                │ Uncertainty          │
                                │ Produce findings     │
                                └───────────┬──────────┘
                                            ▼
                                      SUTRA UI
```

---

# 8. Major System Components

## 8.1 Web Application

Technology:

```text
Next.js
React
TypeScript
Tailwind CSS
```

Responsibilities:

- user authentication interface
- claim submission
- screenshot/PDF/URL upload
- verification progress
- evidence presentation
- source viewing
- timeline and relationship visualization
- report generation UI

The frontend must never call PostgreSQL, Redis, S3, or LLM providers directly.

---

## 8.2 API Application

Technology:

```text
Python
FastAPI
Pydantic
SQLAlchemy 2
Alembic
```

The API is the primary synchronous entry point.

Responsibilities:

- authentication and authorization
- request validation
- domain command/query execution
- job creation
- result retrieval
- evidence access
- search APIs
- verification APIs
- report APIs

The API owns orchestration of application use cases, not low-level parsing or long-running processing.

---

## 8.3 Worker System

Technology:

```text
Celery
Redis
```

Responsibilities:

- source fetching
- document ingestion
- OCR
- parsing
- chunking
- metadata extraction
- embeddings
- indexing
- bulk verification
- report generation

A worker task should be idempotent whenever possible.

---

# 9. Domain Module Architecture

The API application is divided into bounded business modules.

```text
modules/
├── auth/
├── users/
├── claims/
├── entities/
├── sources/
├── documents/
├── evidence/
├── search/
├── verification/
├── context/
└── reports/
```

Every module uses the same internal architecture:

```text
module/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

### Domain
Pure business rules, entities, value objects, domain events, repository contracts.

### Application
Use cases, commands, queries, orchestration.

### Infrastructure
Database implementations, external providers, storage adapters.

### Presentation
FastAPI routers, request/response schemas, HTTP-specific concerns.

This separation allows business logic to remain independent from FastAPI, SQLAlchemy, Redis, and AI vendors.

---

# 10. Canonical Internal Request Flow

A normal request follows:

```text
HTTP Request
    ↓
FastAPI Router
    ↓
Request Validation
    ↓
Authentication / Authorization
    ↓
Application Use Case
    ↓
Domain Logic
    ↓
Repository / Provider Interface
    ↓
Infrastructure Adapter
    ↓
Database / External System
    ↓
Domain Result
    ↓
Response DTO
    ↓
HTTP Response
```

The router should remain thin.

---

# 11. Core Data Architecture

The central model is an evidence graph stored primarily in relational form at MVP stage.

Core entities:

```text
User
Claim
Assertion
Entity
Source
Document
DocumentChunk
Evidence
Citation
Event
Relationship
Verification
VerificationResult
Job
AuditLog
```

The key relationships are:

```text
Claim ──contains──> Assertion
Assertion ──mentions──> Entity
Assertion ──supported_by──> Evidence
Assertion ──contradicted_by──> Evidence
Evidence ──contained_in──> DocumentChunk
DocumentChunk ──part_of──> Document
Document ──published_by──> Source
Document ──describes──> Event
Event ──involves──> Entity
Entity ──related_to──> Entity
Verification ──evaluates──> Assertion
Verification ──uses──> Evidence
```

This mirrors the project's evidence-centric design. fileciteturn2file2

---

# 12. PostgreSQL Architecture

PostgreSQL is the system of record.

Responsibilities:

- relational business data
- user data
- claim/assertion data
- document metadata
- evidence metadata
- source metadata
- event and relationship data
- verification results
- audit records
- full-text search fields
- vector embeddings through pgvector

PostgreSQL should remain authoritative even if later systems such as OpenSearch or Neo4j are introduced.

---

# 13. Vector Architecture

Use pgvector initially.

Stored embeddings may include:

```text
Document chunks
Evidence passages
Claims/assertions
Selected entity descriptions
```

Retrieval:

```text
Query
 ↓
Embedding
 ↓
pgvector similarity
 ↓
Candidate passages
 ↓
Metadata filters
 ↓
Keyword candidates
 ↓
Candidate merge
 ↓
Reranker
 ↓
Top evidence set
```

The architecture intentionally avoids using vector search as the only retrieval mechanism. The original project specification calls for keyword, semantic, and metadata search together. fileciteturn2file0

---

# 14. Search Architecture

## Stage 1 — Query understanding

Convert the assertion into search-oriented representations:

- entity names
- dates
- amounts
- keywords
- legal/financial terminology
- alternative phrasings

## Stage 2 — Candidate generation

Run in parallel:

```text
Keyword search
Metadata search
Vector search
```

## Stage 3 — Candidate fusion

Merge candidates and remove duplicates.

## Stage 4 — Reranking

A cross-encoder or equivalent reranker ranks evidence passages against the assertion.

## Stage 5 — Evidence selection

The system selects a compact, high-quality evidence set for downstream analysis.

Later, dedicated OpenSearch infrastructure can be introduced when corpus size, ranking complexity, or query volume justifies it.

---

# 15. Source Architecture

A source is not the same thing as a document.

```text
Source
 ├── publisher
 ├── source_type
 ├── authority metadata
 ├── canonical_url
 └── identity

Document
 ├── source_id
 ├── title
 ├── publication_date
 ├── retrieved_at
 ├── checksum
 ├── raw_object_uri
 └── extracted content
```

Examples of source types can include:

```text
Regulatory
Government
Company filing
Exchange disclosure
Court/public authority
News/publication
Other public source
```

Source classification must be stored explicitly so the UI and verification engine can distinguish evidence types.

---

# 16. Document Ingestion Architecture

The ingestion pipeline is asynchronous.

```text
Input
 │
 ├── URL
 ├── PDF
 ├── Image/Screenshot
 └── Future voice/video
 │
 ▼
Ingestion Job
 │
 ▼
Fetch / Upload Validation
 │
 ▼
Object Storage
 │
 ▼
Text Extraction
 │
 ├── Native text → parser
 └── Scanned document → OCR
 │
 ▼
Cleaning / normalization
 │
 ▼
Page / paragraph detection
 │
 ▼
Metadata extraction
 │
 ▼
Chunking
 │
 ▼
Embedding
 │
 ▼
Indexing
 │
 ▼
Ready Document
```

Each chunk must preserve source location metadata such as page, paragraph, document ID, URL, and publication information. This is necessary for evidence-backed output and exact source navigation. fileciteturn2file3

---

# 17. Claim Processing Architecture

The claim pipeline is:

```text
User Input
   ↓
Input Normalizer
   ↓
Claim Decomposer
   ↓
Atomic Assertions
   ↓
Entity Extraction
   ↓
Event/Date/Amount Extraction
   ↓
Search Query Generation
   ↓
Retrieval
```

Example:

```text
Input:
"XYZ acquired ABC for ₹45 crore last month."

Output:

Assertion A1
XYZ acquired ABC.

Assertion A2
Transaction value = ₹45 crore.

Assertion A3
The transaction was completed.

Assertion A4
The relevant date falls within the claimed period.
```

The decomposition output is structured data, not plain text.

---

# 18. Evidence Engine

The Evidence Engine is the central trust layer.

For each assertion it creates an evidence set:

```text
Assertion
   ↓
Candidate Evidence
   ↓
Evidence Relevance
   ↓
Source Authority
   ↓
Temporal Consistency
   ↓
Cross-source Agreement
   ↓
Contradiction Detection
   ↓
Evidence Classification
```

Evidence status should include explicit states such as:

```text
SUPPORTED
PARTIALLY_SUPPORTED
CONTRADICTED
UNVERIFIED
INSUFFICIENT_EVIDENCE
```

No status should be generated solely from an LLM free-form opinion.

---

# 19. Verification Engine

The Verification Engine receives:

```text
Assertion
+
Retrieved Evidence
+
Structured Metadata
+
Historical Context
```

It produces:

```text
VerificationResult
├── status
├── explanation
├── supporting_evidence_ids
├── conflicting_evidence_ids
├── missing_information
├── uncertainty
└── provenance
```

The LLM may help interpret the evidence, but the final object must retain explicit evidence references.

---

# 20. AI Architecture

The AI system must be provider-agnostic.

```text
infrastructure/ai/
├── llm/
│   ├── provider.py
│   ├── client.py
│   └── models.py
├── embeddings/
│   ├── provider.py
│   └── client.py
├── reranking/
│   ├── provider.py
│   └── client.py
└── extraction/
    ├── claim_extractor.py
    ├── entity_extractor.py
    └── event_extractor.py
```

Interfaces should look conceptually like:

```text
LLMProvider
EmbeddingProvider
RerankerProvider
```

This allows providers/models to be swapped without changing claim, evidence, or verification domain code.

---

# 21. AI Responsibilities

### LLM may perform

- natural-language understanding
- claim decomposition
- entity extraction
- query generation
- evidence interpretation
- cross-document comparison
- explanation generation
- language transformation

### LLM must not be treated as

- a factual database
- an authoritative source
- a citation generator without source verification
- a replacement for document retrieval

The existing SUTRA architecture explicitly defines the LLM as a reasoning/orchestration layer and requires evidence provenance for major factual claims. fileciteturn2file3

---

# 22. Prompt Architecture

Prompts are versioned code/data, not strings scattered across Python files.

```text
packages/prompts/
├── claim_decomposition/
├── entity_extraction/
├── query_generation/
├── evidence_analysis/
├── contradiction_analysis/
├── context_reconstruction/
└── explanation_generation/
```

Every prompt should have:

```text
name
version
purpose
input schema
output schema
model requirements
evaluation cases
```

Structured outputs should be validated with Pydantic schemas.

---

# 23. Context and Historical Timeline Engine

Some claims cannot be understood from one document alone.

SUTRA therefore reconstructs context:

```text
Event 1
   ↓
Event 2
   ↓
Disclosure
   ↓
Later disclosure
   ↓
Current state
```

The Context Engine uses:

- event extraction
- publication dates
- document relationships
- entity relationships
- chronological ordering
- later disclosures

The output is a structured timeline that can be rendered by the UI.

---

# 24. Evidence Graph Strategy

### MVP

Represent graph relationships in PostgreSQL using foreign keys and relationship tables.

### Growth stage

Introduce Neo4j only when graph traversals become a major workload or graph-specific algorithms provide clear value.

The authoritative business state remains synchronized to the primary data model.

This follows the original design recommendation: PostgreSQL first, Neo4j later if graph complexity warrants it. fileciteturn2file0

---

# 25. Object Storage Architecture

Binary assets live in S3-compatible storage.

```text
Object Storage
├── raw-documents/
├── screenshots/
├── extracted-assets/
├── OCR-artifacts/
└── generated-reports/
```

PostgreSQL stores:

```text
object_key
content_type
checksum
size
created_at
owner_id
```

The application should never expose unrestricted bucket access. Signed URLs or controlled download endpoints should be used.

---

# 26. Redis Architecture

Redis has three initial purposes:

### Queue transport
Celery task dispatch.

### Cache
Short-lived expensive lookups where safe.

### Rate limiting / ephemeral state
Authentication and request controls.

Redis must not become the system of record.

---

# 27. API Architecture

API versioning:

```text
/api/v1/auth
/api/v1/users
/api/v1/claims
/api/v1/documents
/api/v1/sources
/api/v1/search
/api/v1/evidence
/api/v1/verifications
/api/v1/context
/api/v1/reports
/jobs
```

Typical claim flow:

```text
POST /api/v1/claims
GET  /api/v1/claims/{id}
POST /api/v1/claims/{id}/verify
GET  /api/v1/verifications/{id}
GET  /api/v1/evidence/{id}
GET  /api/v1/documents/{id}
```

Heavy operations return a job reference:

```json
{
  "job_id": "...",
  "status": "queued"
}
```

The client can then poll or subscribe for progress.

---

# 28. Real-Time Progress

For long-running processes:

```text
POST verification
      ↓
202 Accepted
      ↓
job_id
      ↓
worker pipeline
      ↓
WebSocket / polling
      ↓
progress events
```

Example:

```text
INGESTING
EXTRACTING
SEARCHING
RERANKING
ANALYZING
VERIFYING
GENERATING_REPORT
COMPLETED
FAILED
```

---

# 29. Authentication and Authorization

Authentication should use standard modern identity mechanisms rather than embedding security logic into individual modules.

The system should support:

```text
User identity
Session/access token
Refresh mechanism
Role/permission checks
Resource ownership
```

Authorization belongs at both:

1. API/application boundary
2. domain resource ownership checks

The minimum access rule is:

> A user can access only resources they are authorized to access.

---

# 30. Security Architecture

Security controls include:

```text
TLS everywhere
Secure token/session handling
Password hashing if local credentials are used
Input validation
Content-type validation
File size limits
Upload malware/security scanning where appropriate
Rate limiting
CORS policy
CSRF protection where browser authentication requires it
Secret management
Database least privilege
Object storage access control
Audit logging
```

Sensitive secrets must never be committed.

```text
.env.example       → committed
.env               → ignored
production secrets → secret manager
```

---

# 31. Data Privacy

User-submitted data and public evidence must remain logically separated.

```text
PUBLIC DATA
├── public sources
├── public documents
└── indexed evidence

USER DATA
├── user claims
├── private uploads
└── private verification history
```

The system should not require unnecessary financial credentials or sensitive identifiers. The existing project definition explicitly emphasizes privacy by design and avoiding unauthorized harvesting of sensitive financial records or OTPs. fileciteturn2file7

---

# 32. Observability Architecture

Every important request/job should have a traceable correlation ID.

Example:

```text
request_id
   ↓
claim_id
   ↓
verification_id
   ↓
job_id
   ↓
retrieval_run_id
   ↓
evidence_ids
```

Logs should be structured JSON where possible.

Minimum telemetry:

- request latency
- API error rate
- worker failure rate
- queue depth
- document processing duration
- retrieval latency
- LLM latency
- token/cost metrics where applicable
- evidence retrieval counts
- verification failures

Later add OpenTelemetry traces, metrics dashboards, and centralized error monitoring.

---

# 33. Audit Architecture

Audit events should capture security- and trust-relevant actions such as:

```text
claim_created
claim_updated
source_added
verification_started
verification_completed
evidence_viewed
report_generated
permission_changed
```

Audit logs should be append-oriented and access-controlled.

---

# 34. Failure Handling

The architecture must assume external failures.

Possible failures:

```text
Source unavailable
PDF malformed
OCR failure
LLM timeout
Embedding service failure
Search timeout
Database connection failure
Queue failure
Storage failure
```

The system should use:

```text
Retries
Exponential backoff
Timeouts
Dead-letter/error states
Idempotency
Circuit-breaking where appropriate
Graceful degradation
```

Example:

```text
LLM unavailable
     ↓
Verification does not silently fabricate output
     ↓
Job becomes PARTIALLY_FAILED / FAILED
     ↓
User receives transparent status
```

---

# 35. Idempotency

Ingestion and processing tasks may be retried. Therefore operations should be safe to repeat.

Use stable identifiers such as:

```text
source_url
content_hash
source_document_id
claim_id
job_id
```

Example:

If the same PDF is uploaded twice, the ingestion layer can detect identical content hashes and avoid unnecessary duplicate processing where business rules permit.

---

# 36. Caching Strategy

Cache only data where staleness is acceptable.

Good candidates:

- frequently accessed public metadata
- expensive repeated query results with explicit TTL
- source discovery results where freshness policy permits

Do not cache authoritative verification state without a clear invalidation policy.

---

# 37. Consistency Model

PostgreSQL is authoritative for business state.

Derived stores are eventually consistent:

```text
PostgreSQL
    ↓
Embedding index
    ↓
Search index
    ↓
Graph projection
```

When derived state is stale, the application should prefer authoritative relational metadata and mark indexing status explicitly.

---

# 38. Repository Structure

Canonical monorepo:

```text
sutra/
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
│
├── packages/
│   ├── shared-types/
│   ├── python-common/
│   └── prompts/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── postgres/
│   └── terraform/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── decisions/
│   └── threat-model/
│
├── scripts/
├── tests/
├── .github/workflows/
├── docker-compose.yml
├── Makefile
├── README.md
└── .env.example
```

---

# 39. API Codebase Structure

```text
apps/api/
└── src/
    ├── main.py
    ├── core/
    │   ├── config.py
    │   ├── database.py
    │   ├── security.py
    │   ├── logging.py
    │   └── dependencies.py
    │
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── claims/
    │   ├── entities/
    │   ├── sources/
    │   ├── documents/
    │   ├── evidence/
    │   ├── search/
    │   ├── verification/
    │   ├── context/
    │   └── reports/
    │
    ├── infrastructure/
    │   ├── ai/
    │   ├── storage/
    │   ├── search/
    │   ├── queue/
    │   └── external/
    │
    └── shared/
        ├── exceptions/
        ├── types/
        └── pagination/
```

---

# 40. Standard Domain Module Structure

Example `claims` module:

```text
claims/
├── domain/
│   ├── entities.py
│   ├── value_objects.py
│   ├── enums.py
│   ├── exceptions.py
│   └── repositories.py
│
├── application/
│   ├── commands/
│   │   ├── create_claim.py
│   │   └── decompose_claim.py
│   ├── queries/
│   │   └── get_claim.py
│   └── services/
│       └── claim_service.py
│
├── infrastructure/
│   ├── repositories/
│   │   └── postgres_claim_repository.py
│   └── mappers.py
│
└── presentation/
    ├── router.py
    ├── schemas.py
    └── dependencies.py
```

The same pattern is applied to major business modules.

---

# 41. Worker Codebase Structure

```text
apps/worker/
└── src/
    ├── main.py
    ├── tasks/
    │   ├── ingest_document.py
    │   ├── extract_text.py
    │   ├── run_ocr.py
    │   ├── chunk_document.py
    │   ├── generate_embeddings.py
    │   ├── index_document.py
    │   └── verify_claim.py
    │
    ├── pipelines/
    │   ├── document_pipeline.py
    │   └── verification_pipeline.py
    │
    └── infrastructure/
        ├── queue.py
        ├── storage.py
        └── database.py
```

---

# 42. Verification Sequence

Canonical end-to-end flow:

```text
User
 │
 │ submit claim
 ▼
API
 │
 │ create Claim + Verification Job
 ▼
PostgreSQL
 │
 │ enqueue
 ▼
Redis
 │
 ▼
Worker
 │
 ├── Decompose claim
 ├── Extract entities
 ├── Generate queries
 ├── Search sources
 ├── Retrieve documents
 ├── Retrieve evidence passages
 ├── Rerank
 ├── Compare evidence
 ├── Build context
 ├── Assess uncertainty
 └── Generate explanation
 │
 ▼
PostgreSQL
 │
 ▼
API
 │
 ▼
Next.js
 │
 ▼
User
```

---

# 43. Example Evidence Output Object

A verification result should conceptually contain:

```json
{
  "assertion_id": "a_123",
  "status": "PARTIALLY_SUPPORTED",
  "explanation": "The primary source confirms the transaction but reports a different value.",
  "evidence": [
    {
      "evidence_id": "e_456",
      "document_id": "d_789",
      "page": 12,
      "paragraph": 43,
      "source_url": "...",
      "relationship": "supports"
    },
    {
      "evidence_id": "e_457",
      "document_id": "d_790",
      "page": 4,
      "relationship": "contradicts"
    }
  ],
  "uncertainty": "medium"
}
```

The exact production schema may change, but the underlying architectural rule does not: factual output must be traceable to evidence.

---

# 44. API and Domain Boundary Rules

### Rule A
FastAPI routers do not contain business logic.

### Rule B
Domain objects do not import FastAPI, SQLAlchemy, Redis, or vendor SDKs.

### Rule C
AI provider SDKs are isolated behind provider interfaces.

### Rule D
Repositories expose application/domain-friendly operations, not arbitrary SQL fragments.

### Rule E
Workers call application use cases rather than duplicating business logic.

### Rule F
Derived indexes do not become the source of truth.

### Rule G
Every major async operation has a persistent job state.

---

# 45. Testing Architecture

Testing is layered.

```text
Unit Tests
   ↓
Domain/Application behavior

Integration Tests
   ↓
Database / repositories / providers

API Tests
   ↓
HTTP contracts

E2E Tests
   ↓
Complete user workflows
```

Critical SUTRA test scenarios:

1. One claim produces multiple assertions.
2. Evidence can support an assertion.
3. Evidence can contradict an assertion.
4. Missing evidence does not automatically produce FALSE.
5. Every reported source maps to a real stored source/document record.
6. Private resources cannot be accessed by another user.
7. Reprocessing the same document does not corrupt the evidence graph.
8. Worker retries are safe.
9. LLM failure does not result in fabricated verification.

---

# 46. AI Evaluation Architecture

Normal software tests are not enough for AI components.

Maintain an evaluation dataset containing:

```text
Input claim
Expected assertions
Expected entities
Relevant sources
Expected evidence passages
Expected status
Known ambiguities
Known adversarial cases
```

Measure:

```text
Claim decomposition accuracy
Entity extraction accuracy
Retrieval recall
Reranking quality
Evidence grounding rate
Citation validity
Contradiction detection accuracy
Explanation faithfulness
Latency
Cost
```

The architecture should allow model versions to be benchmarked before promotion.

---

# 47. Deployment Architecture

## Development

```text
Docker Compose
├── web
├── api
├── worker
├── postgres
└── redis
```

Object storage can use S3-compatible storage or MinIO locally.

## Production MVP

```text
Internet
   ↓
Reverse Proxy / Load Balancer
   ↓
Web
   ↓
API
   ├── PostgreSQL
   ├── Redis
   └── Object Storage

Worker fleet
   ├── Redis
   ├── PostgreSQL
   └── Object Storage
```

The exact cloud provider is intentionally separated from application architecture.

---

# 48. CI/CD Architecture

Every pull request should perform:

```text
Lint
 ↓
Type checks
 ↓
Unit tests
 ↓
Integration tests
 ↓
Build
 ↓
Security checks
```

Main branch:

```text
Git push
 ↓
CI
 ↓
Docker image build
 ↓
Artifact/image registry
 ↓
Deployment
 ↓
Health checks
```

Database migrations must run through version-controlled migration tooling.

---

# 49. Scaling Strategy

The system scales horizontally by separating workloads.

### API scaling
Multiple FastAPI instances behind a load balancer.

### Worker scaling
Increase worker count based on queue depth.

### Database scaling
Indexes, query optimization, connection pooling, read replicas later if needed.

### Search scaling
Move from PostgreSQL retrieval to OpenSearch when corpus/query volume requires it.

### Graph scaling
Move graph-heavy traversal into Neo4j when justified.

### AI scaling
Dedicated inference workers or model-serving infrastructure can be introduced independently.

This is why the domain/application boundaries must not depend on deployment topology.

---

# 50. MVP Architecture Boundary

The MVP should build the complete vertical slice, not the complete future platform.

### Build now

```text
Claim submission
↓
Claim decomposition
↓
Entity extraction
↓
Source/document retrieval
↓
Hybrid search
↓
Evidence extraction
↓
Verification
↓
Evidence-backed explanation
↓
Source trail
```

### Defer

```text
Large-scale graph platform
Complex multi-region deployment
Massive crawler fleet
Real-time video understanding
Advanced recommendation/personalization
Dedicated microservice fleet
```

The existing SUTRA design similarly recommends starting with a focused MVP rather than building the full long-term vision. fileciteturn2file1

---

# 51. Recommended Technology Stack — Final Baseline

| Layer | Baseline technology | Role |
|---|---|---|
| Web | Next.js + React + TypeScript | User interface |
| Styling | Tailwind CSS | UI |
| API | Python + FastAPI | Synchronous backend |
| Validation | Pydantic | Contracts and structured AI outputs |
| ORM/Data access | SQLAlchemy 2 | PostgreSQL access |
| Migrations | Alembic | Schema evolution |
| Primary DB | PostgreSQL | System of record |
| Vector search | pgvector | Semantic retrieval |
| Queue/cache | Redis | Jobs, cache, rate limiting |
| Workers | Celery | Background processing |
| Files | S3-compatible storage | PDFs/images/raw assets |
| Text extraction | PyMuPDF | PDF extraction |
| OCR | Dedicated OCR pipeline | Scanned documents |
| Search | PostgreSQL FTS + pgvector | Initial hybrid retrieval |
| Reranking | Cross-encoder/reranker | Candidate ranking |
| AI | Pluggable LLM provider | Reasoning/generation |
| Embeddings | Pluggable embedding provider | Vector representations |
| API protocol | REST + WebSockets | Client/server communication |
| Auth | OIDC/OAuth-compatible identity layer | User identity |
| Containers | Docker | Packaging |
| Local orchestration | Docker Compose | Development |
| CI/CD | GitHub Actions | Automation |
| Observability | Structured logs + OpenTelemetry-ready design | Reliability |
| Future search | OpenSearch | Large-scale retrieval |
| Future graph | Neo4j | Graph-intensive workloads |
```

The original technical plan also identifies Next.js, FastAPI, PostgreSQL, pgvector, PyMuPDF/OCR, and PostgreSQL-first graph storage as the practical starting stack. fileciteturn2file0

---

# 52. Why This Stack

## Why FastAPI

The application combines normal API work with document processing, retrieval, data extraction, and AI workloads. A Python-first backend reduces language boundaries between product logic and AI capabilities.

## Why PostgreSQL

It provides strong relational consistency for claims, evidence, documents, users, and provenance while also supporting vector search through pgvector.

## Why Redis + Celery

Long-running jobs must be decoupled from API requests. Redis provides a straightforward queue/cache layer and Celery gives a mature Python task execution model.

## Why S3-compatible storage

Large immutable documents should not sit inside relational rows.

## Why pgvector first

It minimizes infrastructure while the corpus is still manageable. The architecture leaves a clean path to a dedicated search engine later.

## Why modular monolith

It provides domain separation without premature network boundaries, distributed deployments, and operational overhead.

---

# 53. Architecture Decision Records to Create

The repository should contain ADRs for major choices.

```text
docs/decisions/
├── ADR-001-modular-monolith.md
├── ADR-002-postgresql-as-system-of-record.md
├── ADR-003-pgvector-initial-vector-search.md
├── ADR-004-async-document-processing.md
├── ADR-005-provider-agnostic-ai-layer.md
├── ADR-006-postgresql-first-evidence-graph.md
├── ADR-007-evidence-provenance-as-first-class-data.md
└── ADR-008-hybrid-retrieval.md
```

Each ADR should document:

```text
Context
Decision
Alternatives
Consequences
Revisit conditions
```

---

# 54. Non-Negotiable Engineering Rules

1. Never fabricate evidence.
2. Never manufacture citations.
3. Never treat the LLM as a source of truth.
4. Never lose document/page/paragraph provenance when available.
5. Never put long-running work inside synchronous HTTP handlers.
6. Never put business logic directly in FastAPI routers.
7. Never scatter vendor SDK calls throughout domain modules.
8. Never use Redis as the authoritative database.
9. Never make a derived search/graph index the source of truth.
10. Never let failed AI processing silently produce a successful verification.
11. Never let one user's private resources leak into another user's context.
12. Never introduce a new technology without an architecture reason.

---

# 55. Canonical SUTRA Architecture

The architecture can be summarized as:

```text
                         ┌──────────────────────────┐
                         │        NEXT.JS WEB       │
                         └────────────┬─────────────┘
                                      │
                              REST / WebSocket
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │        FASTAPI API       │
                         │                          │
                         │ Modular Monolith         │
                         │ Clean / Hexagonal Core   │
                         └────────────┬─────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
 ┌────────────────┐        ┌────────────────┐        ┌────────────────┐
 │  PostgreSQL    │        │     Redis      │        │      S3        │
 │  + pgvector    │        │ Queue + Cache  │        │ Binary Assets  │
 └───────┬────────┘        └───────┬────────┘        └────────────────┘
         │                         │
         │                         ▼
         │                ┌────────────────────┐
         │                │ Celery Worker Pool │
         │                └─────────┬──────────┘
         │                          │
         │                ┌─────────┴───────────┐
         │                │ Document + AI Jobs │
         │                └─────────┬───────────┘
         │                          │
         └──────────────────────────┼──────────────────────────────┐
                                    ▼                              │
                           ┌──────────────────┐                    │
                           │ Retrieval Engine │                    │
                           │ FTS + Vector     │                    │
                           │ + Reranker       │                    │
                           └────────┬─────────┘                    │
                                    ▼                              │
                           ┌──────────────────┐                    │
                           │ Evidence Engine  │                    │
                           └────────┬─────────┘                    │
                                    ▼                              │
                           ┌──────────────────┐                    │
                           │ AI Orchestrator  │                    │
                           └────────┬─────────┘                    │
                                    ▼                              │
                           ┌──────────────────┐                    │
                           │ Verification     │                    │
                           │ + Context Engine │                    │
                           └────────┬─────────┘                    │
                                    ▼                              │
                           Evidence-backed result                 │
                                    │                              │
                                    └──────────────────────────────┘
```

---

# 56. Final Architectural Statement

SUTRA should be built as an **evidence infrastructure platform with AI on top**.

The permanent architectural center of gravity is:

```text
CLAIM
  ↓
ASSERTION
  ↓
ENTITY / EVENT
  ↓
SOURCE
  ↓
DOCUMENT
  ↓
EVIDENCE
  ↓
COMPARISON
  ↓
CONTEXT
  ↓
VERIFICATION
  ↓
EXPLANATION
```

The API provides controlled access to that system. Workers perform expensive asynchronous computation. PostgreSQL stores authoritative business state and provenance. pgvector provides the initial semantic retrieval layer. Redis/Celery handle asynchronous work. Object storage holds raw documents. AI providers are interchangeable infrastructure components. Search and graph systems can be introduced later without replacing the core domain model.

The defining property of SUTRA is therefore not the choice of LLM. It is the **traceable evidence pipeline surrounding the LLM**.

Every engineering decision should reinforce that property.

---

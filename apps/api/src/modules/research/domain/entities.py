from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Dict, Any
import uuid


class SourceType(str, Enum):
    REGULATOR = "REGULATOR"
    EXCHANGE = "EXCHANGE"
    CORPORATE = "CORPORATE"
    GOVERNMENT = "GOVERNMENT"
    NEWS = "NEWS"
    BLOG = "BLOG"
    SOCIAL = "SOCIAL"
    USER_GENERATED = "USER_GENERATED"


class EvidenceRelationship(str, Enum):
    SUPPORTS = "SUPPORTS"
    CONTRADICTS = "CONTRADICTS"
    PARTIALLY_SUPPORTS = "PARTIALLY_SUPPORTS"
    UNRELATED = "UNRELATED"
    INSUFFICIENT = "INSUFFICIENT"


class EvidenceStatus(str, Enum):
    SUPPORTING_EVIDENCE = "SUPPORTING_EVIDENCE"
    PARTIAL_EVIDENCE = "PARTIAL_EVIDENCE"
    CONFLICTING_EVIDENCE = "CONFLICTING_EVIDENCE"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"
    NO_MATCHING_EVIDENCE = "NO_MATCHING_EVIDENCE"


class EventStage(str, Enum):
    ANNOUNCEMENT = "ANNOUNCEMENT"
    AGREEMENT = "AGREEMENT"
    APPROVAL = "APPROVAL"
    COMPLETION = "COMPLETION"
    FILING = "FILING"
    PUBLICATION = "PUBLICATION"


@dataclass
class Source:
    domain: str
    source_type: SourceType
    priority: int = 1
    country: str = "IN"
    description: str = ""
    allowed: bool = True
    crawl_policy: str = "POLITE"
    credibility_score: float = 1.0
    credibility_tier: str = "TIER_1_STATUTORY"


@dataclass
class AtomicAssertion:
    assertion_id: str
    assertion_text: str
    entity: Optional[str] = None
    event: Optional[str] = None
    location: Optional[str] = None
    amount_raw: Optional[str] = None
    amount_normalized: Optional[float] = None
    currency: Optional[str] = "INR"
    attribute: Optional[str] = None
    status: EvidenceStatus = EvidenceStatus.INSUFFICIENT_EVIDENCE
    finding_summary: Optional[str] = None


@dataclass
class SearchQuery:
    query_id: str
    assertion_id: str
    query_text: str
    target_domains: List[str] = field(default_factory=list)
    generated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class SearchResult:
    result_id: str
    query_id: str
    url: str
    title: str
    snippet: str
    rank: int
    domain: str
    provider: str
    retrieved_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class CrawlRun:
    crawl_id: str
    url: str
    status: str  # SUCCESS, FAILED, BLOCKED_SSRF, TIMEOUT
    content_type: str = "text/html"
    http_status: int = 200
    fetched_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    error_message: Optional[str] = None


@dataclass
class DocumentChunk:
    chunk_id: str
    document_id: str
    page: Optional[int] = 1
    section: Optional[str] = None
    paragraph: Optional[int] = 1
    text: str = ""
    content_hash: str = ""
    source_url: str = ""


@dataclass
class Document:
    document_id: str
    source_id: str
    url: str
    canonical_url: str
    title: str
    document_type: str  # EXCHANGE_FILING, ANNUAL_REPORT, PRESS_RELEASE, NEWS_ARTICLE
    publisher: str
    published_at: Optional[str] = None
    retrieved_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    content_hash: str = ""
    language: str = "en"
    pages: int = 1
    metadata: Dict[str, Any] = field(default_factory=dict)
    chunks: List[DocumentChunk] = field(default_factory=list)
    simplified_takeaway: Optional[str] = None


@dataclass
class Evidence:
    evidence_id: str
    claim_id: str
    assertion_id: str
    document_id: str
    source_id: str
    relationship: EvidenceRelationship
    exact_text: str
    page: Optional[int] = 1
    section: Optional[str] = None
    published_at: Optional[str] = None
    retrieved_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    confidence: float = 0.90
    amount_extracted: Optional[float] = None
    date_extracted: Optional[str] = None
    source_url: str = ""
    publisher: str = ""
    simplified_takeaway: Optional[str] = None
    citation_index: int = 1
    credibility_score: float = 1.0
    credibility_tier: str = "TIER_1_STATUTORY"


@dataclass
class NumericalComparison:
    metric_name: str
    claimed_raw: str
    claimed_normalized: float
    evidence_raw: str
    evidence_normalized: float
    difference_amount: float
    ratio_factor: str
    is_mismatch: bool
    explanation: str


@dataclass
class TemporalComparison:
    event_name: str
    claimed_stage: str
    evidence_stage: str
    event_date: Optional[str] = None
    is_mismatch: bool = False
    explanation: str = ""


@dataclass
class Investigation:
    investigation_id: str = field(default_factory=lambda: f"inv_{uuid.uuid4().hex[:10]}")
    claim_text: str = ""
    assertions: List[AtomicAssertion] = field(default_factory=list)
    queries: List[SearchQuery] = field(default_factory=list)
    search_results: List[SearchResult] = field(default_factory=list)
    crawl_runs: List[CrawlRun] = field(default_factory=list)
    documents: List[Document] = field(default_factory=list)
    evidence_trail: List[Evidence] = field(default_factory=list)
    numerical_comparisons: List[NumericalComparison] = field(default_factory=list)
    temporal_comparisons: List[TemporalComparison] = field(default_factory=list)
    overall_status: EvidenceStatus = EvidenceStatus.NO_MATCHING_EVIDENCE
    verdict_headline: str = ""
    human_readable_explanation: str = ""
    uncertainty_notice: str = (
        "VERA Principle: Absence of matching evidence does NOT automatically mean a claim is false. "
        "The system communicates explicit factual grounding and statutory disclosure timelines."
    )
    crawled_data_simplified: List[dict] = field(default_factory=list)
    citations: List[dict] = field(default_factory=list)
    search_steps: List[dict] = field(default_factory=list)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class ResearchRequest(BaseModel):
    claim: str = Field(..., min_length=5, description="Financial assertion or market claim to investigate")
    entity_hint: Optional[str] = Field(None, description="Optional entity or ticker symbol hint")


class AtomicAssertionDTO(BaseModel):
    assertion_id: str
    assertion_text: str
    entity: Optional[str] = None
    event: Optional[str] = None
    location: Optional[str] = None
    amount_raw: Optional[str] = None
    amount_normalized: Optional[float] = None
    status: str
    finding_summary: Optional[str] = None


class SearchQueryDTO(BaseModel):
    query_id: str
    assertion_id: str
    query_text: str
    target_domains: List[str]


class SearchResultDTO(BaseModel):
    result_id: str
    query_id: str
    url: str
    title: str
    snippet: str
    rank: int
    domain: str
    provider: str


class CrawlRunDTO(BaseModel):
    crawl_id: str
    url: str
    status: str
    content_type: str
    http_status: int


class EvidenceDTO(BaseModel):
    evidence_id: str
    assertion_id: str
    relationship: str
    exact_text: str
    page: Optional[int] = 1
    section: Optional[str] = None
    source_url: str
    publisher: str
    confidence: float
    simplified_takeaway: Optional[str] = None


class NumericalComparisonDTO(BaseModel):
    metric_name: str
    claimed_raw: str
    evidence_raw: str
    difference_amount: float
    ratio_factor: str
    is_mismatch: bool
    explanation: str


class TemporalComparisonDTO(BaseModel):
    event_name: str
    claimed_stage: str
    evidence_stage: str
    is_mismatch: bool
    explanation: str


class InvestigationResponseDTO(BaseModel):
    investigation_id: str
    claim_text: str
    overall_status: str
    verdict_headline: str
    human_readable_explanation: str
    assertions: List[AtomicAssertionDTO]
    queries: List[SearchQueryDTO]
    search_results: List[SearchResultDTO]
    crawl_runs: List[CrawlRunDTO]
    evidence_trail: List[EvidenceDTO]
    numerical_comparisons: List[NumericalComparisonDTO]
    temporal_comparisons: List[TemporalComparisonDTO]
    uncertainty_notice: str
    crawled_data_simplified: List[dict] = Field(default_factory=list)
    citations: List[dict] = Field(default_factory=list)
    search_steps: List[dict] = Field(default_factory=list)
    created_at: datetime

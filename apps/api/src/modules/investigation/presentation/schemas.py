from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class EvidencePassageDTO(BaseModel):
    passage_id: str
    document_title: str
    filing_type: str
    source_name: str
    source_tier: str
    filing_date: str
    page_number: int
    paragraph_number: int
    exact_quote: str
    source_url: str
    relevance_score: float
    relationship: str
    simplified_takeaway: str = ""


class NumericalReconciliationDTO(BaseModel):
    metric_name: str
    claimed_value: str
    official_value: str
    discrepancy_factor: str
    is_mismatch: bool


class AssertionInvestigationDTO(BaseModel):
    assertion_id: str
    assertion_text: str
    status: str
    confidence: float
    primary_finding: str
    evidence_passages: List[EvidencePassageDTO] = Field(default_factory=list)
    numerical_reconciliation: Optional[NumericalReconciliationDTO] = None
    contradiction_detail: Optional[str] = None


class InvestorProtectionDTO(BaseModel):
    risk_level: str
    summary_warning: str
    applicable_regulations: List[str] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    official_redressal_url: str
    intermediary_check_url: str


class InvestigationDossierResponse(BaseModel):
    investigation_id: str
    claim_summary: str
    overall_verdict: str
    verdict_headline: str
    verdict_explanation: str
    assertion_investigations: List[AssertionInvestigationDTO]
    evidence_trail: List[EvidencePassageDTO]
    numerical_reconciliations: List[NumericalReconciliationDTO]
    protection_guidance: Optional[InvestorProtectionDTO] = None
    raw_verbatim_text: str = ""
    human_readable_explanation: dict = Field(default_factory=dict)
    hype_score: float = 0.0
    channel: str = "TEXT"
    extracted_entities: List[dict] = Field(default_factory=list)
    detected_red_flags: List[dict] = Field(default_factory=list)
    statutory_search_context: dict = Field(default_factory=dict)
    plain_language_takeaway: str = ""
    crawled_social_sources: List[dict] = Field(default_factory=list)
    crawled_simplified_data: List[dict] = Field(default_factory=list)
    chatgpt_response: str = ""
    citations: List[dict] = Field(default_factory=list)
    search_steps: List[dict] = Field(default_factory=list)
    disclaimer: str
    created_at: datetime


class InvestigateRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Financial claim, WhatsApp forward, or text to investigate")
    channel: Optional[str] = "TEXT"

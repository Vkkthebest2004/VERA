from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
import uuid


class SourceTier(str, Enum):
    TIER_1_REGULATORY = "TIER_1_REGULATORY"  # SEBI, BSE, NSE, RBI, MCA (Statutory records)
    TIER_2_COMPANY_FILING = "TIER_2_COMPANY_FILING"  # Reg 30 Disclosures, Audited Annual Reports
    TIER_3_FINANCIAL_MEDIA = "TIER_3_FINANCIAL_MEDIA"  # Reuters, Mint, Bloomberg, Economic Times
    TIER_4_UNVERIFIED_SOCIAL = "TIER_4_UNVERIFIED_SOCIAL"  # WhatsApp, Telegram, Instagram, Finfluencer


class VerificationStatus(str, Enum):
    SUPPORTED = "SUPPORTED"
    PARTIALLY_SUPPORTED = "PARTIALLY_SUPPORTED"
    CONTRADICTED = "CONTRADICTED"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"
    UNVERIFIED = "UNVERIFIED"


class OverallVerdict(str, Enum):
    CONFIRMED_TRUE = "CONFIRMED_TRUE"
    MISLEADING_OR_EXAGGERATED = "MISLEADING_OR_EXAGGERATED"
    DEBUNKED_FAKE = "DEBUNKED_FAKE"
    UNSUBSTANTIATED_SPECULATION = "UNSUBSTANTIATED_SPECULATION"


@dataclass
class EvidencePassage:
    passage_id: str
    document_title: str
    filing_type: str  # REG_30_DISCLOSURE, AUDITED_QUARTERLY_REPORT, ANNUAL_REPORT, SEBI_CIRCULAR
    source_name: str  # BSE, NSE, SEBI, Company IR
    source_tier: SourceTier
    filing_date: str
    page_number: int
    paragraph_number: int
    exact_quote: str
    source_url: str
    relevance_score: float
    relationship: str  # SUPPORTS, CONTRADICTS, PARTIAL_MATCH, CONTEXT
    simplified_takeaway: str = ""


@dataclass
class NumericalReconciliation:
    metric_name: str
    claimed_value: str
    official_value: str
    discrepancy_factor: str  # e.g. "10x Overstated", "Exact Match", "Unreported"
    is_mismatch: bool


@dataclass
class AssertionInvestigation:
    assertion_id: str
    assertion_text: str
    status: VerificationStatus
    confidence: float
    primary_finding: str
    evidence_passages: List[EvidencePassage] = field(default_factory=list)
    numerical_reconciliation: Optional[NumericalReconciliation] = None
    contradiction_detail: Optional[str] = None


@dataclass
class InvestorProtectionGuidance:
    risk_level: str  # EXTREME_RISK, HIGH_RISK, MODERATE, LOW
    summary_warning: str
    applicable_regulations: List[str] = field(default_factory=list)
    recommended_actions: List[str] = field(default_factory=list)
    official_redressal_url: str = "https://scores.sebi.gov.in"
    intermediary_check_url: str = "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13"


@dataclass
class InvestigationDossier:
    investigation_id: str = field(default_factory=lambda: f"inv_{uuid.uuid4().hex[:10]}")
    claim_summary: str = ""
    overall_verdict: OverallVerdict = OverallVerdict.UNSUBSTANTIATED_SPECULATION
    verdict_headline: str = ""
    verdict_explanation: str = ""
    assertion_investigations: List[AssertionInvestigation] = field(default_factory=list)
    evidence_trail: List[EvidencePassage] = field(default_factory=list)
    numerical_reconciliations: List[NumericalReconciliation] = field(default_factory=list)
    protection_guidance: Optional[InvestorProtectionGuidance] = None
    raw_verbatim_text: str = ""
    human_readable_explanation: dict = field(default_factory=dict)
    hype_score: float = 0.0
    channel: str = "TEXT"
    extracted_entities: List[dict] = field(default_factory=list)
    detected_red_flags: List[dict] = field(default_factory=list)
    statutory_search_context: dict = field(default_factory=dict)
    plain_language_takeaway: str = ""
    crawled_social_sources: List[dict] = field(default_factory=list)
    crawled_simplified_data: List[dict] = field(default_factory=list)
    chatgpt_response: str = ""
    citations: List[dict] = field(default_factory=list)
    search_steps: List[dict] = field(default_factory=list)
    disclaimer: str = (
        "VERA is an evidence-first verification platform. Information provided is strictly for "
        "evidence assessment and educational transparency. It does not constitute investment advice "
        "or buy/sell recommendations. The user retains responsibility for all final decisions."
    )
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
import uuid


class ChannelType(str, Enum):
    WHATSAPP = "WHATSAPP"
    INSTAGRAM = "INSTAGRAM"
    TELEGRAM = "TELEGRAM"
    AUDIO = "AUDIO"
    PDF = "PDF"
    URL = "URL"
    TEXT = "TEXT"


class RedFlagSeverity(str, Enum):
    INFO = "INFO"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


@dataclass
class RedFlagIndicator:
    flag_id: str
    flag_name: str
    severity: RedFlagSeverity
    description: str
    matched_snippet: str


@dataclass
class FinancialEntity:
    name: str
    ticker: Optional[str] = None
    entity_type: str = "COMPANY"  # COMPANY, REGULATOR, PERSON, INDEX, SECTOR
    role: str = "SUBJECT"


@dataclass
class FinancialMetric:
    metric_type: str  # REVENUE, TARGET_PRICE, PERCENT_GAIN, CONTRACT_VALUE, PE_RATIO, DIVIDEND
    raw_text: str
    normalized_value: Optional[float] = None
    unit_or_currency: Optional[str] = None
    timeframe: Optional[str] = None


@dataclass
class ExtractedAssertion:
    assertion_id: str
    statement: str
    category: str  # DEAL_OR_CONTRACT, FINANCIAL_RESULT, PRICE_TARGET, MANAGEMENT, REGULATORY
    verifiable: bool
    confidence_score: float
    verification_target: str  # e.g., "Exchange Disclosures (NSE/BSE)", "Quarterly Filing", "SEBI Orders"


@dataclass
class FactCheckDossier:
    dossier_id: str = field(default_factory=lambda: f"dos_{uuid.uuid4().hex[:10]}")
    channel: ChannelType = ChannelType.TEXT
    original_content: str = ""
    dehyped_summary: str = ""
    hype_score: float = 0.0  # 0.0 (calm/factual) to 1.0 (extreme hype/fomo)
    sentiment: str = "NEUTRAL"
    entities: List[FinancialEntity] = field(default_factory=list)
    metrics: List[FinancialMetric] = field(default_factory=list)
    red_flags: List[RedFlagIndicator] = field(default_factory=list)
    assertions: List[ExtractedAssertion] = field(default_factory=list)
    raw_verbatim_text: str = ""
    human_readable_explanation: dict = field(default_factory=dict)
    metadata: dict = field(default_factory=dict)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

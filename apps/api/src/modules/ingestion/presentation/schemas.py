from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class RedFlagDTO(BaseModel):
    flag_id: str
    flag_name: str
    severity: str
    description: str
    matched_snippet: str


class FinancialEntityDTO(BaseModel):
    name: str
    ticker: Optional[str] = None
    entity_type: str
    role: str


class FinancialMetricDTO(BaseModel):
    metric_type: str
    raw_text: str
    normalized_value: Optional[float] = None
    unit_or_currency: Optional[str] = None
    timeframe: Optional[str] = None


class ExtractedAssertionDTO(BaseModel):
    assertion_id: str
    statement: str
    category: str
    verifiable: bool
    confidence_score: float
    verification_target: str


class FactCheckDossierResponse(BaseModel):
    dossier_id: str
    channel: str
    original_content: str
    dehyped_summary: str
    hype_score: float
    sentiment: str
    entities: List[FinancialEntityDTO]
    metrics: List[FinancialMetricDTO]
    red_flags: List[RedFlagDTO]
    assertions: List[ExtractedAssertionDTO]
    raw_verbatim_text: str = ""
    human_readable_explanation: dict = Field(default_factory=dict)
    metadata: dict = Field(default_factory=dict)
    created_at: datetime


class TextIngestRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Raw text, WhatsApp forward, or Instagram post caption")
    channel: Optional[str] = Field("TEXT", description="WHATSAPP, INSTAGRAM, TELEGRAM, etc.")


class UrlIngestRequest(BaseModel):
    url: str = Field(..., description="Web link to analyze")


class PresetExample(BaseModel):
    id: str
    title: str
    channel: str
    badge: str
    preview: str
    full_text: str

"""
Structured Financial Facts & Analytical Response Models for VERA.
Enforces Section 14 (Financial Data Object) and Section 59 (Internal Response Object).
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class FinancialFact(BaseModel):
    """
    Standardized internal representation of a financial metric.
    Prevents storing bare numbers or mixing financial periods.
    """
    entity_id: str = Field(..., description="Ticker or entity identifier, e.g. 'RELIANCE'")
    entity_name: str = Field(..., description="Full legal company name")
    metric: str = Field(..., description="Standardized metric key, e.g. 'net_profit', 'sales', 'ebitda'")
    metric_label: str = Field(..., description="Human-readable label, e.g. 'Net Profit (PAT)'")
    value: float = Field(..., description="Numeric value in stated scale")
    currency: str = Field("INR", description="Currency code")
    scale: str = Field("crore", description="Unit scale: crore, lakh, thousand, absolute")
    period_type: str = Field(..., description="'quarter' | 'annual' | 'ttm'")
    period_name: str = Field(..., description="Descriptive period name, e.g. 'Q1 FY26 (Quarter ended Jun 2026)'")
    fiscal_year: str = Field(..., description="e.g. 'FY26'")
    quarter: Optional[str] = Field(None, description="e.g. 'Q1', 'Q2', 'Q3', 'Q4'")
    period_end: Optional[str] = Field(None, description="Date string, e.g. '2026-06-30'")
    scope: str = Field("consolidated", description="'consolidated' | 'standalone'")
    basis: str = Field("reported", description="'reported' | 'audited' | 'adjusted'")
    source_name: str = Field(..., description="Authoritative source filing or report")
    source_url: Optional[str] = Field(None, description="URL of exchange filing or disclosure")
    confidence: float = Field(0.98, description="Data confidence score")
    
    # Historical comparisons
    previous_period_value: Optional[float] = None
    yoy_period_name: Optional[str] = None
    yoy_value: Optional[float] = None
    yoy_growth_pct: Optional[float] = None
    qoq_growth_pct: Optional[float] = None


class InternalResponseObject(BaseModel):
    """
    Internal structured response object enforcing Section 59.
    Separates facts, calculations, interpretations, and scenarios.
    """
    user_intents: List[str]
    entity_id: str
    entity_name: str
    period: str
    facts: List[FinancialFact] = []
    calculations: Dict[str, Any] = {}
    analysis: Dict[str, Any] = Field(
        default_factory=lambda: {
            "overall_health": "stable",
            "growth": {},
            "profitability": {},
            "cash_flow": {},
            "balance_sheet": {},
            "valuation": {},
            "risks": [],
            "bull_case": [],
            "bear_case": [],
            "uncertainties": [],
        }
    )
    user_level: str = "intermediate"  # beginner | intermediate | advanced
    language: str = "english"         # english | hinglish
    conversational_response: str = ""
    suggested_follow_ups: List[str] = []
    evidence_ref: Optional[Dict[str, Any]] = None
    citations: List[Dict[str, Any]] = []

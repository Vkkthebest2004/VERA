"""
VERA Chatbot Presentation Router.
Provides dedicated /api/v1/chat and /chat endpoints powered by Qwen VERA Reasoning Engine.
Handles all types of conversations: greetings, financial education, business models,
peer comparisons, chart control, and statutory rumor audits.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from ..research.application.qwen_reasoning_pipeline import QwenReasoningPipeline

router = APIRouter(tags=["Artha"])
qwen_pipeline = QwenReasoningPipeline(model_name="qwen-vera:4b")


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message, query, or command")
    company_id: Optional[str] = Field("AWL", description="Ticker or entity ID")
    company_name: Optional[str] = Field("AWL Agri Business Ltd", description="Full company name")
    graph_context: Optional[Dict[str, Any]] = Field(None, description="Active chart context")
    history: Optional[List[Dict[str, str]]] = Field(None, description="Recent conversation turns")


class ChatResponse(BaseModel):
    response: str
    suggested_follow_ups: List[str]
    model_used: str = "Artha"
    executed_command: Optional[Dict[str, Any]] = None
    evidence_ref: Optional[Dict[str, Any]] = None


@router.post("/api/v1/chat", response_model=ChatResponse)
@router.post("/chat", response_model=ChatResponse)
def vera_chat_endpoint(payload: ChatRequest):
    """
    Main VERA Chatbot inference endpoint.
    Processes retail financial queries, casual conversations, educational topics,
    and chart commands using custom Qwen VERA.
    """
    msg = payload.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    cid = payload.company_id or "AWL"
    entity = payload.company_name or payload.company_id or "Company"
    
    # Process through versatile Qwen Reasoning Pipeline
    res = qwen_pipeline.reason_over_complex_claim(
        claim_text=msg,
        entity_name=entity,
    )

    intent = res.get("intent", "GENERAL_CONVERSATION")

    # Generate tailored, contextually relevant follow-up suggestions
    if intent == "BEGINNER_ONBOARDING":
        follow_ups = [
            "Explain Revenue vs Profit with an example",
            "What is Market Cap?",
            "Why is Cash Flow different from Net Profit?",
            f"How does {cid} make money?",
        ]
    elif intent == "MISCONCEPTION_CORRECTION":
        follow_ups = [
            "Explain Stock Splits vs Bonus Shares",
            "Why is a low stock price not necessarily cheap?",
            "What does P/E actually tell us?",
            f"Show {cid} Profit vs Cash Flow",
        ]
    elif intent == "INVESTMENT_DECISION":
        follow_ups = [
            f"What is the Bull Case for {cid}?",
            f"What is the Bear Case for {cid}?",
            f"Does {cid} have heavy debt?",
            f"Compare {cid} valuation with peers",
        ]
    elif intent == "COMPANY_ANALYSIS":
        follow_ups = [
            f"Show {cid} Profit vs Cash Flow",
            f"What are {cid}'s revenue segments?",
            f"Analyze {cid} ROCE vs ROE",
            f"What are key risks for {cid}?",
        ]
    elif intent == "GREETING_CASUAL":
        follow_ups = [
            f"Explain {cid}'s business model & products",
            "What is EBITDA and why is it important?",
            f"Should I invest in {cid}?",
            "I'm a beginner — where should I start?",
        ]
    elif intent == "FINANCIAL_EDUCATION":
        follow_ups = [
            "Explain ROCE vs ROE like I'm 15",
            "Why is Cash Flow different from Net Profit?",
            "What is Working Capital Cycle?",
            f"Show {cid} Profit vs Cash Flow",
        ]
    elif intent == "BUSINESS_MODEL":
        follow_ups = [
            f"Compare {cid} valuation with peers",
            f"Break down quarterly OPM margins for {cid}",
            "Show segment revenue breakdown",
            f"Does {cid} have heavy debt?",
        ]
    elif intent == "PEER_COMPARISON":
        follow_ups = [
            "Show peer comparison chart",
            f"Which peer has highest ROCE?",
            "Explain margin differences between competitors",
            "Show valuation history",
        ]
    elif intent == "STATUTORY_RUMOR":
        follow_ups = [
            f"Check BSE/NSE compliance timeline for {cid}",
            "How does SEBI LODR Regulation 30 protect investors?",
            "File complaint on SEBI SCORES portal",
            "Show verified financial disclosures",
        ]
    else:
        follow_ups = [
            f"Explain {cid} ROCE vs ROE",
            f"Analyze {cid} P/E valuation vs peers",
            "Show Profit vs Cash Flow",
            "Make this easier to understand",
        ]

    # Detect visualizer commands to coordinate with frontend visualizer store
    executed_command = None
    lower_msg = msg.lower()
    if ("pat" in lower_msg or "profit" in lower_msg) and ("cash" in lower_msg or "ocf" in lower_msg):
        executed_command = {"action": "show_chart", "chartId": "pat-vs-ocf"}
    elif "margin" in lower_msg or "opm" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "margin-trend"}
    elif "free cash flow" in lower_msg or "fcf" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "free-cash-flow"}
    elif "debt" in lower_msg or "interest coverage" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "debt-interest"}
    elif "roce" in lower_msg or "roe" in lower_msg or "capital return" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "roce-roe"}
    elif "segment" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "segment-revenue"}
    elif "peer" in lower_msg or "compare" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "peer-comparison"}
    elif "eps" in lower_msg or "earnings per share" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "eps-growth"}
    elif "working capital" in lower_msg or "cash conversion" in lower_msg or "ccc" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "working-capital"}
    elif "capital allocation" in lower_msg or "capex" in lower_msg or "dividend" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "capital-allocation"}
    elif "valuation" in lower_msg or "pe history" in lower_msg or "multiple" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "valuation-history"}
    elif "easier" in lower_msg or "simplify" in lower_msg or "simple" in lower_msg:
        executed_command = {"action": "simplify", "enabled": True}
    elif "reset" in lower_msg or "start over" in lower_msg:
        executed_command = {"action": "reset_chart"}

    return ChatResponse(
        response=res.get("raw_response", res.get("the_reality", "")),
        suggested_follow_ups=follow_ups[:4],
        model_used="Artha",
        executed_command=executed_command,
        evidence_ref={
            "filing_type": "SEBI LODR Regulation 30 / 33 Verified Disclosures",
            "regulatory_entity": "BSE & NSE India",
        },
    )

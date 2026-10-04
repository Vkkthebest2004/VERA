"""
VERA Chatbot Presentation Router.
Provides dedicated /api/v1/chat and /chat endpoints powered by the Financial Intelligence Engine
and persistent Supabase memory (Conversations, Messages, Long-Term Semantic Memory).
"""

import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field

from apps.api.src.core.auth import AuthenticatedUser, get_current_user
from apps.api.src.modules.memory.application.service import MemoryService
from apps.api.src.modules.memory.application.context import format_memory_context
from ..research.application.financial_intelligence_engine import FinancialIntelligenceEngine

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Artha"])
financial_engine = FinancialIntelligenceEngine()
memory_service = MemoryService()


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message, query, or command")
    company_id: Optional[str] = Field("RELIANCE", description="Ticker or entity ID")
    company_name: Optional[str] = Field("Reliance Industries Ltd", description="Full company name")
    graph_context: Optional[Dict[str, Any]] = Field(None, description="Active chart context")
    history: Optional[List[Dict[str, str]]] = Field(None, description="Recent conversation turns")
    conversation_id: Optional[str] = Field(None, description="Active Supabase conversation UUID")


class ChatResponse(BaseModel):
    response: str
    suggested_follow_ups: List[str]
    model_used: str = "Artha Financial Intelligence"
    executed_command: Optional[Dict[str, Any]] = None
    evidence_ref: Optional[Dict[str, Any]] = None
    market_intelligence: Optional[Dict[str, Any]] = None
    citations: Optional[List[Dict[str, Any]]] = None
    conversation_id: Optional[str] = None


@router.post("/api/v1/chat", response_model=ChatResponse)
@router.post("/chat", response_model=ChatResponse)
async def vera_chat_endpoint(
    payload: ChatRequest,
    background_tasks: BackgroundTasks,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Main VERA Financial Intelligence inference endpoint with Supabase memory integration.
    Processes natural questions (English & Hinglish), beginner to advanced depth,
    period-correct financial facts, deterministic calculations, chart commands,
    and automatic semantic recall & memory extraction.
    """
    msg = payload.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    cid = payload.company_id or "RELIANCE"
    entity = payload.company_name or "Reliance Industries Ltd"
    user_id = current_user.id

    # 1. Resolve or create persistent conversation session in Supabase
    conv_id = payload.conversation_id
    try:
        if not conv_id:
            title = msg[:45] + ("..." if len(msg) > 45 else "")
            conv = await memory_service.create_conversation(user_id=user_id, title=title)
            conv_id = conv["id"]
    except Exception as e:
        logger.warning(f"Could not initialize conversation in Supabase: {e}")
        conv_id = None

    # 2. Retrieve long-term memories and past conversation turns
    formatted_memory = ""
    history = payload.history
    try:
        mem_data = await memory_service.build_context(
            user_id=user_id,
            conversation_id=conv_id,
            query=msg,
        )
        long_term_mems = mem_data.get("long_term_memories", [])
        recent_msgs = mem_data.get("recent_messages", [])
        formatted_memory = format_memory_context(memories=long_term_mems, recent_messages=[])

        # If frontend didn't supply in-memory history, hydrate from Supabase
        if history is None and recent_msgs:
            history = [{"role": m["role"], "content": m["content"]} for m in recent_msgs[-8:]]
    except Exception as e:
        logger.warning(f"Memory context retrieval skipped: {e}")

    # 3. Save incoming user message in Supabase
    if conv_id:
        try:
            await memory_service.save_message(
                conversation_id=conv_id,
                user_id=user_id,
                role="user",
                content=msg,
            )
        except Exception as e:
            logger.warning(f"Failed to persist user message: {e}")

    # 4. Process through the central Financial Intelligence Engine with memory
    res = financial_engine.process_query(
        query=msg,
        active_company_id=cid,
        active_company_name=entity,
        history=history,
        memory_context=formatted_memory,
    )

    raw_response = res.get("raw_response", "")

    # 5. Save assistant response in Supabase
    if conv_id:
        try:
            await memory_service.save_message(
                conversation_id=conv_id,
                user_id=user_id,
                role="assistant",
                content=raw_response,
                metadata={"model": res.get("model_used", "qwen-vera:4b")},
            )
        except Exception as e:
            logger.warning(f"Failed to persist assistant response: {e}")

        # 6. Extract persistent user preferences/facts in the background (non-blocking)
        background_tasks.add_task(
            memory_service.process_conversation_memory,
            user_id,
            conv_id,
            msg,
            raw_response,
        )

    # 7. Detect visualizer commands to coordinate with frontend visualizer store
    executed_command = None
    lower_msg = msg.lower()
    if ("pat" in lower_msg or "profit" in lower_msg) and ("cash" in lower_msg or "ocf" in lower_msg):
        executed_command = {"action": "show_chart", "chartId": "pat-vs-ocf"}
    elif "margin" in lower_msg or "opm" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "margin-trend"}
    elif "free cash flow" in lower_msg or "fcf" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "free-cash-flow"}
    elif "debt" in lower_msg or "interest coverage" in lower_msg or "karza" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "debt-interest"}
    elif "roce" in lower_msg or "roe" in lower_msg or "capital return" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "roce-roe"}
    elif "segment" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "segment-revenue"}
    elif "peer" in lower_msg or "compare" in lower_msg or "vs" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "peer-comparison"}
    elif "eps" in lower_msg or "earnings per share" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "eps-growth"}
    elif "working capital" in lower_msg or "cash conversion" in lower_msg or "ccc" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "working-capital"}
    elif "capital allocation" in lower_msg or "capex" in lower_msg or "dividend" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "capital-allocation"}
    elif "valuation" in lower_msg or "pe history" in lower_msg or "multiple" in lower_msg or "mehenga" in lower_msg:
        executed_command = {"action": "show_chart", "chartId": "valuation-history"}
    elif "easier" in lower_msg or "simplify" in lower_msg or "simple" in lower_msg:
        executed_command = {"action": "simplify", "enabled": True}
    elif "reset" in lower_msg or "start over" in lower_msg:
        executed_command = {"action": "reset_chart"}

    citations = res.get("citations", [])
    market_intel = res.get("market_intelligence", {})
    follow_ups = res.get("suggested_follow_ups", [])

    return ChatResponse(
        response=raw_response,
        suggested_follow_ups=follow_ups[:4],
        model_used=res.get("model_used", "Artha Financial Intelligence"),
        executed_command=executed_command,
        evidence_ref=res.get("evidence_ref", {
            "filing_type": "SEBI LODR Regulation 33 / Audited Disclosures",
            "regulatory_entity": "BSE & NSE India",
        }),
        market_intelligence=market_intel,
        citations=citations,
        conversation_id=conv_id,
    )

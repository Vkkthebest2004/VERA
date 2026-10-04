from __future__ import annotations
from typing import Any, Dict, List


def format_memory_context(
    memories: List[Dict[str, Any]],
    recent_messages: List[Dict[str, Any]],
) -> str:
    """
    Format semantic memories and recent conversation turns into an LLM-friendly context block.
    Explicitly distinguishes persistent user context from authoritative financial facts.
    """
    sections: List[str] = []

    if memories:
        sections.append("### LONG-TERM USER MEMORY & PREFERENCES (Contextual only, NOT statutory evidence):")
        for memory in memories:
            m_type = memory.get("memory_type", "general")
            content = memory.get("content", "").strip()
            sim = memory.get("similarity")
            sim_str = f" [relevance: {sim:.2f}]" if sim is not None else ""
            sections.append(f"- [{m_type.upper()}]{sim_str}: {content}")

    if recent_messages:
        sections.append("\n### RECENT CONVERSATION HISTORY:")
        for message in recent_messages:
            role = message.get("role", "user").upper()
            content = message.get("content", "").strip()
            sections.append(f"{role}: {content}")

    if not sections:
        return ""

    return "\n".join(sections)

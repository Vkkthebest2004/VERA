from __future__ import annotations
from typing import List
from pydantic import BaseModel, Field


class MemoryCandidate(BaseModel):
    should_remember: bool = False
    memory_type: str = Field(
        default="general",
        description="Category: preference | project | financial_interest | fact | constraint | general",
    )
    content: str = Field(
        default="",
        description="The concise, generalized insight worth remembering about the user.",
    )
    importance: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Significance of this memory (0.0 lowest, 1.0 critical user preference).",
    )


class MemoryExtractionResult(BaseModel):
    memories: List[MemoryCandidate] = Field(default_factory=list)

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Optional


@dataclass
class Conversation:
    id: str
    user_id: str
    title: Optional[str] = None
    summary: Optional[str] = None
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class Message:
    id: str
    conversation_id: str
    user_id: str
    role: str  # 'user' | 'assistant' | 'system'
    content: str
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: Optional[datetime] = None


@dataclass
class Memory:
    id: str
    user_id: str
    memory_type: str  # 'preference' | 'project' | 'financial_interest' | 'fact' | 'general'
    content: str
    importance: float = 0.5
    similarity: Optional[float] = None
    conversation_id: Optional[str] = None
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_accessed_at: Optional[datetime] = None

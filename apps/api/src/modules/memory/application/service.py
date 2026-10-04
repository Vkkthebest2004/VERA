from __future__ import annotations
import asyncio
import os
from typing import Any, Dict, List, Optional
from apps.api.src.modules.memory.application.extractor import MemoryExtractor
from apps.api.src.modules.memory.infrastructure.embeddings import create_embedding
from apps.api.src.modules.memory.infrastructure.repository import MemoryRepository


class MemoryService:
    def __init__(self) -> None:
        self.repository = MemoryRepository()
        self.extractor = MemoryExtractor()
        self.top_k = int(os.getenv("VERA_MEMORY_TOP_K", "8"))
        self.threshold = float(os.getenv("VERA_MEMORY_THRESHOLD", "0.70"))
        self.dedup_threshold = float(os.getenv("VERA_MEMORY_DEDUP_THRESHOLD", "0.90"))

    # ==========================================================
    # CONVERSATIONS
    # ==========================================================
    async def create_conversation(
        self,
        user_id: str,
        title: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.repository.create_conversation,
            user_id,
            title,
            metadata,
        )

    async def get_or_create_conversation(
        self,
        conversation_id: Optional[str],
        user_id: str,
        title: Optional[str] = None,
    ) -> Dict[str, Any]:
        if conversation_id:
            conv = await asyncio.to_thread(self.repository.get_conversation, conversation_id, user_id)
            if conv:
                return conv
        return await self.create_conversation(user_id=user_id, title=title)

    async def list_conversations(
        self,
        user_id: str,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        return await asyncio.to_thread(self.repository.list_conversations, user_id, limit)

    async def delete_conversation(
        self,
        conversation_id: str,
        user_id: str,
    ) -> bool:
        return await asyncio.to_thread(self.repository.delete_conversation, conversation_id, user_id)

    # ==========================================================
    # MESSAGES
    # ==========================================================
    async def save_message(
        self,
        conversation_id: str,
        user_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.repository.save_message,
            conversation_id,
            user_id,
            role,
            content,
            metadata,
        )

    async def get_recent_messages(
        self,
        conversation_id: str,
        user_id: str,
        limit: int = 12,
    ) -> List[Dict[str, Any]]:
        return await asyncio.to_thread(
            self.repository.get_recent_messages,
            conversation_id,
            user_id,
            limit,
        )

    # ==========================================================
    # SEMANTIC MEMORY & RECALL
    # ==========================================================
    async def recall(
        self,
        user_id: str,
        query: str,
        threshold: Optional[float] = None,
        top_k: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Convert query into semantic embedding and search pgvector via match_vera_memories RPC.
        """
        if not query or not query.strip():
            return []

        try:
            query_embedding = await asyncio.to_thread(create_embedding, query)
            match_thresh = threshold if threshold is not None else self.threshold
            count = top_k if top_k is not None else self.top_k

            return await asyncio.to_thread(
                self.repository.search_memories,
                user_id,
                query_embedding,
                match_thresh,
                count,
            )
        except Exception:
            return []

    async def remember_safely(
        self,
        user_id: str,
        content: str,
        memory_type: str = "general",
        conversation_id: Optional[str] = None,
        importance: float = 0.5,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Deduplication-aware memory storage.
        If a semantically similar memory (>0.90 similarity) exists, updates it instead of duplicating.
        """
        if not content or not content.strip():
            return None

        embedding = await asyncio.to_thread(create_embedding, content)

        # Check existing memories for near-duplicates
        existing = await asyncio.to_thread(
            self.repository.search_memories,
            user_id,
            embedding,
            self.dedup_threshold,
            3,
        )

        if existing:
            best_match = existing[0]
            if best_match.get("similarity", 0) >= self.dedup_threshold:
                existing_id = best_match["id"]
                # Update existing memory with fresh timestamp and highest importance
                new_importance = max(importance, best_match.get("importance", 0.5))
                return await asyncio.to_thread(
                    self.repository.update_memory,
                    existing_id,
                    user_id,
                    content,
                    embedding,
                    new_importance,
                    metadata,
                )

        return await asyncio.to_thread(
            self.repository.create_memory,
            user_id,
            content,
            memory_type,
            embedding,
            importance,
            conversation_id,
            metadata,
        )

    async def build_context(
        self,
        user_id: str,
        conversation_id: Optional[str],
        query: str,
    ) -> Dict[str, Any]:
        """
        Retrieve both recent conversation history and semantic memories concurrently.
        """
        recent_messages: List[Dict[str, Any]] = []
        if conversation_id:
            try:
                recent_messages = await self.get_recent_messages(conversation_id, user_id, limit=10)
            except Exception:
                recent_messages = []

        memories = await self.recall(user_id=user_id, query=query)

        return {
            "recent_messages": recent_messages,
            "long_term_memories": memories,
        }

    async def process_conversation_memory(
        self,
        user_id: str,
        conversation_id: str,
        user_message: str,
        assistant_message: str,
    ) -> List[Dict[str, Any]]:
        """
        Background task to extract and persist notable user insights without delaying chat latency.
        """
        try:
            candidates = await self.extractor.extract(
                user_message=user_message,
                assistant_message=assistant_message,
            )
            saved_memories: List[Dict[str, Any]] = []
            for candidate in candidates:
                saved = await self.remember_safely(
                    user_id=user_id,
                    content=candidate.content,
                    memory_type=candidate.memory_type,
                    conversation_id=conversation_id,
                    importance=candidate.importance,
                    metadata={"source": "automatic_extraction"},
                )
                if saved:
                    saved_memories.append(saved)
            return saved_memories
        except Exception:
            return []

from __future__ import annotations
from typing import Any, Dict, List, Optional
from apps.api.src.core.supabase import get_supabase


class MemoryRepository:
    def __init__(self) -> None:
        self.client = get_supabase()

    # ==========================================================
    # CONVERSATIONS
    # ==========================================================
    def create_conversation(
        self,
        user_id: str,
        title: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = {
            "user_id": user_id,
            "title": title or "New Conversation",
            "metadata": metadata or {},
        }
        response = (
            self.client
            .table("vera_conversations")
            .insert(payload)
            .execute()
        )
        if not response.data:
            raise RuntimeError("Failed to create conversation in Supabase.")
        return response.data[0]

    def get_conversation(
        self,
        conversation_id: str,
        user_id: str,
    ) -> Optional[Dict[str, Any]]:
        response = (
            self.client
            .table("vera_conversations")
            .select("*")
            .eq("id", conversation_id)
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )
        return response.data

    def list_conversations(
        self,
        user_id: str,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        response = (
            self.client
            .table("vera_conversations")
            .select("*")
            .eq("user_id", user_id)
            .order("updated_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []

    def delete_conversation(
        self,
        conversation_id: str,
        user_id: str,
    ) -> bool:
        response = (
            self.client
            .table("vera_conversations")
            .delete()
            .eq("id", conversation_id)
            .eq("user_id", user_id)
            .execute()
        )
        return bool(response.data)

    # ==========================================================
    # MESSAGES
    # ==========================================================
    def save_message(
        self,
        conversation_id: str,
        user_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = {
            "conversation_id": conversation_id,
            "user_id": user_id,
            "role": role,
            "content": content,
            "metadata": metadata or {},
        }
        response = (
            self.client
            .table("vera_messages")
            .insert(payload)
            .execute()
        )
        if not response.data:
            raise RuntimeError("Failed to save message in Supabase.")

        # Update conversation updated_at
        try:
            self.client.table("vera_conversations").update({"updated_at": "now()"}).eq("id", conversation_id).execute()
        except Exception:
            pass

        return response.data[0]

    def get_recent_messages(
        self,
        conversation_id: str,
        user_id: str,
        limit: int = 12,
    ) -> List[Dict[str, Any]]:
        # Check ownership
        conv = self.get_conversation(conversation_id, user_id)
        if not conv:
            return []

        response = (
            self.client
            .table("vera_messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        messages = response.data or []
        return list(reversed(messages))

    # ==========================================================
    # LONG-TERM MEMORIES
    # ==========================================================
    def create_memory(
        self,
        user_id: str,
        content: str,
        memory_type: str,
        embedding: List[float],
        importance: float = 0.5,
        conversation_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = {
            "user_id": user_id,
            "content": content,
            "memory_type": memory_type,
            "embedding": embedding,
            "importance": importance,
            "conversation_id": conversation_id,
            "metadata": metadata or {},
        }
        response = (
            self.client
            .table("vera_memories")
            .insert(payload)
            .execute()
        )
        if not response.data:
            raise RuntimeError("Failed to create memory in Supabase.")
        return response.data[0]

    def update_memory(
        self,
        memory_id: str,
        user_id: str,
        content: str,
        embedding: List[float],
        importance: float,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = {
            "content": content,
            "embedding": embedding,
            "importance": importance,
            "metadata": metadata or {},
        }
        response = (
            self.client
            .table("vera_memories")
            .update(payload)
            .eq("id", memory_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not response.data:
            raise RuntimeError("Failed to update memory in Supabase.")
        return response.data[0]

    def search_memories(
        self,
        user_id: str,
        query_embedding: List[float],
        match_threshold: float = 0.70,
        match_count: int = 8,
    ) -> List[Dict[str, Any]]:
        """
        Calls the PostgreSQL RPC match_vera_memories using cosine distance on pgvector.
        """
        params = {
            "query_embedding": query_embedding,
            "match_user_id": user_id,
            "match_threshold": match_threshold,
            "match_count": match_count,
        }
        response = self.client.rpc("match_vera_memories", params).execute()
        return response.data or []

    def list_memories(
        self,
        user_id: str,
        memory_type: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        query = (
            self.client
            .table("vera_memories")
            .select("id, user_id, conversation_id, memory_type, content, importance, metadata, created_at, updated_at")
            .eq("user_id", user_id)
            .order("importance", desc=True)
            .limit(limit)
        )
        if memory_type:
            query = query.eq("memory_type", memory_type)
        response = query.execute()
        return response.data or []

    def delete_memory(
        self,
        memory_id: str,
        user_id: str,
    ) -> bool:
        response = (
            self.client
            .table("vera_memories")
            .delete()
            .eq("id", memory_id)
            .eq("user_id", user_id)
            .execute()
        )
        return bool(response.data)

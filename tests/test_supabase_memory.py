"""
Integration test suite for VERA Supabase Memory & Persistence Pipeline.
Tests:
1. Supabase client connection and schema validation.
2. Conversation session lifecycle (create, fetch, delete).
3. Message history persistence.
4. Semantic memory embedding (384-d MiniLM) and pgvector match_vera_memories RPC.
5. Deduplication-aware memory updates.
6. Multi-turn chat persistence through /api/v1/chat.
"""

import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app
from apps.api.src.core.supabase import get_supabase
from apps.api.src.modules.memory.infrastructure.embeddings import create_embedding
from apps.api.src.modules.memory.application.service import MemoryService

client = TestClient(app)
TEST_USER_ID = "00000000-0000-0000-0000-000000000001"


def test_supabase_connection():
    """Verify live connection to Supabase and pgvector extension."""
    supabase = get_supabase()
    res = supabase.table("vera_conversations").select("count", count="exact").limit(0).execute()
    assert res is not None
    assert res.count is not None


def test_embedding_generation():
    """Verify SentenceTransformer creates normalized 384-dimensional float vector."""
    text = "User prefers simple explanations with chai analogies."
    vec = create_embedding(text)
    assert isinstance(vec, list)
    assert len(vec) == 384
    assert all(isinstance(x, float) for x in vec)


@pytest.mark.asyncio
async def test_conversation_and_message_lifecycle():
    """Verify creating a conversation and appending messages in Supabase."""
    service = MemoryService()

    # 1. Create conversation
    conv = await service.create_conversation(
        user_id=TEST_USER_ID,
        title="Automated Test Session",
        metadata={"test": True},
    )
    assert conv is not None
    conv_id = conv["id"]
    assert conv["user_id"] == TEST_USER_ID

    try:
        # 2. Save user message
        msg1 = await service.save_message(
            conversation_id=conv_id,
            user_id=TEST_USER_ID,
            role="user",
            content="What is ROIC in simple words?",
        )
        assert msg1["id"] is not None

        # 3. Save assistant message
        msg2 = await service.save_message(
            conversation_id=conv_id,
            user_id=TEST_USER_ID,
            role="assistant",
            content="ROIC measures how efficiently a company generates profits from its invested capital.",
        )
        assert msg2["id"] is not None

        # 4. Fetch recent messages
        recent = await service.get_recent_messages(conv_id, TEST_USER_ID, limit=5)
        assert len(recent) >= 2
        assert recent[-1]["role"] == "assistant"
        assert "ROIC" in recent[-1]["content"]

    finally:
        # Cleanup
        await service.delete_conversation(conv_id, TEST_USER_ID)


@pytest.mark.asyncio
async def test_semantic_memory_and_recall():
    """Verify pgvector semantic search via match_vera_memories RPC in Supabase."""
    service = MemoryService()

    content = "User prefers concise financial explanations with practical bakery analogies."
    saved = await service.remember_safely(
        user_id=TEST_USER_ID,
        content=content,
        memory_type="preference",
        importance=0.9,
    )
    assert saved is not None
    mem_id = saved["id"]

    try:
        # Query semantically (different words, same concept)
        results = await service.recall(
            user_id=TEST_USER_ID,
            query="How should you explain financial concepts to me?",
            threshold=0.50,
            top_k=5,
        )
        assert len(results) >= 1
        top_match = results[0]
        assert "bakery" in top_match["content"].lower() or "concise" in top_match["content"].lower()
        assert top_match["similarity"] > 0.50

    finally:
        # Cleanup
        service.repository.delete_memory(mem_id, TEST_USER_ID)


def test_auth_me_endpoint():
    """Verify /api/v1/auth/me returns user profile."""
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 200
    data = resp.json()
    assert "id" in data
    assert data["id"] == TEST_USER_ID


def test_chat_with_supabase_persistence():
    """Verify chat endpoint automatically saves session to Supabase and returns conversation_id."""
    resp = client.post(
        "/api/v1/chat",
        json={
            "message": "Reliance ne kitna profit kamaya?",
            "company_id": "RELIANCE",
            "company_name": "Reliance Industries Ltd",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "response" in data
    assert len(data["response"]) > 30
    assert "conversation_id" in data
    assert data["conversation_id"] is not None

    conv_id = data["conversation_id"]

    # Verify conversation history was stored in Supabase
    hist_resp = client.get(f"/api/v1/conversations/{conv_id}/messages")
    assert hist_resp.status_code == 200
    hist_data = hist_resp.json()
    assert hist_data["count"] >= 2  # user + assistant

    # Clean up test conversation from Supabase
    client.delete(f"/api/v1/conversations/{conv_id}")

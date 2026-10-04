from __future__ import annotations
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from apps.api.src.core.auth import AuthenticatedUser, get_current_user
from apps.api.src.modules.memory.application.service import MemoryService

router = APIRouter(
    prefix="/api/v1/memory",
    tags=["memory"],
)

memory_service = MemoryService()


class RememberRequest(BaseModel):
    content: str = Field(min_length=1, max_length=5000)
    memory_type: str = Field(default="general", max_length=100)
    importance: float = Field(default=0.5, ge=0.0, le=1.0)
    conversation_id: Optional[str] = None


@router.post("")
async def create_memory(
    request: RememberRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Save an explicit user preference or contextual memory with semantic embedding."""
    try:
        saved = await memory_service.remember_safely(
            user_id=current_user.id,
            content=request.content,
            memory_type=request.memory_type,
            conversation_id=request.conversation_id,
            importance=request.importance,
            metadata={"source": "user_explicit"},
        )
        return {"status": "success", "memory": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save memory: {str(e)}")


@router.get("/recall")
async def recall_memories(
    query: str = Query(..., min_length=1),
    threshold: float = Query(0.70, ge=0.0, le=1.0),
    top_k: int = Query(8, ge=1, le=50),
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieve semantically relevant long-term memories using pgvector cosine distance."""
    try:
        memories = await memory_service.recall(
            user_id=current_user.id,
            query=query,
            threshold=threshold,
            top_k=top_k,
        )
        return {"query": query, "count": len(memories), "memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to recall memories: {str(e)}")


@router.get("")
async def list_memories(
    memory_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """List all stored memories for the authenticated user."""
    try:
        memories = await memory_service.repository.list_memories(
            user_id=current_user.id,
            memory_type=memory_type,
            limit=limit,
        )
        return {"count": len(memories), "memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list memories: {str(e)}")


@router.delete("/{memory_id}")
async def delete_memory(
    memory_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Delete a memory by ID for the authenticated user."""
    success = memory_service.repository.delete_memory(
        memory_id=memory_id,
        user_id=current_user.id,
    )
    if not success:
        raise HTTPException(status_code=404, detail="Memory not found or not owned by user.")
    return {"status": "deleted", "memory_id": memory_id}

from __future__ import annotations
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from apps.api.src.core.auth import AuthenticatedUser, get_current_user
from apps.api.src.modules.memory.application.service import MemoryService

router = APIRouter(
    prefix="/api/v1/conversations",
    tags=["conversations"],
)

memory_service = MemoryService()


class CreateConversationRequest(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)


@router.post("")
async def create_conversation(
    request: CreateConversationRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Create a new conversation session in Supabase for the current user."""
    try:
        conv = await memory_service.create_conversation(
            user_id=current_user.id,
            title=request.title,
        )
        return {"status": "success", "conversation": conv}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create conversation: {str(e)}")


@router.get("")
async def list_conversations(
    limit: int = Query(50, ge=1, le=100),
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """List recent conversation sessions for the current user."""
    try:
        conversations = await memory_service.list_conversations(
            user_id=current_user.id,
            limit=limit,
        )
        return {"count": len(conversations), "conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list conversations: {str(e)}")


@router.get("/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    limit: int = Query(50, ge=1, le=200),
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Fetch message history for a specific conversation belonging to the user."""
    try:
        messages = await memory_service.get_recent_messages(
            conversation_id=conversation_id,
            user_id=current_user.id,
            limit=limit,
        )
        return {"conversation_id": conversation_id, "count": len(messages), "messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch messages: {str(e)}")


@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Delete a conversation and all its messages."""
    success = await memory_service.delete_conversation(
        conversation_id=conversation_id,
        user_id=current_user.id,
    )
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found or not owned by user.")
    return {"status": "deleted", "conversation_id": conversation_id}

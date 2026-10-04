from __future__ import annotations
from fastapi import APIRouter, Depends
from apps.api.src.core.auth import AuthenticatedUser, get_current_user

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
)


@router.get("/me")
async def get_me(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Return authenticated Supabase user profile details."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "is_authenticated": current_user.is_authenticated,
    }

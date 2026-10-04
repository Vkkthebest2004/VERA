from __future__ import annotations
from dataclasses import dataclass
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from apps.api.src.core.supabase import get_supabase

security = HTTPBearer(auto_error=False)

DEFAULT_ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000001"


@dataclass(frozen=True)
class AuthenticatedUser:
    id: str
    email: Optional[str] = None
    role: Optional[str] = None
    is_authenticated: bool = True


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> AuthenticatedUser:
    """
    Authenticate user via Supabase JWT token in Authorization: Bearer <token>.
    If token is valid, returns AuthenticatedUser with verified user ID from Supabase Auth.
    If no token is supplied, returns a guest/anonymous user ID for dev/testing.
    """
    if not credentials or not credentials.credentials:
        # Development / Guest fallback
        return AuthenticatedUser(
            id=DEFAULT_ANONYMOUS_USER_ID,
            email="guest@vera.local",
            role="anonymous",
            is_authenticated=False,
        )

    token = credentials.credentials
    try:
        client = get_supabase()
        user_response = client.auth.get_user(token)
        if user_response and user_response.user:
            u = user_response.user
            return AuthenticatedUser(
                id=str(u.id),
                email=u.email,
                role=getattr(u, "role", "authenticated") or "authenticated",
                is_authenticated=True,
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Supabase authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def require_authenticated_user(
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> AuthenticatedUser:
    """Enforces strict authentication — rejects unauthenticated guest requests."""
    if not current_user.is_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Supabase JWT Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

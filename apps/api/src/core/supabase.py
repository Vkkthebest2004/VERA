from __future__ import annotations
import os
from functools import lru_cache
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    """
    Create and cache the privileged Supabase client for backend operations.
    Uses SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
    """
    url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if not url:
        raise RuntimeError("SUPABASE_URL is not configured in environment.")
    if not service_role_key:
        raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is not configured in environment.")

    return create_client(url, service_role_key)

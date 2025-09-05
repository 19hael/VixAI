from __future__ import annotations

from typing import Any, Dict
import httpx

from ..core.config import settings


def log_optimization(payload: Dict[str, Any]) -> bool:
    if not settings.supabase_url or not settings.supabase_anon_key:
        return False
    url = settings.supabase_url.rstrip("/") + "/rest/v1/" + settings.supabase_table
    headers = {
        "apikey": settings.supabase_anon_key,
        "Authorization": f"Bearer {settings.supabase_anon_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    try:
        r = httpx.post(url, headers=headers, json=payload, timeout=settings.request_timeout_seconds)
        r.raise_for_status()
        return True
    except Exception:
        return False

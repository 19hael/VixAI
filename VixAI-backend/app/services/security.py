from typing import Optional
import httpx
from ..core.config import settings

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

async def verify_turnstile(token: Optional[str], remote_ip: Optional[str] = None, timeout: int = 5) -> bool:
    """
    Verify Cloudflare Turnstile token server-side. If no secret configured or no token provided, returns True
    to avoid breaking flows by default. To enforce strictly, ensure `settings.turnstile_secret` is set and
    validate presence of token at the endpoint level.
    """
    if not settings.turnstile_secret:
        return True
    if not token:
        return False
    data = {"secret": settings.turnstile_secret, "response": token}
    if remote_ip:
        data["remoteip"] = remote_ip
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            r = await client.post(TURNSTILE_VERIFY_URL, data=data)
            r.raise_for_status()
            obj = r.json()
            return bool(obj.get("success"))
    except Exception:
        return False

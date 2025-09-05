from fastapi import APIRouter, HTTPException, Request
from ...models.schemas import (
    GenerateAdRequest,
    GenerateAdResponse,
    LaunchCampaignRequest,
    LaunchCampaignResponse,
)
from ...core.config import settings
from ...services.generator import generate_ads
from ...services.security import verify_turnstile
from ...core.limiter import limiter

router = APIRouter(prefix="/v1", tags=["ads"]) 

@router.post("/generar-anuncio", response_model=GenerateAdResponse)
@limiter.limit("10/minute")
async def generar_anuncio(request: Request, payload: GenerateAdRequest):
    # Optional CAPTCHA verification (enforced only if TURNSTILE_SECRET is configured)
    if settings.turnstile_secret:
        ok = await verify_turnstile(payload.captcha_token, request.client.host if request.client else None)
        if not ok:
            raise HTTPException(status_code=400, detail="Captcha inválido")
    if not payload.url and not payload.descripcion:
        raise HTTPException(status_code=400, detail="Debe proporcionar 'url' o 'descripcion'.")
    result = await generate_ads(payload, timeout=settings.request_timeout_seconds)
    return result


@router.post("/lanzar-campana", response_model=LaunchCampaignResponse)
@limiter.limit("5/minute")
async def lanzar_campana(request: Request, payload: LaunchCampaignRequest):
    # Optional CAPTCHA verification (enforced only if TURNSTILE_SECRET is configured)
    if settings.turnstile_secret:
        ok = await verify_turnstile(payload.captcha_token, request.client.host if request.client else None)
        if not ok:
            raise HTTPException(status_code=400, detail="Captcha inválido")
    # Stub temporal: en producción, integrar con Google Ads para crear campaña/RSAs.
    if not payload.url:
        raise HTTPException(status_code=400, detail="Debe proporcionar 'url' para la campaña.")
    return LaunchCampaignResponse(
        status="queued",
        message=(
            "Campaña recibida. Esto es un stub de desarrollo; "
            "integraremos creación real de campaña en Google Ads."
        ),
    )

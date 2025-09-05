from __future__ import annotations

from typing import Any, Dict
import anyio

from ..core.config import settings
from .llm import generate_assets_hf


async def decide_and_suggest(metrics: Dict[str, Any]) -> Dict[str, Any]:
    campaign_id = metrics.get("campaign_id")
    campaign_name = metrics.get("campaign_name")
    m = metrics.get("metrics", {})
    impressions = int(m.get("impressions", 0))
    clicks = int(m.get("clicks", 0))
    conversions = int(m.get("conversions", 0))
    ctr = float(m.get("ctr", 0.0))
    cost = float(m.get("cost", 0.0))
    cpa = (cost / conversions) if conversions > 0 else None

    low_ctr = ctr < float(settings.ctr_threshold_percent)
    high_cpa = (cpa is not None and cpa > float(settings.max_cpa))

    decisions = {
        "low_ctr": low_ctr,
        "high_cpa": high_cpa,
        "should_pause": high_cpa,
        "should_optimize_copy": low_ctr or high_cpa,
    }

    suggestions = {"titulos": [], "descripciones": [], "ctas": []}
    if decisions["should_optimize_copy"] and settings.hf_api_token:
        contenido = (
            f"Campaña: {campaign_name or campaign_id}. "
            f"Impresiones: {impressions}. Clics: {clicks}. CTR: {ctr:.2f}%. "
            f"Conversiones: {conversions}. Costo: {cost:.2f}. "
            f"CPA: {'{:.2f}'.format(cpa) if cpa is not None else 'N/A'}. "
            f"Analiza estos datos y reescribe titulo y descripcion para mejorar el rendimiento, "
            f"enfatizando una llamada a la accion fuerte y lenguaje directo."
        )
        try:
            suggestions = await generate_assets_hf(
                contenido=contenido,
                idioma=settings.default_language,
                model=settings.hf_model,
                token=settings.hf_api_token,  
                timeout=settings.request_timeout_seconds,
            )
        except Exception:
            suggestions = {"titulos": [], "descripciones": [], "ctas": []}

    return {
        "timestamp": metrics.get("timestamp"),
        "customer_id": metrics.get("customer_id"),
        "campaign_id": campaign_id,
        "campaign_name": campaign_name,
        "window": metrics.get("window"),
        "metrics": m,
        "decisions": decisions,
        "suggestions": suggestions,
    }

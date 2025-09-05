from typing import List, Dict, Optional
from .scraper import fetch_page_text
from ..models.schemas import AdVariant, GenerateAdRequest, GenerateAdResponse
import uuid
from ..core.config import settings
from .llm import generate_assets_hf

BRAND_TONES = {
    "es": {
        "default": {
            "cta": ["Compra ahora", "Descubre más", "Empieza hoy"],
            "platform": ["Google Ads", "Meta Ads", "TikTok Ads"],
        }
    }
}

async def generate_ads(payload: GenerateAdRequest, timeout: int) -> GenerateAdResponse:
    url_info: Dict[str, Optional[str]] = {"title": None, "description": None, "text": None}
    if payload.url:
        url_info = await fetch_page_text(str(payload.url), timeout=timeout)

    base_desc = payload.descripcion or url_info.get("description") or url_info.get("text") or "Producto o servicio"
    negocio = url_info.get("title") or "Negocio"
    nicho = infer_niche(base_desc)

    variants: List[AdVariant] = []
    if settings.hf_api_token:
        contenido = url_info.get("text") or payload.descripcion or base_desc
        assets = await generate_assets_hf(contenido=contenido, idioma=payload.idioma, model=settings.hf_model, token=settings.hf_api_token, timeout=max(timeout, 20))
        if assets.get("titulos") and assets.get("descripciones") and assets.get("ctas"):
            for i in range(min(3, len(assets["titulos"]))):
                titulo = assets["titulos"][i]
                descripcion = assets["descripciones"][i] if i < len(assets["descripciones"]) else base_desc[:180]
                cta = assets["ctas"][i] if i < len(assets["ctas"]) else "Descubre más"
                variants.append(AdVariant(
                    variant_id=str(uuid.uuid4())[:8],
                    titulo=titulo,
                    descripcion=descripcion,
                    cta=cta,
                    plataforma_sugerida="Google Ads",
                    ideas_creativas=[
                        f"Imagen: {negocio} destacando propuesta de valor.",
                        f"Video: Beneficio clave explicado en 6-10s."
                    ],
                ))
    if variants:
        return GenerateAdResponse(
            negocio_detectado=negocio,
            nicho_probable=nicho,
            anuncios=variants,
        )
    ctas = BRAND_TONES.get(payload.idioma, BRAND_TONES["es"]).get("default")["cta"]
    platforms = BRAND_TONES.get(payload.idioma, BRAND_TONES["es"]).get("default")["platform"]

    templates = [
        ("Soluciona", "¿Cansado de {pain}? {brand} lo hace fácil.", "Obtén resultados en días."),
        ("Ahorra", "Ahorra tiempo y dinero con {brand}.", "Sin complicaciones."),
        ("Exclusivo", "{brand}: calidad de nivel premium.", "Edición limitada."),
    ]

    for i, (style, line1, line2) in enumerate(templates):
        titulo = f"{style} con {negocio}"
        descripcion = f"{line1.format(pain='los mismos resultados mediocres', brand=negocio)} {line2} {base_desc[:180]}"
        cta = ctas[i % len(ctas)]
        plataforma = platforms[i % len(platforms)]
        ideas = [
            f"Imagen: {negocio} en acción, destacando el beneficio clave.",
            f"Video corto: Testimonio real de cliente sobre {base_desc[:40]}...",
        ]
        variants.append(AdVariant(
            variant_id=str(uuid.uuid4())[:8],
            titulo=titulo,
            descripcion=descripcion,
            cta=cta,
            plataforma_sugerida=plataforma,
            ideas_creativas=ideas,
        ))

    return GenerateAdResponse(
        negocio_detectado=negocio,
        nicho_probable=nicho,
        anuncios=variants,
    )


def infer_niche(text: str) -> str:
    text_l = text.lower()
    if any(k in text_l for k in ["café", "cafetería", "coffee"]):
        return "Bebidas / Café de especialidad"
    if any(k in text_l for k in ["software", "saas", "plataforma"]):
        return "Tecnología / Software"
    if any(k in text_l for k in ["ropa", "moda", "fashion"]):
        return "Retail / Moda"
    return "General"

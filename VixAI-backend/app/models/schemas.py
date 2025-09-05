from typing import List, Optional
from pydantic import BaseModel, HttpUrl, Field

class GenerateAdRequest(BaseModel):
    url: Optional[HttpUrl] = Field(default=None, description="URL del negocio a analizar")
    descripcion: Optional[str] = Field(default=None, description="Descripción del producto o negocio")
    idioma: str = Field(default="es", description="Idioma deseado para los anuncios")
    captcha_token: Optional[str] = Field(default=None, description="Cloudflare Turnstile token para verificación anti-bots")

    model_config = {
        "json_schema_extra": {
            "example": {
                "url": "https://ejemplo-negocio.com",
                "descripcion": "Tienda de café de especialidad con suscripción mensual.",
                "idioma": "es",
                "captcha_token": "example-captcha-token"
            }
        }
    }

class AdVariant(BaseModel):
    variant_id: str
    titulo: str
    descripcion: str
    cta: str
    plataforma_sugerida: str
    ideas_creativas: List[str] = []

class GenerateAdResponse(BaseModel):
    negocio_detectado: Optional[str] = None
    nicho_probable: Optional[str] = None
    anuncios: List[AdVariant]


class LaunchCampaignRequest(BaseModel):
    url: Optional[HttpUrl] = Field(default=None, description="URL de destino para la campaña")
    presupuesto: Optional[float] = Field(default=None, description="Presupuesto estimado en la moneda de la cuenta")
    audiencia: Optional[str] = Field(default=None, description="Audiencia objetivo (texto libre)")
    captcha_token: Optional[str] = Field(default=None, description="Cloudflare Turnstile token para verificación anti-bots")


class LaunchCampaignResponse(BaseModel):
    status: str
    message: Optional[str] = None

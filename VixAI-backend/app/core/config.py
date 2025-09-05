from pydantic_settings import BaseSettings
from typing import List, Any
from pydantic import Field, field_validator

class Settings(BaseSettings):
    app_name: str = "VixAI Backend"
    environment: str = "development"
    allowed_origins: List[str] | str = "*"
    request_timeout_seconds: int = 10
    hf_api_token: str | None = None
    hf_model: str = "mistralai/Mistral-7B-Instruct-v0.3"
    google_ads_developer_token: str | None = None
    google_ads_client_id: str | None = None
    google_ads_client_secret: str | None = None
    google_ads_refresh_token: str | None = None
    google_ads_login_customer_id: str | None = None
    google_ads_customer_id: str | None = None
    google_ads_campaign_id: str | None = None
    google_ads_ad_group_id: str | None = None
    google_ads_final_url: str | None = None

    metrics_interval_hours: int = 24  
    metrics_output_path: str = "metrics/google_ads_metrics.ndjson"
    actions_output_path: str = "metrics/google_ads_actions.ndjson"

    ctr_threshold_percent: float = 1.0
    max_cpa: float = 100.0
    default_language: str = "es"

    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    supabase_table: str = "optimizations"

    # Cloudflare Turnstile secret for CAPTCHA verification (server-side)
    turnstile_secret: str | None = None

    class Config:
        env_file = ".env"

    @field_validator("allowed_origins", mode="after")
    @classmethod
    def _parse_allowed_origins(cls, v: Any) -> List[str]:
        # Accept a single string (e.g., "*") or comma-separated list and normalize to List[str]
        if v is None:
            return ["*"]
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return ["*"]
            return [s.strip() for s in v.split(",") if s.strip()]
        if isinstance(v, list):
            return [str(s).strip() for s in v if str(s).strip()]
        return ["*"]

settings = Settings()

from __future__ import annotations

import os
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import anyio

from ..core.config import settings
from .google_ads import (
    fetch_campaign_metrics,
    persist_metrics,
    pause_enabled_ads_in_ad_group,
    create_responsive_search_ad,
)
from .agent import decide_and_suggest
from .supabase_logger import log_optimization

_scheduler: Optional[BackgroundScheduler] = None


def _job_google_ads_metrics():
    required = [
        settings.google_ads_developer_token,
        settings.google_ads_client_id,
        settings.google_ads_client_secret,
        settings.google_ads_refresh_token,
        settings.google_ads_customer_id,
        settings.google_ads_campaign_id,
    ]
    if any(v in (None, "") for v in required):
        print("[scheduler] Google Ads creds or IDs missing; skipping metrics fetch.")
        return

    try:
        data = fetch_campaign_metrics(
            developer_token=settings.google_ads_developer_token,  
            client_id=settings.google_ads_client_id,  
            client_secret=settings.google_ads_client_secret, 
            refresh_token=settings.google_ads_refresh_token,  
            customer_id=str(settings.google_ads_customer_id),  
            campaign_id=str(settings.google_ads_campaign_id),  
            login_customer_id=(str(settings.google_ads_login_customer_id) if settings.google_ads_login_customer_id else None),
            lookback_days=max(1, settings.metrics_interval_hours // 24) if settings.metrics_interval_hours >= 24 else 1,
        )
        out_path = settings.metrics_output_path
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        persist_metrics(data, out_path)

        actions = None
        try:
            actions = anyio.run(decide_and_suggest, data)
        except Exception:
            actions = None

        if actions and actions.get("decisions", {}).get("should_optimize_copy"):
            if not settings.google_ads_ad_group_id or not settings.google_ads_final_url:
                print("[scheduler] Missing ad group id or final url; skipping optimization.")
            else:
                paused = []
                try:
                    paused = pause_enabled_ads_in_ad_group(
                        developer_token=settings.google_ads_developer_token,  
                        client_id=settings.google_ads_client_id,  
                        client_secret=settings.google_ads_client_secret, 
                        refresh_token=settings.google_ads_refresh_token,  
                        customer_id=str(settings.google_ads_customer_id),
                        ad_group_id=str(settings.google_ads_ad_group_id),
                        login_customer_id=(str(settings.google_ads_login_customer_id) if settings.google_ads_login_customer_id else None),
                    )
                except Exception as e:
                    print(f"[scheduler] Error pausing ads: {e}")

                headlines = actions.get("suggestions", {}).get("titulos", [])
                descriptions = actions.get("suggestions", {}).get("descripciones", [])
                new_ad_rn = None
                try:
                    if headlines and descriptions:
                        new_ad_rn = create_responsive_search_ad(
                            developer_token=settings.google_ads_developer_token,  
                            client_id=settings.google_ads_client_id,  
                            client_secret=settings.google_ads_client_secret, 
                            refresh_token=settings.google_ads_refresh_token,  
                            customer_id=str(settings.google_ads_customer_id),
                            ad_group_id=str(settings.google_ads_ad_group_id),
                            headlines=headlines,
                            descriptions=descriptions,
                            final_url=str(settings.google_ads_final_url),
                            login_customer_id=(str(settings.google_ads_login_customer_id) if settings.google_ads_login_customer_id else None),
                        )
                except Exception as e:
                    print(f"[scheduler] Error creating RSA: {e}")

                log_payload = {
                    "timestamp": actions.get("timestamp"),
                    "customer_id": actions.get("customer_id"),
                    "campaign_id": actions.get("campaign_id"),
                    "campaign_name": actions.get("campaign_name"),
                    "ad_group_id": str(settings.google_ads_ad_group_id) if settings.google_ads_ad_group_id else None,
                    "paused_ads": paused,
                    "new_ad_resource_name": new_ad_rn,
                    "decisions": actions.get("decisions"),
                    "metrics": actions.get("metrics"),
                    "suggestions": actions.get("suggestions"),
                }
                try:
                    log_optimization(log_payload)
                except Exception:
                    pass

        if actions:
            actions_path = settings.actions_output_path
            os.makedirs(os.path.dirname(actions_path), exist_ok=True)
            persist_metrics(actions, actions_path)
        print(f"[scheduler] Google Ads metrics saved to {out_path}")
    except Exception as e:
        print(f"[scheduler] Error fetching Google Ads metrics: {e}")


def init_scheduler():
    global _scheduler
    if _scheduler is not None:
        return _scheduler

    scheduler = BackgroundScheduler(timezone="UTC")
    interval_hours = max(1, int(settings.metrics_interval_hours))
    scheduler.add_job(
        _job_google_ads_metrics,
        trigger=IntervalTrigger(hours=interval_hours),
        id="google_ads_metrics_job",
        replace_existing=True,
        coalesce=True,
        max_instances=1,
    )
    scheduler.start()
    print(f"[scheduler] Started with interval {interval_hours}h")
    _scheduler = scheduler
    return _scheduler


def shutdown_scheduler():
    global _scheduler
    if _scheduler:
        _scheduler.shutdown(wait=False)
        print("[scheduler] Stopped")
        _scheduler = None

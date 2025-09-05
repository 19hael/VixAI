from __future__ import annotations

import datetime as dt
import json
from typing import Dict, Any, Optional, List

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException


def _build_client(cfg: Dict[str, Any]) -> GoogleAdsClient:
    return GoogleAdsClient.load_from_dict(
        {
            "developer_token": cfg["developer_token"],
            "login_customer_id": cfg.get("login_customer_id"),
            "use_proto_plus": True,
            "client_id": cfg["client_id"],
            "client_secret": cfg["client_secret"],
            "refresh_token": cfg["refresh_token"],
        }
    )


def fetch_campaign_metrics(
    *,
    developer_token: str,
    client_id: str,
    client_secret: str,
    refresh_token: str,
    customer_id: str,
    campaign_id: str,
    login_customer_id: Optional[str] = None,
    lookback_days: int = 1,
) -> Dict[str, Any]:
    cfg = {
        "developer_token": developer_token,
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "login_customer_id": login_customer_id,
    }
    client = _build_client(cfg)

    ga_service = client.get_service("GoogleAdsService")

    start_date = (dt.date.today() - dt.timedelta(days=lookback_days)).strftime("%Y-%m-%d")
    end_date = dt.date.today().strftime("%Y-%m-%d")

    query = f"""
        SELECT
          campaign.id,
          campaign.name,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.ctr,
          metrics.cost_micros
        FROM campaign
        WHERE campaign.id = {campaign_id}
          AND segments.date BETWEEN '{start_date}' AND '{end_date}'
    """

    response = ga_service.search(customer_id=customer_id, query=query)

    impressions = clicks = conversions = cost_micros = 0
    ctr = 0.0
    campaign_name = None

    for row in response:
        campaign_name = row.campaign.name
        impressions += int(row.metrics.impressions)
        clicks += int(row.metrics.clicks)
        conversions += int(row.metrics.conversions)
        cost_micros += int(row.metrics.cost_micros)

    ctr = (clicks / impressions * 100.0) if impressions else 0.0

    result = {
        "timestamp": dt.datetime.utcnow().isoformat() + "Z",
        "customer_id": customer_id,
        "campaign_id": str(campaign_id),
        "campaign_name": campaign_name,
        "window": {
            "start": start_date,
            "end": end_date,
        },
        "metrics": {
            "impressions": impressions,
            "clicks": clicks,
            "conversions": conversions,
            "ctr": ctr,
            "cost_micros": cost_micros,
            "cost": cost_micros / 1_000_000.0,
        },
    }
    return result


def persist_metrics(metrics: Dict[str, Any], path: str) -> None:
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(metrics, ensure_ascii=False) + "\n")


def pause_enabled_ads_in_ad_group(
    *,
    developer_token: str,
    client_id: str,
    client_secret: str,
    refresh_token: str,
    customer_id: str,
    ad_group_id: str,
    login_customer_id: Optional[str] = None,
) -> List[str]:
    cfg = {
        "developer_token": developer_token,
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "login_customer_id": login_customer_id,
    }
    client = _build_client(cfg)
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT ad_group_ad.resource_name, ad_group_ad.status
        FROM ad_group_ad
        WHERE ad_group_ad.ad_group = 'customers/{customer_id}/adGroups/{ad_group_id}'
          AND ad_group_ad.status = ENABLED
    """
    rows = ga_service.search(customer_id=customer_id, query=query)
    to_pause = [row.ad_group_ad.resource_name for row in rows]
    if not to_pause:
        return []
    ad_group_ad_service = client.get_service("AdGroupAdService")
    operations = []
    for rn in to_pause:
        ad_group_ad_operation = client.get_type("AdGroupAdOperation")
        ad_group_ad = ad_group_ad_operation.update
        ad_group_ad.resource_name = rn
        ad_group_ad.status = client.enums.AdGroupAdStatusEnum.PAUSED
        client.copy_from(ad_group_ad_operation.update_mask, client.get_type("FieldMask")(paths=["status"]))
        operations.append(ad_group_ad_operation)
    ad_group_ad_service.mutate_ad_group_ads(customer_id=customer_id, operations=operations)
    return to_pause


def create_responsive_search_ad(
    *,
    developer_token: str,
    client_id: str,
    client_secret: str,
    refresh_token: str,
    customer_id: str,
    ad_group_id: str,
    headlines: List[str],
    descriptions: List[str],
    final_url: str,
    login_customer_id: Optional[str] = None,
) -> str:
    cfg = {
        "developer_token": developer_token,
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "login_customer_id": login_customer_id,
    }
    client = _build_client(cfg)
    ad_group_ad_service = client.get_service("AdGroupAdService")
    ad_group_ad_operation = client.get_type("AdGroupAdOperation")
    ad_group_ad = ad_group_ad_operation.create
    ad_group_ad.ad_group = f"customers/{customer_id}/adGroups/{ad_group_id}"
    ad = ad_group_ad.ad
    rsa = ad.responsive_search_ad
    for h in headlines[:15]:
        asset = client.get_type("AdTextAsset")
        asset.text = h[:30]
        rsa.headlines.append(asset)
    for d in descriptions[:4]:
        asset = client.get_type("AdTextAsset")
        asset.text = d[:90]
        rsa.descriptions.append(asset)
    ad.final_urls.append(final_url)
    ad_group_ad.status = client.enums.AdGroupAdStatusEnum.ENABLED
    response = ad_group_ad_service.mutate_ad_group_ads(customer_id=customer_id, operations=[ad_group_ad_operation])
    return response.results[0].resource_name

import re
import anyio
import requests
from bs4 import BeautifulSoup
from typing import Optional, Dict

async def fetch_page_text(url: str, timeout: int = 10) -> Dict[str, Optional[str]]:
    try:
        def _fetch():
            resp = requests.get(url, headers={"User-Agent": "VixAIBot/0.1 (+https://vixai.lat)"}, timeout=timeout, allow_redirects=True)
            resp.raise_for_status()
            return resp.text
        html = await anyio.to_thread.run_sync(_fetch)
    except Exception:
        return {"title": None, "description": None, "text": None}

    soup = BeautifulSoup(html, "html.parser")
    title = (soup.title.string.strip() if soup.title and soup.title.string else None)
    meta_desc = None
    desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
    if desc_tag:
        meta_desc = desc_tag.get("content")
    for tag in soup(["script", "style", "noscript"]):
        tag.extract()
    text = re.sub(r"\s+", " ", soup.get_text(" ").strip())
    return {"title": title, "description": meta_desc, "text": text[:5000]}

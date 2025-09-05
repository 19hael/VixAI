import json
import httpx
from typing import Dict, List

LLM_PROMPT_TEMPLATE = (
    "Eres un experto en marketing digital para PyMEs. Analiza el siguiente texto sobre un producto o servicio y genera exactamente 3 titulos persuasivos, 3 descripciones atractivas y 3 llamadas a la accion (CTAs) para un anuncio de Google Ads. El tono debe ser profesional y directo. Devuelve exclusivamente un JSON valido con la siguiente estructura: {\"titulos\":[...],\"descripciones\":[...],\"ctas\":[...]}. Texto a analizar:\n\n[CONTENIDO]: {contenido}\n[IDIOMA]: {idioma}"
)

async def generate_assets_hf(contenido: str, idioma: str, model: str, token: str, timeout: int = 30) -> Dict[str, List[str]]:
    prompt = LLM_PROMPT_TEMPLATE.format(contenido=contenido, idioma=idioma)
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {"inputs": prompt, "parameters": {"max_new_tokens": 256, "temperature": 0.7, "return_full_text": False}}
    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.post(f"https://api-inference.huggingface.co/models/{model}", headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
    if isinstance(data, list) and data and "generated_text" in data[0]:
        text = data[0]["generated_text"]
    elif isinstance(data, dict) and "generated_text" in data:
        text = data["generated_text"]
    else:
        text = json.dumps({"titulos": [], "descripciones": [], "ctas": []})
    try:
        parsed = json.loads(text)
        titulos = [str(x) for x in parsed.get("titulos", [])][:3]
        descripciones = [str(x) for x in parsed.get("descripciones", [])][:3]
        ctas = [str(x) for x in parsed.get("ctas", [])][:3]
        return {"titulos": titulos, "descripciones": descripciones, "ctas": ctas}
    except Exception:
        return {"titulos": [], "descripciones": [], "ctas": []}

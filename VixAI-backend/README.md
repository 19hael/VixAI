# VixAI Backend (FastAPI)

Backend básico para VixAI: agente de IA para generación y gestión de anuncios. Incluye endpoint `/v1/generar-anuncio` que acepta URL o descripción y devuelve variantes de anuncios listas para pruebas A/B.

## Arquitectura
- `app/main.py`: App FastAPI, CORS, `/healthz` y ruteo.
- `app/api/v1/ads.py`: Endpoint `POST /v1/generar-anuncio`.
- `app/services/scraper.py`: Scraping básico con httpx + BeautifulSoup.
- `app/services/generator.py`: Generador de anuncios con integración opcional a LLM.
- `app/services/llm.py`: Conector a Hugging Face Inference API para generar títulos, descripciones y CTAs.
- `app/models/schemas.py`: Modelos Pydantic (request/response).
- `app/core/config.py`: Configuración (CORS, timeouts) vía variables de entorno.

## Ejecución local (Windows)

1) Crear entorno virtual e instalar dependencias:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2) Iniciar servidor:
```powershell
uvicorn app.main:app --reload --port 8000
```

3) Probar endpoints:
- Healthcheck: http://127.0.0.1:8000/healthz
- Docs: http://127.0.0.1:8000/docs

Ejemplo de request:
```json
{
  "url": "https://ejemplo-negocio.com",
  "descripcion": "Tienda de café de especialidad con suscripción mensual.",
  "idioma": "es"
}
```

## LLM (Hugging Face Inference API)

Variables de entorno:

- `HF_API_TOKEN`
- `HF_MODEL` (por defecto `mistralai/Mistral-7B-Instruct-v0.3`)

Ejemplo `.env`:

```
HF_API_TOKEN=hf_xxx
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

Con `HF_API_TOKEN` definido, el endpoint `/v1/generar-anuncio` usará el LLM para producir 3 títulos, 3 descripciones y 3 CTAs siguiendo un prompt estricto y devolverá 3 variantes.

## Docker

Construir y correr:
```bash
docker build -t vixai-backend:dev .
docker run --rm -p 8000:8000 vixai-backend:dev
```

## Próximos pasos
- Integración con APIs: Google Ads, Meta, TikTok.
- Conector a LLMs adicionales (OpenAI/Gemini) para copy y optimización en tiempo real.
- Persistencia en PostgreSQL para campañas/experimentos.
- Sistema de tareas y scheduler para optimización autónoma.

## Contacto
Para consultas de negocio y colaboración: support@vixai.lat

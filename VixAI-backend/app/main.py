from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1.ads import router as ads_router
from .services.scheduler import init_scheduler, shutdown_scheduler
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from .core.limiter import limiter

app = FastAPI(title=settings.app_name)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def _startup():
    init_scheduler()

@app.on_event("shutdown")
async def _shutdown():
    shutdown_scheduler()

@app.get("/healthz")
async def healthz():
    return {"status": "ok", "service": settings.app_name, "env": settings.environment}

app.include_router(ads_router)

"""FastAPI application entrypoint."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes import dashboard, tickets
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import get_logger
from app.database.session import SessionLocal, engine

logger = get_logger("supportdesk.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection established.")
    except Exception:  # pragma: no cover - depends on runtime DB
        logger.exception("Database connection failed at startup.")

    # Auto-create tables for local SQLite development. In production the
    # Docker entrypoint runs `alembic upgrade head` before uvicorn starts,
    # so this is a no-op there (tables already exist).
    try:
        import app.models  # noqa: F401 — register models on Base.metadata
        from app.database.base import Base
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables ensured.")
    except Exception:  # pragma: no cover
        logger.exception("Failed to create tables at startup.")

    if os.getenv("SEED_ON_STARTUP", "true").lower() == "true":
        try:
            from app.utils.seed import seed_if_empty

            db = SessionLocal()
            try:
                seed_if_empty(db)
            finally:
                db.close()
        except Exception:  # pragma: no cover
            logger.exception("Seeding failed.")

    yield

    # --- Shutdown ---
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(tickets.router)
app.include_router(dashboard.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": settings.APP_NAME, "version": settings.APP_VERSION}

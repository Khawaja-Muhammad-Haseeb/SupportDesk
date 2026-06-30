"""Application configuration loaded from environment variables."""
from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Application ---
    APP_NAME: str = "SupportDesk API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str = "change-me-in-production"

    # --- Database ---
    # Full SQLAlchemy URL. When running under Docker Compose this is injected
    # via the DATABASE_URL environment variable. Falls back to the individual
    # POSTGRES_* parts only when DATABASE_URL is not provided.
    DATABASE_URL: str = "postgresql+psycopg2://supportdesk:supportdesk@localhost:5432/supportdesk"
    POSTGRES_USER: str = "supportdesk"
    POSTGRES_PASSWORD: str = "supportdesk"
    POSTGRES_DB: str = "supportdesk"
    POSTGRES_PORT: int = 5432
    POSTGRES_HOST: str = "localhost"

    # --- CORS ---
    # Comma-separated list of allowed origins for the React frontend.
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @field_validator("DATABASE_URL")
    @classmethod
    def normalize_db_url(cls, v: str) -> str:
        # Allow plain "postgresql://" URLs by upgrading them to the psycopg2 driver.
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+psycopg2://", 1)
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

"""Pytest fixtures: an isolated in-memory SQLite database per test."""
import os

# Configure environment before importing the app so settings pick safe values.
os.environ.setdefault("SEED_ON_STARTUP", "false")
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:5173")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401  (register models on Base.metadata)
from app.database.base import Base
from app.database.session import get_db
from app.main import app

# A single shared in-memory database for the whole test session.
test_engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    bind=test_engine, autoflush=False, autocommit=False, future=True
)


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
def _setup_database():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def make_payload(**overrides):
    payload = {
        "customerName": "Test User",
        "customerEmail": "test.user@example.com",
        "subject": "Something is broken",
        "description": "This is a detailed description of the issue.",
        "priority": "MEDIUM",
    }
    payload.update(overrides)
    return payload

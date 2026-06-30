#!/bin/sh
set -e

echo "[entrypoint] Waiting for the database to accept migrations..."

# Apply database migrations (retry while Postgres finishes starting up).
ATTEMPTS=0
MAX_ATTEMPTS=30
until alembic upgrade head; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    echo "[entrypoint] Migrations failed after ${MAX_ATTEMPTS} attempts. Exiting."
    exit 1
  fi
  echo "[entrypoint] Migration attempt ${ATTEMPTS} failed; retrying in 2s..."
  sleep 2
done

echo "[entrypoint] Migrations applied. Starting API server."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000

.PHONY: help install infra-up infra-down web-dev api-dev worker-dev test lint type-check

help:
	@echo "VERA Development Commands:"
	@echo "  make install     - Install all backend and frontend dependencies"
	@echo "  make infra-up    - Start Postgres (pgvector), Redis, and MinIO in Docker"
	@echo "  make infra-down  - Stop Docker infrastructure"
	@echo "  make web-dev     - Run Next.js web application"
	@echo "  make api-dev     - Run FastAPI backend"
	@echo "  make worker-dev  - Run Celery background worker"
	@echo "  make test        - Run test suites"
	@echo "  make type-check  - Run TypeScript typecheck on web app"
	@echo "  make lint        - Run linters (ruff, eslint)"

install:
	uv pip install -r requirements.txt
	cd apps/web && npm install

infra-up:
	docker compose up -d

infra-down:
	docker compose down

web-dev:
	cd apps/web && npm run dev

api-dev:
	source .venv/bin/activate && uvicorn apps.api.src.main:app --reload --port 8000

worker-dev:
	source .venv/bin/activate && celery -A apps.worker.src.main.celery_app worker --loglevel=info

test:
	source .venv/bin/activate && pytest

lint:
	source .venv/bin/activate && ruff check .
	cd apps/web && npm run lint

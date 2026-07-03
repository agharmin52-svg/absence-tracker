.PHONY: help setup up down logs db-shell build clean test

help:
	@echo "دستورات دستیار پروژه:"
	@echo "  make setup       - راه‌اندازی اولیه Docker و دیتابیس"
	@echo "  make up          - شروع containers"
	@echo "  make down        - متوقف کردن containers"
	@echo "  make logs        - مشاهده logs"
	@echo "  make db-shell    - اتصال به دیتابیس PostgreSQL"
	@echo "  make build       - بسازش دوباره containers"
	@echo "  make clean       - حذف containers و volumes"
	@echo "  make test        - اجرای تست‌ها"

setup:
	@echo "🚀 راه‌اندازی پروژه..."
	@chmod +x setup.sh
	@./setup.sh

up:
	@echo "🚀 شروع containers..."
	docker compose up -d
	@echo "✓ Containers اجرا شدند"
	@echo "API: http://localhost:4000"

down:
	@echo "🛑 متوقف کردن containers..."
	docker compose down
	@echo "✓ Containers متوقف شدند"

logs:
	@docker compose logs -f

logs-api:
	@docker compose logs -f api

logs-db:
	@docker compose logs -f postgres

db-shell:
	@docker compose exec postgres psql -U postgres -d absence_tracker

build:
	@echo "🔨 ساخت دوباره containers..."
	docker compose build --no-cache
	docker compose up -d
	@echo "✓ Containers دوباره ساخته شدند"

clean:
	@echo "🧹 پاک کردن تمام containers و volumes..."
	docker compose down -v
	@echo "✓ همه چیز پاک شد"

test:
	@echo "🧪 اجرای تست‌های API..."
	curl -s http://localhost:4000/health | jq .
	curl -s http://localhost:4000/api/videos | jq .
	@echo "✓ تست‌ها انجام شدند"

dev:
	@echo "💻 شروع mode توسعه..."
	docker compose up -d
	cd app && npm install && npm start

restart:
	@docker compose restart

shell-api:
	@docker compose exec api sh

.DEFAULT_GOAL := help

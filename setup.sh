#!/bin/bash

# Script برای راه‌اندازی پروژه در Docker Desktop

set -e

echo "🚀 شروع راه‌اندازی پروژه Absence Tracker..."

# بررسی نصب Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker نصب نشده است"
    echo "دانلود Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# بررسی نصب Docker Compose
if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose نصب نشده است"
    exit 1
fi

echo "✓ Docker و Docker Compose نصب شده‌اند"

# بررسی Docker daemon
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon اجرا نشده است"
    echo "لطفاً Docker Desktop را باز کنید"
    exit 1
fi

echo "✓ Docker daemon اجرا شده است"

# پاک کردن containers قدیمی
echo "🧹 پاک کردن containers قدیمی..."
docker compose down || true

# ساخت و اجرا
echo "🔨 ساخت و اجرای containers..."
docker compose up --build -d

# انتظار برای اتصال database
echo "⏳ منتظر اتصال database..."
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "✓ Database آماده است"
        break
    fi
    echo "  تلاش $i/30..."
    sleep 2
done

# بررسی health
echo "🏥 بررسی سلامت API..."
sleep 5
if curl -f http://localhost:4000/health > /dev/null 2>&1; then
    echo "✓ API سالم است"
else
    echo "⚠️  API هنوز آماده نیست، logs را بررسی کنید:"
    docker compose logs api
fi

echo ""
echo "✅ پروژه با موفقیت راه‌اندازی شد!"
echo ""
echo "📍 آدرس‌های مهم:"
echo "  API Server: http://localhost:4000"
echo "  Health Check: http://localhost:4000/health"
echo "  Database: localhost:5432"
echo ""
echo "📝 دستورات مفید:"
echo "  مشاهده logs: docker compose logs -f"
echo "  متوقف کردن: docker compose stop"
echo "  اجرای دوباره: docker compose start"
echo "  حذف کل (داده‌ها شامل): docker compose down -v"
echo ""

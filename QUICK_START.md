# راهنمای سریع اجرای پروژه

## الزامات

- **Docker Desktop**: [دانلود و نصب](https://www.docker.com/products/docker-desktop)
- **Git**: برای کلون کردن پروژه

## مراحل اجرا

### 1. نصب Docker Desktop

#### برای Windows:
```bash
# دانلود از https://www.docker.com/products/docker-desktop
# نصب و restart سیستم
```

#### برای macOS:
```bash
# یا از App Store یا:
brew install docker
```

#### برای Linux:
```bash
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
```

### 2. راه‌اندازی Docker

```bash
# باز کردن Docker Desktop (بر روی Windows/macOS)
# یا شروع دیمون Docker (بر روی Linux)

# بررسی نصب درست
docker --version
docker compose --version
```

### 3. اجرای پروژه

```bash
# از دایرکتوری ریشه پروژه
cd /workspaces/absence-tracker

# ساخت و اجرای containers
docker compose up --build

# در terminal دوم (برای اجرای Expo)
cd app
npm install
npm start
```

### 4. بررسی اتصال

```bash
# در terminal جدید
curl http://localhost:4000/health

# پاسخ دریافت شده:
# {"status":"ok","database":"connected"}
```

## آدرس‌های مهم

- **API Server**: http://localhost:4000
- **Database**: localhost:5432
- **Health Check**: http://localhost:4000/health
- **Video API**: http://localhost:4000/api/videos
- **Journal API**: http://localhost:4000/api/journal

## اتصال به پایگاه‌داده

### از طریق DBeaver:

1. دانلود [DBeaver](https://dbeaver.io/)
2. کلیک بر روی Database → New Database Connection
3. انتخاب PostgreSQL
4. تنظیمات:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: absence_tracker

### از طریق CLI:

```bash
psql -h localhost -U postgres -d absence_tracker
```

## حل مشکلات

### خطای Port 5432 یا 4000 مشغول است

```bash
# یافتن پروسسی که از port استفاده می‌کند
lsof -i :5432
lsof -i :4000

# یا از Docker Compose exit کنید
docker compose down
```

### خطای Build ناموفق

```bash
# حذف cache و rebuild
docker compose build --no-cache

# سپس اجرا
docker compose up
```

### Database Connection Error

```bash
# بررسی وضعیت containers
docker compose ps

# مشاهده logs
docker compose logs postgres
docker compose logs api
```

## دستورات مفید

```bash
# متوقف کردن containers
docker compose stop

# حذف containers و volumes
docker compose down
docker compose down -v  # شامل داده‌های دیتابیس

# مشاهده logs
docker compose logs -f api

# اجرای دستور در container
docker compose exec api npx ts-node src/index.ts
```

## متغیرهای محیطی

فایل `.env.example`:
```
PORT=4000
DATABASE_URL=postgres://postgres:postgres@postgres:5432/absence_tracker
```

برای تغییر پورت یا اطلاعات دیتابیس، `docker-compose.yml` را ویرایش کنید.

# راهنمای نصب و اجرای Docker — Absence Tracker

## نصب Docker Desktop

### برای Windows و macOS

1. **دانلود Docker Desktop:**
   - از سایت رسمی دانلود کنید: https://www.docker.com/products/docker-desktop
   - نسخه مناسب برای سیستم خود را انتخاب کنید

2. **نصب:**
   - فایل دانلود شده را اجرا کنید
   - دستورالعمل‌های نصب را دنبال کنید
   - بعد از نصب، Docker Desktop را اجرا کنید

3. **تایید نصب:**
   ```bash
   docker --version
   docker compose --version
   ```

### برای Linux

```bash
# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# نصب Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# تایید نصب
docker --version
docker compose --version

# اضافه کردن کاربر به گروه docker (اختیاری، برای اجرای بدون sudo)
sudo usermod -aG docker $USER
# سپس logout و login کنید یا اجرا کنید:
newgrp docker
```

## ساختار فایل‌های Docker در پروژه

```
absence-tracker/
├── docker-compose.yml          # تعریف سرویس‌ها (PostgreSQL و API)
├── backend/
│   ├── Dockerfile              # تصویر Docker برای API
│   ├── package.json            # وابستگی‌های Node.js
│   ├── tsconfig.json           # تنظیمات TypeScript
│   ├── .env.example            # نمونه متغیرهای محیطی
│   └── src/
│       ├── index.ts            # نقطه ورود سرویس
│       ├── db.ts               # تنظیمات دیتابیس PostgreSQL
│       └── routes/
│           └── videos.ts       # API endpoints برای ویدیوها
└── app/                        # اپلیکیشن Expo React Native
```

## اجرای پروژه

### مرحله 1: بالا آوردن Docker Containers

از ریشه پروژه دستور زیر را اجرا کنید:

```bash
cd /workspaces/absence-tracker
docker compose up --build
```

**توضیح:**
- `docker compose up`: سرویس‌ها را شروع می‌کند
- `--build`: تصویرهای Docker را ابتدا ساخته و سپس شروع می‌کند

**خروجی انتظار‌رفته:**
```
postgres-1  | LOG:  database system is ready to accept connections
api-1       | API server listening on http://localhost:4000
```

### مرحله 2: چک کردن سلامت سرویس‌ها

در ترمینال جدید:

```bash
# چک کردن health endpoint
curl http://localhost:4000/health

# نتیجه انتظار‌رفته:
# {"status":"ok"}
```

### مرحله 3: اجرای اپلیکیشن Expo (در ترمینال جدید)

```bash
cd /workspaces/absence-tracker/app
npx expo start --web --lan --clear
```

اکنون سه چیز اجرا می‌شود:
- PostgreSQL روی `localhost:5432`
- API backend روی `localhost:4000`
- Expo dev server برای اپلیکیشن React Native

## دستورات مفید Docker

### مشاهده وضعیت کانتینرها

```bash
docker compose ps
```

خروجی نمونه:
```
NAME            STATUS          PORTS
postgres        Up 5 minutes    5432/tcp
api             Up 5 minutes    4000/tcp
```

### مشاهده لاگ‌ها

```bash
# تمام کانتینرها
docker compose logs -f

# فقط PostgreSQL
docker compose logs -f postgres

# فقط API
docker compose logs -f api
```

### متوقف کردن سرویس‌ها

```bash
docker compose stop
```

### حذف تمام داده‌ها (Volumes)

```bash
docker compose down -v
```

⚠️ **توجه:** این دستور تمام داده‌های PostgreSQL را حذف می‌کند.

### دوباره اجرا

```bash
docker compose restart
```

## اتصال به دیتابیس PostgreSQL

### از طریق ابزارهای GUI

**نرم‌افزارهای توصیه‌شده:**
- [DBeaver](https://dbeaver.io/) (رایگان، قدرتمند)
- [TablePlus](https://tableplus.com/) (پولی، کاربردی)
- [pgAdmin](https://www.pgadmin.org/) (رایگان، وب‌ی)

**اطلاعات اتصال:**
```
Host:     localhost
Port:     5432
Username: postgres
Password: postgres
Database: absence_tracker
```

### از طریق `psql` (بدون GUI)

```bash
# نصب psql (اگر نصب نباشد)
# macOS: brew install postgresql
# Windows: https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql-client

# اتصال
psql -h localhost -U postgres -d absence_tracker

# دستورات SQL مفید:
# \dt                    # نمایش تمام جداول
# SELECT * FROM videos;  # مشاهده ویدیوها
# \q                     # خروج
```

## استفاده از Docker Desktop GUI

### روی Windows / macOS

1. Docker Desktop را باز کنید
2. به تب **Containers / Apps** بروید
3. کانتینرهای `postgres` و `api` را ببینید:
   - نام: `absence-tracker-postgres-1` و `absence-tracker-api-1`
   - وضعیت: `Running`
4. روی یک کانتینر کلیک کنید تا لاگ‌های آن را ببینید

### بخش Volumes

- تب **Volumes** را انتخاب کنید
- حجم `postgres-data` را ببینید که داده‌های دیتابیس در آن ذخیره می‌شود

## حل مشکلات

### مشکل: `docker: command not found`

**دلیل:** Docker نصب نشده است

**حل:**
```bash
# دوباره Docker Desktop را نصب کنید
# یا از بالا دستورات نصب را دنبال کنید
docker --version
```

### مشکل: `port 5432 already in use`

**دلیل:** یک نمونه دیگر PostgreSQL روی پورت 5432 اجرا می‌شود

**حل:**
```bash
# متوقف کردن تمام Docker containers
docker compose down

# یا تغییر پورت در docker-compose.yml
# تغییر "5432:5432" به "5433:5432"
```

### مشکل: `permission denied while trying to connect to Docker daemon`

**دلیل:** کاربر دسترسی به Docker ندارد (Linux)

**حل:**
```bash
# اضافه کردن کاربر به گروه docker
sudo usermod -aG docker $USER
newgrp docker

# یا اجرای دستورات با sudo
sudo docker compose up --build
```

### مشکل: API بعد از شروع کانتینر crash می‌کند

**دلیل:** PostgreSQL هنوز آماده نیست

**حل:**
```bash
# چند ثانیه صبر کنید و دوباره اجرا کنید
docker compose down
docker compose up --build
```

## متغیرهای محیطی

### تنظیم `.env` برای Backend

در پوشه `backend` یک فایل `.env` ایجاد کنید:

```bash
cp backend/.env.example backend/.env
```

محتوای `backend/.env`:
```
PORT=4000
DATABASE_URL=postgres://postgres:postgres@postgres:5432/absence_tracker
```

## مراحل اولیه پس از اجرا

1. **بررسی‌کنید API کار می‌کند:**
   ```bash
   curl http://localhost:4000/health
   ```

2. **بررسی‌کنید دیتابیس متصل است:**
   ```bash
   # از ترمینال دیگر
   docker compose logs api
   # باید ببینید: "connected to database" یا خطا نباشد
   ```

3. **اپلیکیشن Expo را اجرا کنید:**
   ```bash
   cd app
   npx expo start --web --lan --clear
   ```

4. **دیتابیس را مشاهده کنید:**
   - از طریق DBeaver یا `psql` به `localhost:5432` متصل شوید
   - جدول `videos` را ببینید

## نکات مهم

- **حفظ داده‌ها:** حجم `postgres-data` تمام داده‌ها را در Docker Desktop محفوظ می‌کند
- **توقف سرویس‌ها:** بعد از کار با `docker compose stop` سرویس‌ها را متوقف کنید
- **حذف کانتینرها:** `docker compose down` تمام کانتینرها را حذف می‌کند (داده‌ها ماندگار می‌مانند)
- **دوباره ساخت:** تغییرات در `Dockerfile` یا `docker-compose.yml` نیاز به `--build` دارد

## منابع مفید

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)

# راهنمای کامل Docker و پایگاه‌داده 🐳

## 📋 مشکل فعلی

```
Error: DATABASE_URL is required
```

این خطا به این معنی است که سرور backend نتوانسته `DATABASE_URL` را پیدا کند.

---

## 🚀 راه‌حل (مرحله به مرحله)

### گام ۱: بررسی Docker نصب است

**برای Windows (PowerShell):**
```powershell
docker --version
docker-compose --version
```

**انتظار:**
```
Docker version 24.0.0 (یا نسخه‌های نتر)
Docker Compose version v2.20.0 (یا نسخه‌های نتر)
```

اگر خطا خورد، **Docker Desktop نصب کن**: https://www.docker.com/products/docker-desktop

---

### گام ۲: صحیح کردن فایل `.env`

**📍 جایگاه:** `/absence-tracker/.env` (ریشه پروژه)

**ایجاد یا ویرایش فایل:**
```bash
# فایل .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/absence_tracker
NODE_ENV=development
PORT=3001
```

**نکات مهم:**
- `postgres:postgres` = نام‌کاربری و رمز پیش‌فرض
- `localhost` = داخل Docker برای `db` استفاده کن: `db:5432`
- `absence_tracker` = نام دیتابیس

---

### گام ۳: بررسی `docker-compose.yml`

**📍 جایگاه:** `/absence-tracker/docker-compose.yml`

**مطمئن شو این بخش وجود دارد:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    container_name: absence_tracker_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: absence_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
    container_name: absence_tracker_backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/absence_tracker
      NODE_ENV: development
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - db
    volumes:
      - ./backend:/app

volumes:
  postgres_data:
```

---

### گام ۴: ایجاد و راه‌اندازی کانتینرها

**مرحله ۴.۱: پاک کردن کانتینرهای قدیمی**
```bash
cd /path/to/absence-tracker
docker-compose down --volumes
```

**انتظار:**
```
Removing containers...
Removing volumes...
```

**مرحله ۴.۲: ساخت و راه‌اندازی (Build)**
```bash
docker-compose up -d --build
```

**انتظار:**
```
[+] Building 45.3s
[+] Creating absence_tracker_db        ... done
[+] Creating absence_tracker_backend   ... done
```

---

### گام ۵: بررسی کانتینرها در حال اجرا هستند

**دستور بررسی:**
```bash
docker-compose ps
```

**انتظار (باید دیدی هردو running باشند):**
```
NAME                        STATUS
absence_tracker_db          Up 2 minutes
absence_tracker_backend     Up 1 minute
```

---

### گام ۶: اجرای Migration و Seed

**بررسی Database Migration:**
```bash
docker-compose exec backend npm run migrate
```

**یا دستی:**
```bash
docker-compose exec db psql -U postgres -d absence_tracker -f /app/database/001_init_schema.sql
docker-compose exec db psql -U postgres -d absence_tracker -f /app/database/002_seed_data.sql
```

---

### گام ۷: بررسی Backend درست راه‌اندازی شد

**دستور بررسی logs:**
```bash
docker-compose logs backend
```

**انتظار (اگر درست باشد):**
```
Backend listening on port 3001
Connected to database successfully
```

**اگر خطا داشت:**
```bash
docker-compose logs backend -f
```
(برای دیدن logs real-time)

---

### گام ۸: تست API

**در ترمینال یا Postman:**
```bash
curl http://localhost:3001/api/health
```

**انتظار:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## 🔧 حل مسائل رایج

### ❌ مشکل: "Database connection refused"

**راه‌حل:**
```bash
# منتظر بمان تا Database شروع شود
docker-compose logs db

# اگر Port 5432 مشغول بود
docker ps | grep 5432
docker kill <CONTAINER_ID>
```

---

### ❌ مشکل: "Port 3001 already in use"

**راه‌حل:**
```bash
# بریز کانتینر قدیمی
docker-compose down

# یا تغییر port در docker-compose.yml
# از "3001:3001" به "3002:3001"
```

---

### ❌ مشکل: Backend خاموش میشود فوراً

**تشخیص:**
```bash
docker-compose logs backend --tail=50
```

**معمول‌ترین دلایل:**
- `.env` وجود ندارد
- `DATABASE_URL` غلط است
- Database هنوز شروع نشده

---

## ✅ چک‌لیست نهایی

- [ ] Docker Desktop روی Windows نصب است
- [ ] `docker-compose.yml` وجود دارد و تنظیم شده است
- [ ] فایل `.env` در ریشه پروژه موجود است
- [ ] `DATABASE_URL=postgresql://postgres:postgres@db:5432/absence_tracker`
- [ ] هردو کانتینر `running` هستند
- [ ] پایگاه‌داده موجود است و Migration انجام شد
- [ ] API در `http://localhost:3001` پاسخ می‌دهد

---

## 📱 برای توسعه‌دهندگان

### اگر Backend رو local اجرا می‌کنی:

```bash
cd backend
# مطمئن شو .env فایل است
npm install
npm start
```

### اگر هر دو در Docker می‌خواهی:

```bash
cd /absence-tracker
docker-compose up -d
```

---

## 🧹 پاک کردن کامل

```bash
# متوقف کردن و حذف همه
docker-compose down --volumes --remove-orphans

# حذف تمام تصاویر
docker image prune -a

# شروع دوباره
docker-compose up -d --build
```

---

## 📞 اگر مشکل باقی مانده

**۱. فایل‌های log رو جمع‌آوری کن:**
```bash
docker-compose logs > logs.txt
```

**۲. بررسی کن:**
```bash
docker-compose config  # نمایش config نهایی
```

**۳. Backend config رو بررسی کن:**
```bash
docker-compose exec backend cat .env
```

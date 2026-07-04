# Troubleshooting Guide

## مشکلات Docker

### خطای "docker: command not found"
**حل:**
- دانلود Docker Desktop: https://www.docker.com/products/docker-desktop
- برای Linux: `sudo apt-get install docker.io docker-compose`

### خطای "Cannot connect to Docker daemon"
**حل:**
```bash
# Linux
sudo systemctl start docker
sudo usermod -aG docker $USER

# یا Docker Desktop را برای Windows/macOS باز کنید
```

### خطای "Port 5432 is already in use"
**حل:**
```bash
# یافتن process استفاده‌کننده‌ی port
lsof -i :5432

# حذف container قدیمی
docker compose down
docker ps -a  # دیدن تمام containers
docker rm <container_id>

# یا تغییر port در docker-compose.yml
# ports:
#   - '5433:5432'  # استفاده از port 5433 به جای 5432
```

### خطای Build ناموفق
**حل:**
```bash
# حذف cache و rebuild
docker compose build --no-cache

# مشاهده logs
docker compose logs api

# اگر خطا در npm install است:
# بررسی package.json syntax
# یا دانلود دوباره node_modules
```

---

## مشکلات Database

### خطای "database does not exist"
**حل:**
```bash
# Database خودکار ایجاد می‌شود با docker-compose
# اگر مشکل پیدا کردید:
docker compose down
docker compose up --build
```

### خطای "Connection refused"
**حل:**
```bash
# اطمینان حاصل کنید postgres container اجرا شده است
docker compose ps

# اگر postgres نیست:
docker compose up -d postgres

# انتظار برای شروع شدن
sleep 10

# بررسی logs
docker compose logs postgres
```

### خطای "FATAL: Ident authentication failed"
**حل:**
```bash
# PostgreSQL نیاز به صحیح credentials دارد
# بررسی docker-compose.yml:
# POSTGRES_USER: postgres
# POSTGRES_PASSWORD: postgres

# یا اتصال با psql
docker compose exec postgres psql -U postgres
```

---

## مشکلات API

### Health Check ناکام
**حل:**
```bash
# بررسی API اجرا شده است
curl http://localhost:4000/health

# اگر timeout شد
docker compose logs api

# اگر خطای TypeScript
npm run build
npm start
```

### خطای "Cannot find module"
**حل:**
```bash
# تثبیت dependencies
docker compose exec api npm install

# یا rebuild
docker compose build --no-cache api
```

### خطای JSON parsing
**حل:**
```bash
# بررسی Content-Type header
curl -H "Content-Type: application/json" http://localhost:4000/api/videos

# اگر Base64 خیلی بزرگ است، حد محدود کنید
# در index.ts: express.json({ limit: '50mb' })
```

---

## مشکلات Frontend

### Error: Cannot reach API
**حل:**
```bash
# اطمینان حاصل کنید API اجرا شده است
docker compose ps
curl http://localhost:4000/health

# بررسی EXPO_PUBLIC_API_URL
echo $EXPO_PUBLIC_API_URL

# یا در app/.env.local تنظیم کنید
EXPO_PUBLIC_API_URL=http://localhost:4000
```

### خطای Base64 خیلی بزرگ
**حل:**
```typescript
// فیلتر کردن قبل از ارسال
const maxSize = 20 * 1024 * 1024; // 20MB
if (base64String.length > maxSize) {
  throw new Error('Video too large');
}
```

### AsyncStorage خالی است
**حل:**
```bash
# پاک کردن AsyncStorage
adb shell 'rm -rf /data/data/com.project.name/databases/RKStorage'

# یا در simulator
xcrun simctl erase all
```

---

## مشکلات Networking

### API not reachable from Docker
**حل:**
```bash
# بررسی docker compose networking
docker compose exec api ping postgres

# اگر کار کند، postgres متصل است
# اگر نه، مشکل networking است

# حل: استفاده از service name
# DATABASE_URL=postgres://postgres:postgres@postgres:5432/absence_tracker
```

### Ports conflict
**حل:**
```bash
# یافتن services روی ports
netstat -an | grep LISTEN

# تغییر port در docker-compose.yml
# ports:
#   - '4001:4000'  # استفاده از external port 4001
#   - '5433:5432'  # استفاده از external port 5433
```

---

## مشکلات Development

### Changes نمی‌شوند reflect
**حل:**
```bash
# Hot reload سمت api کار نمی‌کند
# باید rebuild کنید
docker compose build api
docker compose restart api

# یا بدون Hot reload:
# استفاده از volume mount در docker-compose.yml
volumes:
  - ./backend:/usr/src/app
  - /usr/src/app/node_modules
```

### npm dependencies outdated
**حل:**
```bash
# Update کردن
docker compose exec api npm update

# یا rebuild از scratch
docker compose build --no-cache
```

### TypeScript compilation errors
**حل:**
```bash
# بررسی tsconfig.json
# اطمینان حاصل کنید outDir و rootDir درست تنظیم شده‌اند

# Manual build
docker compose exec api npm run build

# اگر خطا:
docker compose exec api npx tsc --noEmit
```

---

## مشکلات Performance

### Slow API response
**حل:**
```bash
# بررسی database indexes
docker compose exec postgres psql -U postgres -d absence_tracker -c "\d+ videos"

# اگر index نیست، ایجاد کنید
docker compose exec postgres psql -U postgres -d absence_tracker -c \
  "CREATE INDEX idx_videos_created_at ON videos(created_at DESC);"
```

### High memory usage
**حل:**
```bash
# بررسی memory
docker stats

# Base64 encoding خیلی بزرگ است
# استفاده از streaming یا chunking برای فایل‌های بزرگ
```

---

## System-specific Issues

### Windows + Docker Desktop
- PowerShell: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Docker Desktop settings: Enable WSL 2 backend

### macOS + Docker Desktop
- Intel vs Apple Silicon: استفاده از صحیح image برای architecture
- `docker run --rm -it --platform linux/x86_64 node:20`

### Linux + Docker
- Permissions: `sudo usermod -aG docker $USER` و logout/login
- systemd: `sudo systemctl start docker`

---

## اطلاعات کمکی

### Log Files
```bash
# تمام logs
docker compose logs

# فقط API
docker compose logs api -f

# فقط Database
docker compose logs postgres -f

# خروجی به فایل
docker compose logs > logs.txt
```

### Database Backup
```bash
# Backup
docker compose exec postgres pg_dump -U postgres absence_tracker > backup.sql

# Restore
docker compose exec -T postgres psql -U postgres absence_tracker < backup.sql
```

### Debug Mode
```bash
# ورود به container
docker compose exec api sh

# اجرای دستور
docker compose exec api npm run build

# اجرای interactive shell
docker compose exec postgres psql -U postgres
```

---

## اگر مشکل حل نشد

```bash
# تمام چیز را reset کنید
docker compose down -v
docker system prune -a
docker compose build --no-cache
docker compose up

# یا
make clean
make setup
```

و لطفاً logs را چک کنید:
```bash
docker compose logs api | tail -50
docker compose logs postgres | tail -50
```

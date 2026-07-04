# 🔧 حل مشکل `__dirname` و Docker Restart Loop

## مشکل
```
ReferenceError: __dirname is not defined
```

Docker container مدام restart می‌شود.

---

## ✅ اصلاحات انجام‌شده

### ۱. فایل `src/db.ts`
```diff
+ import { fileURLToPath } from 'url';
+ 
+ const __filename = fileURLToPath(import.meta.url);
+ const __dirname = path.dirname(__filename);
```

**دلیل:** `__dirname` فقط در CommonJS کار می‌کند. ESM (`"type": "module"`) باید خودش define شود.

---

### ۲. فایل `docker-compose.yml`

**قبل:**
```yaml
volumes:
  - ./backend:/usr/src/app  # ❌ تمام /usr/src/app override می‌شود
```

**بعد:**
```yaml
volumes:
  - ./backend/src:/usr/src/app/src      # ✅ فقط src
  - ./backend/database:/usr/src/app/database  # ✅ database مهم است!
  - /usr/src/app/node_modules
  - /usr/src/app/dist
```

**دلیل:** Database SQL files باید در container دسترسی‌پذیر باشند.

---

### ۳. حذف Version (اختیاری)
```diff
- version: '3.9'
  services:
```

**دلیل:** Compose v2+ نیاز به version ندارد و می‌تواند conflict ایجاد کند.

---

## 🚀 راه‌اندازی دوباره

### مرحله ۱: پاک کردن کانتینرهای قدیمی
```bash
docker compose down --volumes --remove-orphans
```

### مرحله ۲: Rebuild
```bash
docker compose up -d --build
```

### مرحله ۳: بررسی logs
```bash
docker compose logs api -f
```

**انتظار (لاگ های صحیح):**
```
✓ Database initialized successfully
✓ Database connection successful
✓ API server listening on http://localhost:4000
```

---

## 🔍 اگر هنوز مشکل است

### ۱. بررسی database file‌ها
```bash
ls -la /workspaces/absence-tracker/backend/database/
```

**باید دیده شود:**
```
001_init_schema.sql
002_seed_data.sql
```

### ۲. بررسی dist/db.js
```bash
docker compose exec api cat dist/db.js | head -20
```

**باید دیده شود:**
```javascript
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = ...
```

### ۳. Rebuild TypeScript
```bash
docker compose exec api npm run build
docker compose restart api
```

### ۴. بررسی environment
```bash
docker compose exec api env | grep DATABASE_URL
```

**باید دیده شود:**
```
DATABASE_URL=postgres://postgres:postgres@postgres:5432/absence_tracker
```

---

## 🛠️ اگر بازهم مشکل دارید

### خاموش کردن و نقطه صفر
```bash
# تمام چیز بند کنید
docker compose down -v

# تمام image‌ها حذف کنید
docker system prune -a

# دوباره build کنید
docker compose build --no-cache
docker compose up -d
```

### Logs تفصیلی
```bash
# تمام logs (از شروع)
docker compose logs api

# Logs live
docker compose logs api -f

# فقط errors
docker compose logs api | grep -i error
```

---

## ✨ نکات مهم

✅ **ESM (`"type": "module"`):** باید `fileURLToPath` + `import.meta.url` استفاده شود

✅ **Docker Volumes:** فایل‌های لازم برای runtime باید volume شوند

✅ **PATH Resolution:** relative paths از compiled files (dist) محاسبه می‌شوند

✅ **Database Init:** اول database initialize می‌شود، سپس server شروع می‌شود

---

## 📋 خلاصه تغییرات

| فایل | مشکل | راه‌حل |
|------|------|-------|
| `src/db.ts` | `__dirname` undefined | Add ESM compatibility |
| `docker-compose.yml` | Database files unreachable | Add database volume |
| `docker-compose.yml` | Version warning | Remove version line |

---

## ✅ چک‌لیست نهایی

- [ ] `src/db.ts` شامل ESM compatibility است
- [ ] `docker-compose.yml` database volume دارد
- [ ] `docker-compose build --no-cache` موفق شد
- [ ] Logs موفقیت را نشان می‌دهد
- [ ] `http://localhost:4000/health` پاسخ می‌دهد

🎉 **تمام!**

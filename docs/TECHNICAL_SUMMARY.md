# پروژه Absence Tracker - خلاصه فنی

## 📋 اجزای پروژه

### Frontend (React Native + Expo)
- **فریم‌ورک:** Expo 57.0.2, React 19.2.3, React Native 0.86.0
- **State Management:** Zustand 5.0.14 + AsyncStorage
- **Navigation:** React Navigation (Bottom Tabs)
- **تب‌ها:** Home, Journal, Reels, Library (جدید), Analytics

### Backend (Node.js + Express)
- **Framework:** Express.js 4.18.2
- **Database:** PostgreSQL 15-alpine
- **Orchestration:** Docker Compose 3.9
- **API Server:** Port 4000
- **Database:** Port 5432

### Database Schema
```
videos (id, title, file_name, template_id, duration, thumbnail_uri, content_base64, created_at, updated_at)
journal_entries (id, title, reflection, mood, weather, location, created_at, updated_at)
attachments (id, journal_entry_id, type, uri, mime_type, created_at)
tags (id, journal_entry_id, tag, created_at)
```

---

## 🎯 فایل‌های اصلی

### Frontend Files
| فایل | توضیح |
|------|--------|
| `app/src/screens/LibraryScreen.tsx` | نمایش ویدیوها در grid |
| `app/src/store/videoLibraryStore.ts` | State management برای ویدیو |
| `app/src/hooks/useVideoLibrary.ts` | Hook برای استفاده از store |
| `app/src/types/video.ts` | Type definitions |
| `app/src/screens/ReelStudioScreen.tsx` | محل export ویدیو |
| `app/src/navigation/AppNavigator.tsx` | تعریف tabs |

### Backend Files
| فایل | توضیح |
|------|--------|
| `backend/src/index.ts` | Entry point سرور |
| `backend/src/db.ts` | Database connection + initialization |
| `backend/src/routes/videos.ts` | Video API endpoints |
| `backend/src/routes/journal.ts` | Journal API endpoints |
| `backend/database/001_init_schema.sql` | Schema تعریف |
| `backend/database/002_seed_data.sql` | Sample data |
| `backend/Dockerfile` | Container image |
| `docker-compose.yml` | Multi-container orchestration |

---

## 🚀 راه‌اندازی سریع

```bash
# 1. نصب Docker Desktop
# https://www.docker.com/products/docker-desktop

# 2. راه‌اندازی
cd /workspaces/absence-tracker
make setup

# یا دستی:
docker compose up --build

# 3. Expo
cd app
npm install
npm start
```

**بررسی:**
```bash
curl http://localhost:4000/health
# {"status":"ok","database":"connected"}
```

---

## 📚 فایل‌های دستیار

| فایل | توضیح |
|------|--------|
| `QUICK_START.md` | راهنمای سریع |
| `INTEGRATION_GUIDE.md` | نحوه‌ی اتصال Frontend به API |
| `API_DOCS.md` | مستندات API endpoints |
| `DATABASE_SCHEMA.md` | توضیح جداول و schema |
| `TROUBLESHOOTING.md` | حل مشکلات متداول |
| `setup.sh` | اسکریپت راه‌اندازی خودکار |
| `Makefile` | دستورات متداول |

---

## 🔌 API Endpoints

### Video API
```
GET    /api/videos           - دریافت تمام ویدیوها
GET    /api/videos/:id       - دریافت یک ویدیو
POST   /api/videos           - ایجاد ویدیو جدید
PUT    /api/videos/:id       - به‌روزرسانی عنوان
DELETE /api/videos/:id       - حذف ویدیو
```

### Journal API
```
GET    /api/journal           - دریافت تمام یادآوری‌ها
GET    /api/journal/:id       - دریافت یک یادآوری
GET    /api/journal/mood/:mood - فیلتر بر اساس mood
POST   /api/journal           - ایجاد یادآوری جدید
PUT    /api/journal/:id       - به‌روزرسانی یادآوری
DELETE /api/journal/:id       - حذف یادآوری
```

### Health
```
GET    /health               - بررسی سلامت سرور و database
```

---

## 🔄 Data Flow

### Video Creation
```
ReelStudioScreen (export)
    ↓
FFmpeg (encode to MP4)
    ↓
Base64 encoding (FileReader API)
    ↓
API POST /api/videos
    ↓
PostgreSQL (videos table)
    ↓
LibraryScreen (display)
```

### Persistence
```
1. Immediate: AsyncStorage (local backup)
2. Server: PostgreSQL (source of truth)
3. Display: LibraryScreen (fetch from both)
```

---

## 🔒 Database Credentials

```
Username: postgres
Password: postgres
Database: absence_tracker
Host: localhost (or 'postgres' in Docker)
Port: 5432
```

⚠️ **نکته:** اینها برای توسعه است. برای Production باید تغییر شوند.

---

## 📱 اتصال Frontend به API

```typescript
// app/.env.local
EXPO_PUBLIC_API_URL=http://localhost:4000

// در کد:
const API_URL = process.env.EXPO_PUBLIC_API_URL;
fetch(`${API_URL}/api/videos`)
```

---

## 🛠️ دستورات متداول

```bash
# راه‌اندازی
docker compose up -d

# متوقف کردن
docker compose stop

# Logs
docker compose logs -f api
docker compose logs -f postgres

# Database shell
docker compose exec postgres psql -U postgres

# Rebuild
docker compose build --no-cache

# حذف کامل
docker compose down -v
```

---

## ✅ Checklist راه‌اندازی

- [ ] Docker Desktop نصب شده
- [ ] Git repository کلون شده
- [ ] `docker compose up --build` اجرا شده
- [ ] Health check موفق: `curl http://localhost:4000/health`
- [ ] API ویدیوها کار می‌کند: `curl http://localhost:4000/api/videos`
- [ ] Expo شروع شده: `npm start`
- [ ] Library tab نمایان است
- [ ] ویدیو دانلود می‌شود

---

## 🎓 بعدی

1. **Frontend API Integration:** ConnectVideoLibrary Hook to API
2. **Journal Routes:** Implement /api/journal endpoints
3. **Offline Support:** Sync strategy برای offline mode
4. **File Upload:** بجای Base64، استفاده از Multipart
5. **Authentication:** User login و authorization
6. **Real-time Sync:** WebSocket برای real-time updates

---

## 📞 مراجع

- [Expo Documentation](https://docs.expo.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Express.js Guide](https://expressjs.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)

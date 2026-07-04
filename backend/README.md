# Absence Tracker - Backend API

Node.js + Express.js + PostgreSQL REST API server برای پروژه Absence Tracker

## 📋 Overview

- **Framework:** Express.js 4.18.2
- **Database:** PostgreSQL 15
- **Language:** TypeScript 5.5.4
- **Runtime:** Node.js 20 (Alpine)

## 🚀 راه‌اندازی سریع

### Prerequisites
- Docker & Docker Compose
- یا Node.js 20+ و PostgreSQL 15+

### Development

```bash
# نصب dependencies
npm install

# ایجاد .env از نمونه
cp .env.example .env

# توسعه (با ts-node)
npm run dev
```

### Production

```bash
# ساخت
npm run build

# اجرا
npm start
```

### Docker

```bash
# از root directory
docker compose up --build

# API آماده است در http://localhost:4000
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts          # Express app entry point
│   ├── db.ts             # Database connection & initialization
│   ├── routes/
│   │   ├── videos.ts     # Video API endpoints
│   │   └── journal.ts    # Journal API endpoints
│   └── types/            # TypeScript type definitions
├── database/
│   ├── 001_init_schema.sql   # Database schema
│   └── 002_seed_data.sql     # Sample data
├── Dockerfile            # Container image
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── .env.example          # Environment variables template
```

## 🔌 API Endpoints

### Video API

- `GET /api/videos` - دریافت تمام ویدیوها
- `GET /api/videos/:id` - دریافت یک ویدیو
- `POST /api/videos` - ایجاد ویدیو جدید
- `PUT /api/videos/:id` - به‌روزرسانی ویدیو
- `DELETE /api/videos/:id` - حذف ویدیو

### Journal API

- `GET /api/journal` - دریافت تمام یادآوری‌ها
- `GET /api/journal/:id` - دریافت یک یادآوری
- `GET /api/journal/mood/:mood` - فیلتر بر اساس حالت روحی
- `POST /api/journal` - ایجاد یادآوری جدید
- `PUT /api/journal/:id` - به‌روزرسانی یادآوری
- `DELETE /api/journal/:id` - حذف یادآوری

### Health Check

- `GET /health` - بررسی وضعیت سرور و database

## 🗄️ Database Schema

### Tables

1. **videos**
   - id, title, file_name, template_id
   - duration, thumbnail_uri, content_base64
   - created_at, updated_at

2. **journal_entries**
   - id, title, reflection, mood
   - weather, location
   - created_at, updated_at

3. **attachments**
   - id, journal_entry_id (FK)
   - type (photo/audio), uri, mime_type
   - created_at

4. **tags**
   - id, journal_entry_id (FK)
   - tag
   - created_at

## 🔒 Environment Variables

```env
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/absence_tracker
```

## 🛠️ Scripts

```bash
# نصب dependencies
npm install

# ساخت TypeScript
npm run build

# اجرای production build
npm start

# اجرای توسعه
npm run dev
```

## 📖 Documentation

- [API Documentation](./API_DOCS.md) - API endpoints و examples
- [Database Schema](./DATABASE_SCHEMA.md) - Database structure
- [Integration Guide](../INTEGRATION_GUIDE.md) - Frontend integration

## 🔄 Database Initialization

Database schema خودکار در `docker compose up` اجرا می‌شود:

```bash
# Manually run schema
psql -U postgres -d absence_tracker -f database/001_init_schema.sql

# Seed with sample data
psql -U postgres -d absence_tracker -f database/002_seed_data.sql
```

## 📝 Base64 Encoding

تمام فایل‌های بزرگ (ویدیو، عکس) به صورت Base64 ذخیره می‌شوند:

```
data:video/mp4;base64,AAAAHGZ0eXBpc29tAA...
data:image/jpeg;base64,/9j/4AAQSkZJRg...
data:audio/mpeg;base64,//NExAAAAANI...
```

حد محدود: 20MB برای هر فایل

## 🧪 Testing

```bash
# Health check
curl http://localhost:4000/health

# دریافت تمام ویدیوها
curl http://localhost:4000/api/videos

# ایجاد ویدیو
curl -X POST http://localhost:4000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "fileName": "test.mp4",
    "templateId": "khatereh",
    "duration": 10,
    "thumbnailUri": "data:image/jpeg;base64,...",
    "contentBase64": "data:video/mp4;base64,..."
  }'
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# بررسی PostgreSQL
docker compose exec postgres psql -U postgres

# بررسی logs
docker compose logs postgres
```

### Port Already in Use
```bash
# Change port in docker-compose.yml
# یا پروسسی که از port استفاده می‌کند را متوقف کنید
lsof -i :4000
```

### Module Not Found
```bash
# Rebuild
docker compose build --no-cache api
npm install
```

## 📞 Support

برای مشاهده جزئیات بیشتر:
- [QUICK_START.md](../QUICK_START.md) - شروع سریع
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - حل مشکلات
- [TECHNICAL_SUMMARY.md](../TECHNICAL_SUMMARY.md) - خلاصه تکنیکی

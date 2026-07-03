# 📱 Absence Tracker - Application

یک اپلیکیشن موبایل فارسی برای ثبت یادآوری‌ها و ساخت ویدیوهای کوتاه.

## ✨ Features

- 📹 **ساخت ویدیو** - عکس‌ها و صدا را به ویدیو کوتاه تبدیل کنید
- 📔 **Journal** - یادآوری‌های روزانه با تصاویر و برچسب‌ها
- 🎬 **Library** - مدیریت تمام ویدیوهای ساخته شده
- 📊 **Analytics** - تحلیل احساسات و insights
- 🌙 **Dark Mode** - رابط کاربری تیره و راحت چشم
- 🎨 **Design System** - سیستم طراحی جامع و یکپارچه

---

## 🚀 شروع سریع

### Docker (آسان‌ترین راه)

```bash
# نصب Docker Desktop
# https://www.docker.com/products/docker-desktop

# اجرا کنید
docker compose up --build

# بررسی سلامت API
curl http://localhost:4000/health
```

### Manual Setup

```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend (Terminal جدید)
cd app
npm install
npm start
```

**تفصیلات:** [docs/QUICK_START.md](./docs/QUICK_START.md)

---

## 📁 ساختار پروژه

```
absence-tracker/
├── app/                      # 📱 Frontend (React Native + Expo)
│   ├── src/
│   │   ├── components/       # UI Components
│   │   ├── screens/          # App Screens
│   │   ├── store/            # State Management (Zustand)
│   │   ├── theme/            # Dark/Light Theme
│   │   └── types/            # TypeScript Definitions
│   └── package.json
│
├── backend/                  # 🔌 API Server (Express + PostgreSQL)
│   ├── src/
│   │   ├── routes/           # API Endpoints
│   │   ├── db.ts             # Database Connection
│   │   └── index.ts          # Express Server
│   ├── database/             # SQL Schema & Seeds
│   └── Dockerfile
│
├── docs/                     # 📚 Documentation
│   ├── QUICK_START.md        # Getting Started
│   ├── TECHNICAL_SUMMARY.md  # Technical Overview
│   ├── INTEGRATION_GUIDE.md  # Frontend-API Integration
│   ├── TROUBLESHOOTING.md    # Common Issues
│   ├── DESIGN_SYSTEM_FA.md   # Design System
│   └── ...
│
├── templates/                # 🎨 HTML Templates
├── archive/                  # 📦 Old Files
├── docker-compose.yml        # Docker Orchestration
├── .gitignore
├── README.md                 # This File
└── Makefile                  # Quick Commands
```

---

## 📚 Documentation

### شروع کردن
- **[docs/QUICK_START.md](./docs/QUICK_START.md)** - راهنمای 3 مرحله‌ای ⭐
- **[setup.sh](./setup.sh)** - اسکریپت خودکار

### توسعه و Integration
- **[docs/TECHNICAL_SUMMARY.md](./docs/TECHNICAL_SUMMARY.md)** - خلاصه تکنیکی
- **[docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md)** - Frontend-API
- **[backend/README.md](./backend/README.md)** - Backend API

### تنظیم و استقرار
- **[docs/DOCKER_SETUP.md](./docs/DOCKER_SETUP.md)** - Docker راهنما
- **[docs/FIXES_APPLIED.md](./docs/FIXES_APPLIED.md)** - اصلاحات اعمال شده

### مشکل‌گیری
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - حل مشکلات
- **[docs/STRUCTURE_AUDIT.md](./docs/STRUCTURE_AUDIT.md)** - Audit Report

### طراحی و UI
- **[docs/DESIGN_SYSTEM_FA.md](./docs/DESIGN_SYSTEM_FA.md)** - سیستم طراحی
- **[docs/COMPONENT_GUIDE_FA.md](./docs/COMPONENT_GUIDE_FA.md)** - راهنمای اجزاء

### Backend API
- **[backend/API_DOCS.md](./backend/API_DOCS.md)** - Endpoint Reference
- **[backend/DATABASE_SCHEMA.md](./backend/DATABASE_SCHEMA.md)** - DB Schema

---

## 🛠️ Tech Stack

### Frontend
| | |
|---|---|
| **Framework** | Expo 57.0.2 |
| **Language** | React Native 0.86.0 + TypeScript |
| **State** | Zustand 5.0.14 |
| **Navigation** | React Navigation |
| **Video** | FFmpeg (@ffmpeg/ffmpeg) |
| **Storage** | AsyncStorage 3.1.1 |

### Backend
| | |
|---|---|
| **Framework** | Express.js 4.18.2 |
| **Database** | PostgreSQL 15-alpine |
| **Language** | TypeScript 5.5.4 |
| **Runtime** | Node.js 20-alpine |
| **Orchestration** | Docker Compose 3.9 |

---

## 📊 API Endpoints

### Videos
```
GET    /api/videos           → دریافت تمام ویدیوها
GET    /api/videos/:id       → دریافت یک ویدیو
POST   /api/videos           → ایجاد ویدیو جدید
PUT    /api/videos/:id       → به‌روزرسانی
DELETE /api/videos/:id       → حذف ویدیو
```

### Journal
```
GET    /api/journal          → دریافت یادآوری‌ها
GET    /api/journal/:id      → یادآوری یک‌ای
POST   /api/journal          → ایجاد یادآوری
PUT    /api/journal/:id      → به‌روزرسانی
DELETE /api/journal/:id      → حذف
```

### Health
```
GET    /health               → بررسی سلامت API
```

**تفصیلات:** [backend/API_DOCS.md](./backend/API_DOCS.md)

---

## 🗄️ Database Schema

### Tables
- **videos** - ویدیوهای ساخته شده
- **journal_entries** - یادآوری‌های کاربر
- **attachments** - عکس‌ها و فایل‌های صوتی
- **tags** - برچسب‌های یادآوری

**تفصیلات:** [backend/DATABASE_SCHEMA.md](./backend/DATABASE_SCHEMA.md)

---

## 🎯 Quick Commands

```bash
# Setup (اسکریپت خودکار)
./setup.sh

# Docker
docker compose up --build
docker compose logs -f

# Backend
cd backend
npm run build
npm start

# Frontend
cd app
npm install
npm start

# Health Check
curl http://localhost:4000/health
```

**بیشتر:** [Makefile](./Makefile)

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=4000
DATABASE_URL=postgres://postgres:postgres@postgres:5432/absence_tracker
```

### Frontend (`app/.env.local`)
```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

---

## ✅ Verification Checklist

- [ ] Docker Desktop نصب شده
- [ ] `docker compose up --build` اجرا شده
- [ ] Health check: `curl http://localhost:4000/health`
- [ ] API پاسخ می‌دهد
- [ ] Database متصل است
- [ ] Frontend (Expo) شروع شده

---

## 📞 Support & Resources

### مستندات
- 📖 [تمام مستندات](./docs/)
- 🔧 [Backend API](./backend/README.md)
- 📱 [Frontend Setup](./app/README.md)

### مشکل‌گیری
- ❓ [FAQ & Troubleshooting](./docs/TROUBLESHOOTING.md)
- 🐛 [Audit Report](./docs/STRUCTURE_AUDIT.md)

### سیستم طراحی
- 🎨 [Design System](./docs/DESIGN_SYSTEM_FA.md)
- 💡 [Component Guide](./docs/COMPONENT_GUIDE_FA.md)

---

## 📝 فایل‌های اصلی

| فایل | توضیح |
|------|--------|
| `QUICK_START.md` | ⭐ شروع کنید |
| `setup.sh` | اسکریپت خودکار |
| `Makefile` | دستورات سریع |
| `docker-compose.yml` | Docker config |
| `docs/` | تمام راهنماها |

---

## 🎓 Learning Path

1. **شروع:** [docs/QUICK_START.md](./docs/QUICK_START.md)
2. **اجرا:** `docker compose up --build`
3. **API:** [backend/API_DOCS.md](./backend/API_DOCS.md)
4. **Integration:** [docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md)
5. **Design:** [docs/DESIGN_SYSTEM_FA.md](./docs/DESIGN_SYSTEM_FA.md)

---

## 🚀 Ready to Start?

```bash
# تک‌فرمان
docker compose up --build

# یا مرحله به مرحله
./setup.sh
```

**سپس:**
```bash
# بررسی کنید
curl http://localhost:4000/health

# و شروع کنید! 🎉
```

---

## 📄 License

This project is private and belongs to [shiriiranmehr-png](https://github.com/shiriiranmehr-png)

---

**Last Updated:** 3 July 2026  
**Status:** ✅ Ready for Development

# 📚 خلاصه راهنماهای نو

دو راهنمای کامل فارسی اضافه شده‌اند:

## 1️⃣ [Docker و Database Setup](DOCKER_DATABASE_SETUP_FA.md)

**مشکل:** `DATABASE_URL is required`

**حل کردن این مشکل:**

```bash
# مرحله ۱: بررسی Docker
docker --version
docker-compose --version

# مرحله ۲: ایجاد .env فایل
echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/absence_tracker" > .env

# مرحله ۳: شروع Docker
docker-compose down --volumes
docker-compose up -d --build

# مرحله ۴: بررسی status
docker-compose ps
```

**مدت زمان:** ۵-۱۰ دقیقه

---

## 2️⃣ [Video Export Troubleshooting](VIDEO_EXPORT_TROUBLESHOOTING_FA.md)

**مشکل:** دکمه "ساخت MP4" بدون نتیجه

**حل کردن این مشکل:**

```
۱. F12 رو بزن (Console رو باز کن)
۲. دکمه "ساخت MP4" رو دوباره بزن
۳. Logs رو بخون:
   ✅ = خوب
   ❌ = مشکل
   ⚠️ = هشدار
```

**مثالی از logs:**
```
🎬 شروع ساخت ویدیو...
🔍 جستجو برای FFmpeg...
✅ پیدا شد: /ffmpeg-core.js
🚀 بارگذاری FFmpeg...
✅ FFmpeg بارگذاری شد
🎨 ساخت Canvas...
⚙️ شروع FFmpeg...
✅ تکمیل شد!
🎉 موفق!
```

---

## 🔍 بهبود‌های اضافه شده

### در کد:
✅ Detailed logging در هر مرحله
✅ بهتر error messages
✅ FFmpeg path auto-detection
✅ Fallback mechanisms

### در Console:
✅ Emoji برای تشخیص سریع
✅ مسیر کامل logs
✅ Error stack traces

---

## 🎯 اگر مشکل دارید

**گام ۱:** کدام فایل راهنما نیاز است؟
- Backend/Database → [DOCKER_DATABASE_SETUP_FA.md](DOCKER_DATABASE_SETUP_FA.md)
- Video Export → [VIDEO_EXPORT_TROUBLESHOOTING_FA.md](VIDEO_EXPORT_TROUBLESHOOTING_FA.md)

**گام ۲:** دستورات داخل فایل رو تک‌تک اجرا کنید

**گام ۳:** Logs رو قبل/بعد هر دستور بررسی کنید

---

## 💡 نکات مهم

🔐 **Security:** 
- `.env` فایل رو commit نکنید
- `DATABASE_URL` رو secret نگه دار

🐳 **Docker:**
- تاثیر بر سرعت عملیات (۱۰-۲۰٪ کندتر)
- مدیریت بهتر environment

📹 **Video Export:**
- FFmpeg عمل بسیار سنگین است
- مرورگر ممکن است temporary unresponsive بشود
- صبر کنید تا تکمیل شود

---

## 📞 Next Steps

۱. یکی از راهنماها رو بخون
۲. دستورات رو اجرا کن
۳. نتیجه رو بررسی کن
۴. اگر مشکل بود، logs رو پست کن

Happy coding! 🚀

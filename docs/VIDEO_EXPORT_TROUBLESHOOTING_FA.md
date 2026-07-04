# 🔧 راهنمای حل‌مسائل ساخت ویدیو

## مشکل: بعد از زدن "ساخت MP4" هیچ اتفاقی نمیفته

---

## مرحله ۱: باز کردن Console برای دیدن Logs

### 🖥️ روی Web (Expo):

**۱. مرورگر رو باز کن (Chrome/Firefox)**
```
http://localhost:19006
```

**۲. دکمه F12 رو بزن یا:**
- **Chrome**: Ctrl+Shift+J (یا Cmd+Option+J برای Mac)
- **Firefox**: Ctrl+Shift+K (یا Cmd+Option+K برای Mac)

**۳. تب "Console" رو انتخاب کن**

**۴. دکمه "ساخت MP4" رو بزن**

**۵. در Console میبینی logs مثل:**
```
🎬 شروع ساخت ویدیو...
🔍 جستجو برای فایل‌های FFmpeg...
  ↳ بررسی: /public/ffmpeg-core.js
  ↳ بررسی: /ffmpeg-core.js
✅ پیدا شد: /ffmpeg-core.js
📦 مسیر پایه: /
```

---

## مشکل ۱: FFmpeg فایل‌ها پیدا نشدند

### علامت:
```
❌ خطا در ساخت ویدیو
مشکل: Failed to construct 'URL': Invalid base URL
```

**یا در Logs:**
```
❌ خطای شناسایی مسیر FFmpeg
```

### حل:

**۱. فایل‌ها وجود دارند؟**
```bash
cd /workspaces/absence-tracker/app/public
ls -la | grep ffmpeg
```

**انتظار:**
```
814.ffmpeg.js
ffmpeg-core.js
ffmpeg-core.wasm
ffmpeg.js
```

**اگر نیستند:**
```bash
npm install --save @ffmpeg/core @ffmpeg/ffmpeg
```

**۲. فایل‌ها درست جایی‌اند؟**
در مرورگر تست کن:
- `http://localhost:19006/public/ffmpeg-core.js` (باید 200 دهد)
- `http://localhost:19006/ffmpeg-core.js` (باید 200 دهد)

**۳. اگر بازهم کار نکرد:**
```bash
cd /workspaces/absence-tracker/app
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## مشکل ۲: عکس پیدا نشد

### علامت:
```
console میگه:
📷 بارگذاری عکس
❌ خطا: Failed to load image
```

### حل:

**۱. عکس انتخاب کردی؟**
- صفحه‌ی app رو بررسی کن
- دکمه "انتخاب عکس" یا "عکس با دوربین" رو بزن
- حداقل یک عکس باید نمایش داده بشه

**۲. عکس CORS مشکل دارد؟**
اگر عکس از گالری‌ای با مشکل CORS است:
```javascript
// این معمول در Expo تست نیست
// ولی اگر تست می‌کنی:
// عکس از یک موضع محلی یا مناسب استفاده کن
```

---

## مشکل ۳: FFmpeg Hang کند (معطل شود)

### علامت:
```
Console میگه:
⚙️ شروع FFmpeg...
📋 دستورات: [...]
(... بدون ✅ تکمیل)
```

### حل:

**۱. مرورگر تب رو بستند یا صفحه refresh کن**
```
Ctrl+R یا Cmd+R
```

**۲. FFmpeg memory بیشتر لازم دارد**
- اندازه‌ی ویدیو کو کنید (مثلا 15 ثانیه به جای 60)
- موسیقی رو حذف کنید

**۳. دوباره سعی کنید**
```
دوباره عکس انتخاب کنید → ساخت MP4
```

---

## مشکل ۴: موسیقی اضافه نشده

### علامت:
```
console میگه:
⚠️ خطا در اضافه کردن صوت (بدون صوت ادامه)
```

### توضیح:
- این طبیعی است!
- ویدیو **بدون صوت** ساخته میشه
- صوت اضافه کردن در Expo web محدود است

### حل:
- اگر صوت ضروری است، ویدیو رو بعداً در editing app اضافه کنید
- یا روی Native App (iOS/Android) تست کنید

---

## مشکل ۵: خطای Base64 Conversion

### علامت:
```
❌ خطا: Base64 conversion failed
```

### حل:

**۱. ویدیو بیشتر از حد بزرگ است**
```
⚙️ راه‌حل: مدت زمان رو کم کنید
15-30 ثانیه بهتر از 60 ثانیه
```

**۲. Blob corruption**
```bash
# نه دوباره
```

---

## ✅ چک‌لیست: اگر کار نکرد

- [ ] عکس انتخاب شده است؟
- [ ] دکمه "ساخت MP4" آبی/فعال است؟
- [ ] Console F12 باز است و logs دیده می‌شود؟
- [ ] FFmpeg فایل‌ها موجود هستند؟
- [ ] مرورگر refresh شد؟
- [ ] از مدت زمان کوتاه‌تر (15s) تست کردی؟

---

## 🚀 Logs مثالی (موفق)

```
🎬 شروع ساخت ویدیو...
🔍 جستجو برای فایل‌های FFmpeg...
  ↳ بررسی: /public/ffmpeg-core.js
✅ پیدا شد: ffmpeg-core.js
📦 مسیر پایه: /
✅ URL‌های FFmpeg آماده شدند
🚀 بارگذاری FFmpeg...
✅ FFmpeg بارگذاری شد
🎨 ساخت Canvas فریم...
🖼️ استفاده از Canvas renderشده
✅ فریم آماده شد
🎵 بررسی موسیقی...
⏭️ صوتی انتخاب نشده
⚙️ شروع FFmpeg...
✅ FFmpeg تکمیل شد
📤 خوانندن فایل خروجی
✅ ویدیو ساخته شد: 1234567 bytes
💾 تبدیل به Base64 و ذخیره
✅ ویدیو ذخیره شد
📥 شروع دانلود
🎉 موفق!
```

---

## 📱 اگر در Native App (iOS/Android) تست می‌کنی

```bash
# iOS
npx expo start --ios

# Android
npx expo start --android
```

**بهتریت؟**
- Native app معمول سریع‌تر و بهتر است
- صوت اضافه کردن بهتر کار می‌کند
- File download بهتر support شده است

---

## 🆘 هنوز کار نکرد؟

**۱. Logs تصویر برداری کن**
```bash
Ctrl+A (Select All in Console)
Ctrl+C (Copy)
```

**۲. مطمئن شو:**
- Node version: `node --version` (باید v18+)
- npm version: `npm --version` (باید v8+)

**۳. دوباره ساخت:**
```bash
cd /workspaces/absence-tracker/app
npm run build
npm start
```

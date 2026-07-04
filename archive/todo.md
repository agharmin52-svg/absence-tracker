# Todo — Absence Tracker | خارج شدن: شمارش زمان با احساس

## 1. هدف پروژه

این پروژه یک اپلیکیشن موبایل مدرن و احساسی است که زمان را نه فقط به‌صورت عددی، بلکه به‌صورت روایتی، احساسی و شخصی تجربه می‌کند. هدف این است که کاربر هر بار که اپ را باز می‌کند، احساس کند زمان از چند زاویه عبور کرده است: زمانی، احساسی، فصلی، نجومی و شخصی. در واقع یک دفترچه‌ی دیجیتالی شاعرانه برای خاطره‌های دشوار و لذت‌انگیز.

## 2. وضعیت فعلی (۳ تیرماه ۱۴۰۵)

### Frontend (React Native + Expo)
- [x] پایه‌ی پروژه با Expo + React Native + TypeScript راه‌اندازی شده است.
- [x] یک نسخه‌ی اولیه‌ی قابل اجرا از Home screen با تایمر زنده و تجربه‌ی بصری لوکس ساخته شده است.
- [x] Navigation با tab bar و header حرفه‌ای پیاده‌سازی شده است.
- [x] Journal screen به فرم واقعی و ذخیره‌ی محلی خاطره تبدیل شده است.
- [x] طراحی سیستم پایه با components reusable و theme روشن/تاریک در حال اجرا است.
- [x] Storage abstraction برای داده‌های محلی آماده شده است.
- [x] Metadata journal: weather، location و tags اضافه‌شده است.
- [x] Reel Studio Screen آماده است ولی بدون system ذخیره‌ی finalized reel ها.

### Backend (Express + PostgreSQL)
- [x] سرور Express ساخته شده است.
- [x] PostgreSQL به Docker متصل است.
- [x] مسیرهای API برای video و journal آماده است.
- [ ] تست و تصحیح API endpoints.

## 3. اولویت‌های اصلی (منطق کاری)

| اولویت | وظیفه | وضعیت |
|------|------|------|
| 🔴 خیلی بالا | تکمیل سیستم ذخیره ریلز HTML | ✅ تکمیل شد |
| 🔴 خیلی بالا | تشکیل ری‌فرکتور برای Home Screen | ✅ تکمیل شد |
| 🟠 بالا | تکمیل Library و Analytics Screens | ✅ تکمیل شد |
| 🟠 بالا | تست فرانت‌اند و بک‌اند یکپارچه | آماده‌سازی |
| 🟡 متوسط | امنیت و encrypted storage | برنامه‌ریزی |
| 🟡 متوسط | Offline-first sync | طراحی |


## 4. برنامه‌ی اجرایی و Progress (DETAILED)

### فاز A — تثبیت پایه و معماری ✅ تکمیل شده

- [x] بررسی و نهایی‌کردن معماری پروژه
- [x] انتخاب ابزارهای داده و ذخیره‌سازی (Zustand + AsyncStorage)
- [x] تعریف ساختار پوشه‌ها و کامپوننت‌ها (src/screens, src/components, src/store)
- [x] تعریف system design برای theme، spacing، typography و motion
- [x] ایجاد base services برای زمان، تاریخ و تنظیمات کاربر
- [x] تعریف قرارداد داده برای entities اصلی (JournalEntry, VideoAsset)
- **تاریخ تکمیل:** ۲۱ خرداد

### فاز B — طراحی سیستم و تجربه کاربری ✅ ۹۵% تکمیل شده

- [x] تکمیل طراحی سیستم (color palette، typography، motion، spacing)
- [x] ایجاد components قابل استفاده مجدد (Card, SectionHeader, MetricTile, EmptyState, Chip, Button, Input, Modal, ScreenContainer)
- [x] اضافه‌کردن حالت‌های empty و content-based layout
- [x] طراحی نسخه‌ی dark mode و ساختار آماده برای light mode
- [ ] تنظیم accessibility (a11y) و reduced motion (۲ ساعت)
- **پیشرفت:** Dark mode نهایی شده، Light mode آماده است

### فاز C — پیاده‌سازی هسته‌ی محصول ✅ ۷۵% تکمیل شده

### فاز C — پیاده‌سازی هسته‌ی محصول ✅ **۹۰% تکمیل شده**

**Home Screen:**
- [x] ساخت صفحه‌ی Home با تایمر اصلی
- [x] اضافه‌کردن Time Perspectives cards
- [x] پیاده‌سازی Without… counters
- [x] ساخت بخش What Happened While Away
- [x] ساخت Seasonal Timeline
- [x] افزودن Monthly Progress (۱ ساعت) ✅ 
- [x] اضافه‌کردن Last Memory Card (۱ ساعت) ✅
- [x] پیاده‌سازی Emotional Statistics (۲ ساعت) ✅
- [ ] پیاده‌سازی Astronomical Statistics (۲ ساعت)

**Analytics Screen:**
- [x] نمایش آمار کلی (۳۰ دقیقه)
- [x] نمودار فعالیت روزانه - Activity Chart (۱ ساعت)
- [x] تگ‌های محبوب - Tag Cloud (۴۵ دقیقه)
- [x] آمار سریع - Quick Stats (Streak, Weekly, Max, Avg) (۱ ساعت)
- [x] توزیع حالات روحی

**Status:** Home و Analytics Screens کاملاً بهبود‌یافتند

### فاز D — ژورنال و حافظه ✅ ۸۰% تکمیل شده

- [x] ساخت Memory Journal Screen
- [x] افزودن امکان ثبت متن، mood و reflection
- [x] افزودن weather، location و tags
- [x] اجازه‌ی افزودن عکس و voice note
- [ ] نمایش ورودی‌ها روی تایم‌لاین (۲ ساعت)
- [ ] اتصال هر ورودی به روز خاص (۱ ساعت)
- [ ] پیاده‌سازی جست‌وجوی حافظه‌ها (۱.۵ ساعت)

**Status:** فرم‌گیری و ذخیره‌سازی کامل است، نیاز به timeline view

### فاز E — ریلز و Visual Storytelling ✅ **تکمیل شده**

- [x] Reel Studio Screen ساخته شده است
- [x] ۷ Template برای ریلز‌ها (khatereh, daftarcheh, ghamgin, masire-tanhaei, neon-ember, neon-rain, neon-drift)
- [x] Canvas-based frame generation برای ریلز
- [x] **سیستم ذخیره ریلز HTML template** (۲ ساعت) ✅
- [x] نمایش ریلز‌ها در Library (۱ ساعت) ✅
- [x] اشتراک‌گذاری ریلز‌ها (۲ ساعت) ✅

**Status:** فاز E کاملاً تکمیل شده است

### فاز F — داده‌های شخصی و زمان 🟠 **برنامه‌ریزی شده**

- [ ] ساخت Last Memory Dashboard (۳ ساعت)
- [ ] اضافه‌کردن Last Meeting / Last Call / Last Message / Last Voice Note (۲ ساعت)
- [ ] ساخت Location Memory با نقشه (۴ ساعت)
- [ ] پیاده‌سازی Countdown Features (۲ ساعت)
- [ ] افکت‌های milestone و unlock animation (۳ ساعت)
- [ ] ساخت Daily Reflection generator (۲ ساعت)

### فاز G — امنیت و ذخیره‌سازی 🟠 **برنامه‌ریزی شده**

- [x] اضافه‌کردن ذخیره‌سازی محلی و پایدار (AsyncStorage)
- [ ] پیاده‌سازی encrypted storage برای اطلاعات حساس (۲.۵ ساعت)
- [ ] اضافه‌کردن Face ID / Fingerprint / Passcode (۳ ساعت)
- [ ] ساخت Secure Memory Vault (۲ ساعت)
- [ ] طراحی حالت offline-first (۲ ساعت)
- [ ] پیاده‌سازی backup و restore (۲ ساعت)

### فاز H — همگام‌سازی و ابری 🟠 **برنامه‌ریزی شده**

- [ ] انتخاب سرویس ابری (Firebase یا Supabase) (۱ ساعت)
- [ ] پیاده‌سازی authentication (۳ ساعت)
- [ ] همگام‌سازی داده‌ها بین دستگاه‌ها (۴ ساعت)
- [ ] مدیریت conflicts و نسخه‌گذاری داده (۲ ساعت)
- [ ] پشتیبانی از sync در حالت آفلاین (۲.۵ ساعت)

### فاز I — تست و کیفیت 🟡 **برنامه‌ریزی شده**

- [ ] نوشتن unit tests برای منطق زمان و محاسبات (۳ ساعت)
- [ ] نوشتن integration tests برای flows اصلی (۳ ساعت)
- [ ] تست روی Android و iOS (۲ ساعت)
- [ ] تست accessibility (۱.۵ ساعت)
- [ ] تست عملکرد و روانی UI (۲ ساعت)
- [ ] تست روی حالت‌های مختلف شبکه و داده (۲ ساعت)

### فاز J — انتشار و بهبود مداوم 🔮 **آینده**

- [ ] آماده‌سازی نسخه‌ی اولیه برای تست اولیه (۲ ساعت)
- [ ] جمع‌آوری بازخورد کاربران (مداوم)
- [ ] تحلیل رفتار و نرخ استفاده (مداوم)
- [ ] انتشار نسخه‌ی beta
- [ ] برنامه‌ریزی برای نسخه‌ی 1.0


## 5. جزئیات فنی فعلی

### Frontend Stack
- **Framework:** React Native 0.86.0
- **Meta:** Expo 57.0.2 + TypeScript 6.0.3
- **State Management:** Zustand 5.0.14 (with AsyncStorage persistence)
- **Navigation:** React Navigation 7.3.6 (bottom tabs + native stack)
- **UI/Graphics:** Expo Vector Icons, Linear Gradient, FFmpeg.js
- **Storage:** AsyncStorage 3.1.1 (JSON serialization)
- **Media:** expo-image-picker, expo-av (audio recording)

### Backend Stack (آماده، تست‌نشده)
- **Framework:** Express.js 4.18.2
- **Language:** TypeScript 5.5.4
- **Database:** PostgreSQL 15-alpine (Docker)
- **Runtime:** Node.js 20-alpine
- **Orchestration:** Docker Compose 3.9

### Data Models (Schema)

#### Journal Entry
```typescript
{
  id: string (timestamp)
  title: string
  reflection: string
  mood: 'آرام' | 'خوشحال' | 'غمگین' | 'نگران' | 'خسته' | 'انرژی‌دار'
  weather?: string (optional)
  location?: string (optional)
  tags?: string[] (comma-separated, normalized)
  attachments?: {
    id: string
    type: 'photo' | 'audio'
    uri: string
    createdAt: ISO string
  }[]
  createdAt: ISO string
  updatedAt: ISO string
}
```

#### Video/Reel Asset (TODO: بروزرسانی)
```typescript
{
  id: string
  title: string
  description?: string
  templateId: string ('khatereh' | 'daftarcheh' | 'ghamgin' | 'masire-tanhaei' | ...)
  htmlContent: string (full HTML template)
  photos: { id: string; uri: string }[]
  duration: number (seconds)
  createdAt: ISO string
  updatedAt: ISO string
  exportedAt?: ISO string (when finalized)
  shareUrl?: string (for sharing)
}
```

---

## 6. شناخت مسائل و نقاط حساس

### مسائل فعلی ✅ حل شده یا مدیریت‌شده

1. ✅ Journal metadata اضافه شده است
2. ✅ Tags normalization پیاده‌سازی شد
3. ✅ Optional fields (weather, location) آماده است

### نقاط حساس در راه پیش رو 🔴

1. **Reel HTML Storage** — فعلاً ریلز‌ها بصورت base64 canvas ذخیره می‌شوند، نیاز به HTML template system
2. **Memory Timeline View** — نیاز به date-based filtering و scroll-based UI
3. **Accessibility** — dark/light mode منتقل شده، اما reduced motion و ARIA labels باقی‌اند
4. **Backend Integration** — API endpoints تعریف شده اما تست‌نشده‌اند
5. **Offline Sync** — فعلاً AsyncStorage است، نیاز به queue-based sync

---

## 7. تصمیمات معماری مهم

| تصمیم | دلیل | وضعیت |
|-------|------|------|
| Zustand + AsyncStorage | سبک، بدون نیاز به Redux | ✅ کار کرد |
| JSON-based storage | سادگی، بدون نیاز به SQLite | ✅ کافی است برای MVP |
| Canvas-based reel rendering | نتیجه‌ی دقیق و قابل‌کنترل | ✅ موثر است |
| HTML template زیرساخت | قابل‌انتقال و قابل‌انتشار | ⏳ نیاز دارد |
| Expo (نه bare React Native) | توسعه‌ی سریع، managed بدون EAS | ✅ مناسب MVPاست |

---

## 8. بیشترین Blocking Issues و راه‌حل

### Issue #1: Reel Storage Architecture 🔴 **فوری**
**مسئله:** ریلز‌ها فقط در‌ canvas موجودند، نه در‌ HTML persistent
**راه‌حل:** 
- HTML template generator (template variables + data)
- Store HTML string in AsyncStorage
- Preview + share functionality

**برآورد زمان:** ۲ ساعت

### Issue #2: Memory Timeline Performance 🟠 **فاز بعدی**
**مسئله:** لیست ورودی‌ها بدون date grouping است
**راه‌حل:**
- Implement useMemo for date-based grouping
- Virtual scrolling برای performance
- Animated transitions

**برآورد زمان:** ۲.۵ ساعت

### Issue #3: Backend Sync 🟠 **بعد از MVP**
**مسئله:** اپ تنها محلی است، بدون sync
**راه‌حل:**
- Queue-based sync system
- Conflict resolution
- Background sync

**برآورد زمان:** ۴ ساعت (فاز later)

---

## 9. معیارهای موفقیت برای MVP

- ✅ کاربر می‌تواند یادآوری ثبت کند و آن را مشاهده کند
- ✅ کاربر می‌تواند اصلاح یا حذف کند
- ⏳ کاربر می‌تواند ریلز HTML تولید و ذخیره کند
- ⏳ کاربر می‌تواند library ریلز را مشاهده کند
- ⏳ تجربه‌ی UI بدون lag است
- ⏳ داده‌های محلی در‌ حالت آفلاین کار می‌کنند

---

## 10. کارهای بعدی (Next Priorities)

### فوری (این هفته) 🔴
1. **Reel HTML Storage System** — ۲ ساعت
   - Create reel HTML generator
   - Store in videoLibraryStore
   - Add preview & export

2. **Journal Timeline View** — ۲ ساعت
   - Date-based grouping
   - Scroll-to-date functionality

### Upcoming (هفته‌ی بعد) 🟠
3. **Library Screen** — نمایش تمام ریلز‌ها
4. **Analytics Screen** — نمایش statistics
5. **Settings Screen** — تنظیمات کاربری

### Later (ماه بعد) 🟡
6. **Backend API integration** — sync journal و video به server
7. **Authentication** — login / register
8. **Offline sync queue** — background sync


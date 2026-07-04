# توضیحات SQL و ساختار دیتابیس

## جداول پایگاه‌داده

### 1. جدول `videos`
ذخیره‌ی ویدیوهای ساخته‌شده توسط کاربران

```sql
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,              -- عنوان ویدیو
  file_name VARCHAR(255) NOT NULL,          -- نام فایل
  template_id VARCHAR(100) NOT NULL,        -- شناسه قالب استفاده‌شده
  duration INTEGER NOT NULL,                -- مدت زمان به ثانیه
  thumbnail_uri TEXT NOT NULL,              -- آدرس عکس بندانگشتی
  content_base64 LONGTEXT NOT NULL,         -- محتوای ویدیو به Base64
  created_at TIMESTAMP WITH TIME ZONE,      -- زمان ایجاد
  updated_at TIMESTAMP WITH TIME ZONE       -- زمان آپدیت
);
```

### 2. جدول `journal_entries`
ذخیره‌ی یادآوری‌های کاربران

```sql
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,              -- عنوان یادآوری
  reflection TEXT NOT NULL,                 -- متن بازتاب
  mood VARCHAR(50) NOT NULL,                -- حالت روحی
  weather VARCHAR(100),                     -- وضعیت هوا
  location VARCHAR(255),                    -- مکان
  created_at TIMESTAMP WITH TIME ZONE,      -- زمان ایجاد
  updated_at TIMESTAMP WITH TIME ZONE       -- زمان آپدیت
);
```

### 3. جدول `attachments`
ذخیره‌ی پیوست‌های عکس و صوت یادآوری‌ها

```sql
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  journal_entry_id INTEGER NOT NULL,        -- شناسه یادآوری
  type VARCHAR(50) NOT NULL,                -- نوع (photo یا audio)
  uri TEXT NOT NULL,                        -- آدرس فایل
  mime_type VARCHAR(100),                   -- نوع MIME
  created_at TIMESTAMP WITH TIME ZONE,      -- زمان ایجاد
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE
);
```

### 4. جدول `tags`
ذخیره‌ی برچسب‌های یادآوری‌ها

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  journal_entry_id INTEGER NOT NULL,        -- شناسه یادآوری
  tag VARCHAR(100) NOT NULL,                -- متن برچسب
  created_at TIMESTAMP WITH TIME ZONE,      -- زمان ایجاد
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE
);
```

## فایل‌های مهاجرت و Seed

### `backend/database/001_init_schema.sql`
- فایل ایجاد جداول اولیه
- ایجاد indexes برای بهبود کارایی
- استفاده می‌شود هنگام شروع Docker

### `backend/database/002_seed_data.sql`
- داده‌های نمونه برای توسعه
- شامل ویدیوها، یادآوری‌ها، پیوست‌ها و برچسب‌ها

## Indexes

ایجاد شده برای بهبود کارایی جستجو:

```sql
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_mood ON journal_entries(mood);
CREATE INDEX idx_attachments_journal_id ON attachments(journal_entry_id);
CREATE INDEX idx_tags_journal_id ON tags(journal_entry_id);
```

## نکات مهم

1. **Timestamps**: تمام جداول دارای `created_at` و `updated_at` هستند
2. **Cascade Delete**: پیوست‌ها و برچسب‌ها با حذف یادآوری حذف می‌شوند
3. **Base64 Storage**: ویدیو به صورت Base64 ذخیره می‌شود برای ذخیره‌سازی کامل
4. **Persian Text**: تمام متن‌ها می‌توانند فارسی باشند (UTF-8)

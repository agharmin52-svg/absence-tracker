# API Documentation

## Video Endpoints

### GET `/api/videos`
دریافت تمام ویدیوها

**Response:**
```json
[
  {
    "id": 1,
    "title": "ویدیو من",
    "fileName": "video_20240101_120000.mp4",
    "templateId": "khatereh",
    "duration": 15,
    "thumbnailUri": "data:image/jpeg;base64,...",
    "createdAt": "2024-01-01T12:00:00+00:00"
  }
]
```

### GET `/api/videos/:id`
دریافت یک ویدیو خاص

**Response:**
```json
{
  "id": 1,
  "title": "ویدیو من",
  "fileName": "video_20240101_120000.mp4",
  "templateId": "khatereh",
  "duration": 15,
  "thumbnailUri": "data:image/jpeg;base64,...",
  "contentBase64": "data:video/mp4;base64,...",
  "createdAt": "2024-01-01T12:00:00+00:00"
}
```

### POST `/api/videos`
ایجاد ویدیو جدید

**Request:**
```json
{
  "title": "ویدیو من",
  "fileName": "video_20240101_120000.mp4",
  "templateId": "khatereh",
  "duration": 15,
  "thumbnailUri": "data:image/jpeg;base64,...",
  "contentBase64": "data:video/mp4;base64,..."
}
```

**Response:**
```json
{
  "id": 1,
  "title": "ویدیو من",
  "fileName": "video_20240101_120000.mp4",
  "templateId": "khatereh",
  "duration": 15,
  "thumbnailUri": "data:image/jpeg;base64,...",
  "createdAt": "2024-01-01T12:00:00+00:00"
}
```

### PUT `/api/videos/:id`
به‌روزرسانی عنوان ویدیو

**Request:**
```json
{
  "title": "عنوان جدید"
}
```

### DELETE `/api/videos/:id`
حذف ویدیو

---

## Journal Endpoints

### GET `/api/journal`
دریافت تمام یادآوری‌ها

**Response:**
```json
[
  {
    "id": 1,
    "title": "روز خوبی",
    "reflection": "امروز بسیار خوب گذشت",
    "mood": "خوشحال",
    "weather": "آفتابی",
    "location": "تهران",
    "createdAt": "2024-01-01T12:00:00+00:00",
    "updatedAt": "2024-01-01T12:00:00+00:00",
    "attachments": [
      {
        "id": 1,
        "type": "photo",
        "uri": "data:image/jpeg;base64,...",
        "mimeType": "image/jpeg"
      }
    ],
    "tags": ["خوشبختی", "موفقیت"]
  }
]
```

### GET `/api/journal/:id`
دریافت یک یادآوری خاص

### POST `/api/journal`
ایجاد یادآوری جدید

**Request:**
```json
{
  "title": "روز خوبی",
  "reflection": "امروز بسیار خوب گذشت",
  "mood": "خوشحال",
  "weather": "آفتابی",
  "location": "تهران",
  "attachments": [
    {
      "type": "photo",
      "uri": "data:image/jpeg;base64,...",
      "mimeType": "image/jpeg"
    }
  ],
  "tags": ["خوشبختی", "موفقیت"]
}
```

### PUT `/api/journal/:id`
به‌روزرسانی یادآوری

**Request:**
```json
{
  "title": "عنوان جدید",
  "reflection": "تأمل جدید",
  "mood": "آرام"
}
```

### DELETE `/api/journal/:id`
حذف یادآوری

### GET `/api/journal/mood/:mood`
فیلتر یادآوری‌ها بر اساس حالت روحی

---

## Health Check

### GET `/health`

**Response:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found
```json
{
  "error": "Video not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Unable to fetch videos"
}
```

---

## Base64 Encoding

تمام فایل‌های بزرگ (عکس و ویدیو) به صورت Base64 ذخیره می‌شوند:

```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
data:video/mp4;base64,AAAAHGZ0eXBpc29tAA...
data:audio/mpeg;base64,//NExAAAAANI...
```

# Integration Guide - Frontend to Backend API

## تنظیم اولیه

### 1. Environment Variables

ایجاد فایل `app/.env.local`:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

برای Production:
```env
EXPO_PUBLIC_API_URL=https://api.your-domain.com
```

### 2. API Service Layer

ایجاد فایل `app/src/services/api.ts`:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = {
  async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
```

## Video Management Integration

### مثال 1: ذخیره ویدیو پس از Export

تغییر در `app/src/screens/ReelStudioScreen.tsx`:

```typescript
import { apiClient } from '../services/api';
import { useVideoLibrary } from '../hooks/useVideoLibrary';

// در تابع exportVideo:
const toBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

async function handleExportVideo(blob: Blob) {
  try {
    const base64 = await toBase64(blob);
    
    // ذخیره به API
    const response = await apiClient.post('/api/videos', {
      title: formatDate(new Date()),
      fileName: `video_${Date.now()}.mp4`,
      templateId: selectedTemplate,
      duration: Math.round(duration),
      thumbnailUri: thumbnailUri,
      contentBase64: base64,
    });

    // ذخیره به AsyncStorage برای backup
    addVideo({
      id: response.id.toString(),
      title: response.title,
      fileName: response.fileName,
      createdAt: new Date(response.createdAt),
      duration: response.duration,
      thumbnailUri: response.thumbnailUri,
      contentBase64: base64,
      templateId: selectedTemplate,
    });

    console.log('✓ Video saved successfully');
  } catch (error) {
    console.error('Error saving video:', error);
    // Fallback به AsyncStorage فقط
    addVideo({...});
  }
}
```

### مثال 2: دریافت ویدیوها از API

تغییر در `app/src/hooks/useVideoLibrary.ts`:

```typescript
import { apiClient } from '../services/api';

const API_ENABLED = true; // تغییر به true برای استفاده از API

export const useVideoLibrary = () => {
  const [videos, setVideos] = useState<VideoAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      if (API_ENABLED) {
        const apiVideos = await apiClient.get('/api/videos');
        setVideos(apiVideos);
      } else {
        // AsyncStorage fallback
        const stored = await AsyncStorage.getItem('videos');
        setVideos(stored ? JSON.parse(stored) : []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVideo = async (video: VideoAsset) => {
    try {
      if (API_ENABLED) {
        const response = await apiClient.post('/api/videos', video);
        setVideos([response, ...videos]);
      } else {
        setVideos([video, ...videos]);
      }
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  };

  const removeVideo = async (id: string) => {
    try {
      if (API_ENABLED) {
        await apiClient.delete(`/api/videos/${id}`);
      }
      setVideos(videos.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error removing video:', error);
      throw error;
    }
  };

  return { videos, addVideo, removeVideo, isLoading };
};
```

## Journal Integration

### مثال 3: ایجاد یادآوری با Attachments

```typescript
import { apiClient } from '../services/api';

const createJournalEntry = async (entry: {
  title: string;
  reflection: string;
  mood: string;
  attachments?: Array<{type: 'photo' | 'audio', uri: string}>;
  tags?: string[];
}) => {
  try {
    const response = await apiClient.post('/api/journal', {
      ...entry,
      attachments: entry.attachments?.map(a => ({
        ...a,
        mimeType: a.type === 'photo' ? 'image/jpeg' : 'audio/mpeg',
      })),
    });

    return response;
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};
```

### مثال 4: Sync State Store

ایجاد `app/src/store/syncStore.ts`:

```typescript
import { create } from 'zustand';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: string | null;
  syncData: () => Promise<void>;
  clearError: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  lastSyncTime: null,
  error: null,

  syncData: async () => {
    set({ isSyncing: true, error: null });
    try {
      // Sync videos
      // Sync journal entries
      // etc.
      set({ lastSyncTime: new Date() });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isSyncing: false });
    }
  },

  clearError: () => set({ error: null }),
}));
```

## Error Handling

```typescript
export const handleApiError = (error: any) => {
  if (error instanceof TypeError) {
    return 'Network connection error';
  }

  if (error.message.includes('404')) {
    return 'Item not found';
  }

  if (error.message.includes('500')) {
    return 'Server error';
  }

  return error.message || 'Unknown error';
};
```

## Testing API Connection

```bash
# بررسی اتصال
curl http://localhost:4000/health

# دریافت تمام ویدیوها
curl http://localhost:4000/api/videos | jq

# ایجاد ویدیو نمونه
curl -X POST http://localhost:4000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Video",
    "fileName": "test.mp4",
    "templateId": "khatereh",
    "duration": 10,
    "thumbnailUri": "data:image/jpeg;base64,...",
    "contentBase64": "data:video/mp4;base64,..."
  }'
```

## نکات مهم

1. **Base64 Encoding**: فایل‌های بزرگ (ویدیو، عکس) تبدیل به Base64 شوند
2. **Error Handling**: همیشه try/catch برای API calls استفاده کنید
3. **AsyncStorage Fallback**: برای offline support
4. **Sync Timing**: Sync کردن در background و بر اساس network status
5. **Rate Limiting**: محدود کردن تعداد requests برای جلوگیری از overload

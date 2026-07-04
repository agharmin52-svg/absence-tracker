import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoAsset, ReelTemplate } from '../types/video';

type VideoLibraryStore = {
  videos: VideoAsset[];
  isLoading: boolean;
  error: string | null;
  
  addVideo: (video: Omit<VideoAsset, 'createdAt' | 'updatedAt' | 'id'>) => Promise<void>;
  updateVideo: (id: string, updates: Partial<VideoAsset>) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  getVideoById: (id: string) => VideoAsset | undefined;
  getVideosByTemplate: (templateId: ReelTemplate) => VideoAsset[];
  
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useVideoLibraryStore = create<VideoLibraryStore>()(
  persist(
    (set, get) => ({
      videos: [],
      isLoading: false,
      error: null,

      addVideo: async (video) => {
        try {
          set({ isLoading: true, error: null });
          const now = new Date().toISOString();
          const newVideo: VideoAsset = {
            ...video,
            id: `reel-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
          };

          set((state) => ({
            videos: [newVideo, ...state.videos],
            isLoading: false,
          }));
        } catch (err) {
          set({
            error: 'خطا در اضافه کردن ریلز',
            isLoading: false,
          });
        }
      },

      updateVideo: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const now = new Date().toISOString();

          set((state) => ({
            videos: state.videos.map((video) =>
              video.id === id
                ? { ...video, ...updates, updatedAt: now }
                : video
            ),
            isLoading: false,
          }));
        } catch (err) {
          set({
            error: 'خطا در بروزرسانی ریلز',
            isLoading: false,
          });
        }
      },

      removeVideo: async (id) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            videos: state.videos.filter((video) => video.id !== id),
            isLoading: false,
          }));
        } catch (err) {
          set({
            error: 'خطا در حذف ریلز',
            isLoading: false,
          });
        }
      },

      getVideoById: (id) => {
        return get().videos.find((video) => video.id === id);
      },

      getVideosByTemplate: (templateId) => {
        return get().videos.filter((video) => video.templateId === templateId);
      },

      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'video-library-store',
      storage: {
        getItem: async (name: string) => {
          try {
            const item = await AsyncStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch (error) {
            console.error('خطا در خواندن از AsyncStorage:', error);
            return null;
          }
        },
        setItem: async (name: string, value: any) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('خطا در نوشتن به AsyncStorage:', error);
          }
        },
        removeItem: async (name: string) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('خطا در حذف از AsyncStorage:', error);
          }
        },
      },
      partialize: (state) => ({
        videos: state.videos,
      }),
    }
  )
);


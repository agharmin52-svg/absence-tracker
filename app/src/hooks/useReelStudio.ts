import { useCallback } from 'react';
import { useVideoLibrary } from './useVideoLibrary';
import { createReelHTML, ReelPhoto } from '../utils/reelStorage';
import { ReelTemplate } from '../types/video';
import * as Sharing from 'expo-sharing';

export function useReelStudio() {
  const { addVideo, updateVideo, removeVideo, videos } = useVideoLibrary();

  /**
   * ذخیره‌سازی ریلز جدید
   */
  const saveReel = useCallback(
    async (
      templateId: ReelTemplate,
      title: string,
      quote: string,
      caption: string,
      startDate: Date,
      photos: ReelPhoto[],
      mood?: string,
      duration: number = 30
    ) => {
      try {
        const htmlContent = await createReelHTML(
          templateId,
          title,
          quote,
          caption,
          startDate,
          mood,
          photos[0]?.uri
        );

        await addVideo({
          title,
          description: caption,
          fileName: `reel-${templateId}-${Date.now()}.html`,
          duration,
          templateId,
          htmlContent,
          photoUris: photos.map((p) => p.uri),
          exportedAt: new Date().toISOString(),
        });

        return true;
      } catch (error) {
        console.error('خطا در ذخیره‌سازی ریلز:', error);
        return false;
      }
    },
    [addVideo]
  );

  /**
   * اشتراک‌گذاری ریلز
   */
  const shareReel = useCallback(
    async (videoId: string) => {
      try {
        const video = videos.find((v) => v.id === videoId);
        if (!video || !video.htmlContent) {
          throw new Error('ریلز یافت نشد');
        }

        // در اپ native، می‌توانید از expo-sharing استفاده کنید
        // یا قابلیت‌های native share کنید
        await Sharing.shareAsync(`data:text/html;charset=utf-8,${encodeURIComponent(video.htmlContent)}`, {
          mimeType: 'text/html',
          UTI: 'public.html',
          filename: video.fileName,
        });

        return true;
      } catch (error) {
        console.error('خطا در اشتراک‌گذاری ریلز:', error);
        return false;
      }
    },
    [videos]
  );

  /**
   * حذف ریلز
   */
  const deleteReel = useCallback(
    async (videoId: string) => {
      try {
        await removeVideo(videoId);
        return true;
      } catch (error) {
        console.error('خطا در حذف ریلز:', error);
        return false;
      }
    },
    [removeVideo]
  );

  return {
    saveReel,
    shareReel,
    deleteReel,
    reels: videos,
  };
}

import * as ImagePicker from 'expo-image-picker';
import { ReelData, ReelTemplate, generateReelHTML, calculateDaysDifference, formatPersianDate } from './reelGenerator';

export type ReelPhoto = {
  id: string;
  uri: string;
};

/**
 * تبدیل عکس به data URI برای HTML embed کردن
 * فعلاً یا از URI استفاده می‌کنیم یا base64
 */
export async function photoToDataURI(uri: string): Promise<string | null> {
  try {
    // در React Native، عکس‌های local توسط Image component ارجاع داده می‌شوند
    // برای HTML embed، باید base64 شوند
    // اگر مستقیم URI استفاده شود، تنها در native environment کار می‌کند
    
    // برای اکنون، استفاده از اریجینال URI
    return uri;
  } catch (error) {
    console.error('خطا در تبدیل عکس:', error);
    return null;
  }
}

/**
 * ساخت ریلز HTML از داده‌های کاربر
 */
export async function createReelHTML(
  templateId: ReelTemplate,
  title: string,
  quote: string,
  caption: string,
  startDate: Date,
  mood?: string,
  photoUri?: string
): Promise<string> {
  const timeDiff = calculateDaysDifference(startDate);
  
  const reelData: ReelData = {
    templateId,
    title,
    quote,
    caption,
    days: timeDiff.days % 30,
    months: timeDiff.months,
    hours: timeDiff.hours,
    minutes: timeDiff.minutes,
    seconds: timeDiff.seconds,
    mood: mood || templateId,
    photoDataUri: photoUri, // می‌توانید base64 کنید اگر لازم باشد
  };

  return generateReelHTML(reelData);
}

/**
 * دریافت preview عکس برای نمایش در UI
 */
export function getPhotoPreviewUri(uri: string): string {
  return uri; // در Native، URI مستقیم استفاده می‌شود
}

/**
 * اندازه‌ی تقریبی فایل HTML
 */
export function estimateHTMLSize(html: string): number {
  return new Blob([html]).size;
}

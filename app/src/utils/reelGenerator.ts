/**
 * Reel HTML Template Generator
 * تولید فایل‌های HTML قالب برای ریلز‌های emotional storytelling
 */

export type ReelTemplate = 'khatereh' | 'daftarcheh' | 'ghamgin' | 'masire-tanhaei' | 'neon-ember' | 'neon-rain' | 'neon-drift';

export type ReelData = {
  templateId: ReelTemplate;
  title: string;
  quote: string;
  caption: string;
  days: number;
  months?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  photoDataUri?: string; // base64 image
  mood?: string;
  customText?: string;
  backgroundColor?: string;
  accentColor?: string;
};

const TEMPLATE_STYLES: Record<ReelTemplate, { colors: [string, string]; accent: string; overlay: string }> = {
  khatereh: { colors: ['#1b1613', '#2a2320'], accent: '#cf9c73', overlay: 'rgba(16, 12, 10, 0.34)' },
  daftarcheh: { colors: ['#ece4d3', '#e2d8c2'], accent: '#4a5a6b', overlay: 'rgba(255, 245, 230, 0.28)' },
  ghamgin: { colors: ['#0a0e17', '#121826'], accent: '#7ea3c9', overlay: 'rgba(4, 7, 13, 0.48)' },
  'masire-tanhaei': { colors: ['#12181a', '#232c2b'], accent: '#9ec2b0', overlay: 'rgba(5, 8, 9, 0.38)' },
  'neon-ember': { colors: ['#08060b', '#180b17'], accent: '#ff5f7a', overlay: 'rgba(8, 6, 11, 0.72)' },
  'neon-rain': { colors: ['#040913', '#0c1424'], accent: '#48d8ff', overlay: 'rgba(4, 9, 19, 0.74)' },
  'neon-drift': { colors: ['#06090d', '#111827'], accent: '#9b7cff', overlay: 'rgba(6, 9, 13, 0.76)' },
};

function formatPersianNumber(num: number): string {
  return String(num).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

function generateTemplateHTML(data: ReelData): string {
  const style = TEMPLATE_STYLES[data.templateId];
  const photoImg = data.photoDataUri ? `<img src="${data.photoDataUri}" alt="photo" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:280px;height:280px;border-radius:12px;object-fit:cover;opacity:0.9;">` : '';

  let html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${data.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&family=EB+Garamond:ital@0;1&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-1: ${style.colors[0]};
    --bg-2: ${style.colors[1]};
    --accent: ${style.accent};
    --overlay: ${style.overlay};
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background: linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Vazirmatn', sans-serif;
    padding: 24px;
  }
  
  .phone {
    position: relative;
    width: 360px;
    height: 720px;
    border-radius: 34px;
    overflow: hidden;
    background: linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%);
    box-shadow: 0 0 0 8px #000, 0 30px 80px rgba(0,0,0,0.7);
  }
  
  .content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 26px 28px;
  }
  
  .title {
    font-size: 11px;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    margin-bottom: 12px;
    font-family: 'EB Garamond', serif;
  }
  
  .quote {
    font-family: 'EB Garamond', serif;
    font-style: italic;
    font-size: 19px;
    line-height: 1.9;
    color: rgba(255,255,255,0.9);
    text-align: center;
    max-width: 280px;
    margin-bottom: 16px;
  }
  
  .quote span {
    color: var(--accent);
  }
  
  .timer {
    display: flex;
    gap: 6px;
    margin: 20px 0;
  }
  
  .unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  
  .box {
    width: 40px;
    height: 48px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255,255,255,0.9);
  }
  
  .label {
    font-size: 9px;
    color: rgba(255,255,255,0.5);
  }
  
  .caption {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    text-align: center;
    margin-top: 20px;
    line-height: 1.6;
  }
  
  .brand {
    margin-top: 24px;
    font-size: 9px;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1px;
  }
</style>
</head>
<body>

<div class="phone">
  <div class="content">
    <div class="title">${data.mood || data.templateId}</div>
    <div class="quote">${data.quote}</div>
    
    <div class="timer">
      ${data.months ? `<div class="unit"><div class="box">${formatPersianNumber(data.months)}</div><div class="label">ماه</div></div>` : ''}
      ${data.days ? `<div class="unit"><div class="box">${formatPersianNumber(data.days)}</div><div class="label">روز</div></div>` : ''}
      ${data.hours ? `<div class="unit"><div class="box">${formatPersianNumber(data.hours)}</div><div class="label">ساعت</div></div>` : ''}
      ${data.minutes ? `<div class="unit"><div class="box">${formatPersianNumber(data.minutes)}</div><div class="label">دقیقه</div></div>` : ''}
      ${data.seconds ? `<div class="unit"><div class="box">${formatPersianNumber(data.seconds)}</div><div class="label">ثانیه</div></div>` : ''}
    </div>
    
    <div class="caption">${data.caption}</div>
    <div class="brand">Absence Tracker • ${data.title}</div>
  </div>
</div>

</body>
</html>`;

  return html;
}

export function generateReelHTML(data: ReelData): string {
  return generateTemplateHTML(data);
}

/**
 * تولید تاریخ فارسی
 */
export function formatPersianDate(date: Date): string {
  return date.toLocaleString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * محاسبه‌ی تفاوت روزها
 */
export function calculateDaysDifference(startDate: Date, endDate: Date = new Date()): { days: number; months?: number; hours?: number; minutes?: number; seconds?: number } {
  const diff = endDate.getTime() - startDate.getTime();
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  return { days, months, hours, minutes, seconds };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateReelHTML, calculateDaysDifference, formatPersianDate, ReelData } from '../src/utils/reelGenerator';

test('generateReelHTML produces valid HTML for ghamgin template', () => {
  const data: ReelData = {
    templateId: 'ghamgin',
    title: 'تست ریلز',
    quote: 'این یک تست است',
    caption: 'تست ریلز دریافت',
    days: 23,
    months: 7,
    hours: 14,
    minutes: 42,
    seconds: 9,
    mood: 'غمگین',
  };

  const html = generateReelHTML(data);
  assert(html.includes('<!DOCTYPE html>'), 'HTML باید شامل DOCTYPE باشد');
  assert(html.includes('تست ریلز'), 'HTML باید عنوان را داشته باشد');
  assert(html.includes('۲۳'), 'HTML باید روز‌های فارسی را داشته باشد');
  assert(html.includes('Absence Tracker'), 'HTML باید branding را داشته باشد');
});

test('calculateDaysDifference returns correct time difference', () => {
  const pastDate = new Date('2024-12-15T10:00:00Z');
  const futureDate = new Date('2025-01-06T10:00:00Z');

  const diff = calculateDaysDifference(pastDate, futureDate);
  assert(diff.days === 22, 'فاصله‌ی روز‌ها باید 22 باشد');
  assert(diff.months === 0, 'ماه‌ها باید 0 باشد');
});

test('formatPersianDate returns correctly formatted Persian date', () => {
  const date = new Date('2025-01-06T14:30:00Z');
  const formatted = formatPersianDate(date);
  assert(formatted.includes('۱۴'), 'تاریخ باید فارسی باشد');
});

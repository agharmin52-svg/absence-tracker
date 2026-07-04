import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { colors, radius, spacing, typography } from '../../theme';
import { JournalEntry } from '../../types/journal';

interface TagCloudProps {
  entries: JournalEntry[];
}

export function TagCloud({ entries }: TagCloudProps) {
  // شمارش و ترتیب تگ‌ها
  const tagCounts: Record<string, number> = {};
  
  entries.forEach(entry => {
    if (entry.tags) {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12); // نمایش ۱۲ تگ برتر

  if (sortedTags.length === 0) {
    return null;
  }

  const maxCount = Math.max(...sortedTags.map(([, count]) => count), 1);

  // تعیین اندازه بر اساس فراوانی
  const getSizeIndex = (count: number): number => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return 3; // بزرگ
    if (ratio > 0.4) return 2; // متوسط
    if (ratio > 0.2) return 1; // کوچک
    return 0; // خیلی کوچک
  };

  const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg'];

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="تگ‌های محبوب"
        hint="کلمات‌کلیدی اصلی شما"
      />
      <View style={styles.cloud}>
        {sortedTags.map(([tag, count]) => {
          const sizeIndex = getSizeIndex(count);
          const fontSize = [11, 12, 14, 16][sizeIndex];
          const opacity = 0.6 + (sizeIndex * 0.13);
          
          return (
            <View
              key={tag}
              style={[
                styles.tag,
                { opacity },
              ]}
            >
              <Text style={[styles.tagText, { fontSize }]}>
                {tag}
              </Text>
              <Text style={[styles.tagCount, { fontSize: fontSize - 2 }]}>
                {count}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  cloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.lg,
    backgroundColor: colors.accent + '1a',
    alignItems: 'center',
  },
  tagText: {
    color: colors.accent,
    fontWeight: '600',
  },
  tagCount: {
    color: colors.textSecondary,
    marginTop: 2,
  },
});

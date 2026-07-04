import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { colors, spacing, typography } from '../../theme';
import { JournalEntry } from '../../types/journal';

interface MonthlyProgressSectionProps {
  entries: JournalEntry[];
}

export function MonthlyProgressSection({ entries }: MonthlyProgressSectionProps) {
  // محاسبه ورودی‌های هر هفته‌ی ماه جاری
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // ایجاد آرایه‌ای از ۴-۵ هفته
  const weeks = [];
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  let weekStart = new Date(firstDay);
  let weekNum = 0;

  while (weekStart <= lastDay && weekNum < 5) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    weeks.push({
      week: weekNum + 1,
      count: weekEntries.length,
      startDate: weekStart,
      endDate: Math.min(weekEnd, lastDay),
    });

    weekStart.setDate(weekStart.getDate() + 7);
    weekNum++;
  }

  const maxCount = Math.max(...weeks.map((w) => w.count), 1);

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="پیشرفت ماه جاری"
        hint="توزیع ورودی‌های شما در طول ماه"
      />
      <View style={styles.container}>
        {weeks.map((week) => {
          const percentage = (week.count / maxCount) * 100;
          return (
            <View key={week.week} style={styles.weekItem}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekLabel}>هفته {week.week}</Text>
                <Text style={styles.weekCount}>{week.count}</Text>
              </View>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${percentage}%` },
                    percentage > 0 && styles.barFilled,
                  ]}
                />
              </View>
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
  container: {
    gap: spacing.md,
  },
  weekItem: {
    gap: spacing.xs,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '500',
  },
  weekCount: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '700',
  },
  barContainer: {
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  barFilled: {
    backgroundColor: colors.accent,
  },
});

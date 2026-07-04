import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { colors, spacing, typography } from '../../theme';
import { JournalEntry } from '../../types/journal';

interface ActivityChartProps {
  entries: JournalEntry[];
}

export function ActivityChart({ entries }: ActivityChartProps) {
  // محاسبه فعالیت روزانه برای ۱۰ روز اخیر
  const last10Days: { date: Date; count: number }[] = [];
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const count = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === date.getTime();
    }).length;
    
    last10Days.push({ date, count });
  }

  const maxCount = Math.max(...last10Days.map(d => d.count), 1);

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="فعالیت اخیر"
        hint="تعداد ورودی‌ها در ۱۰ روز اخیر"
      />
      <View style={styles.chartContainer}>
        {last10Days.map((day, idx) => {
          const percentage = (day.count / maxCount) * 100;
          const dayName = day.date.toLocaleDateString('fa-IR', { weekday: 'short' });
          
          return (
            <View key={idx} style={styles.column}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(percentage, 5)}%`,
                      backgroundColor: day.count > 0 ? colors.accent : 'rgba(255,255,255,0.1)',
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{dayName}</Text>
              {day.count > 0 && (
                <Text style={styles.dayCount}>{day.count}</Text>
              )}
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
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginTop: spacing.md,
  },
  column: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  barWrapper: {
    width: 24,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 2,
  },
  dayLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  dayCount: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
});

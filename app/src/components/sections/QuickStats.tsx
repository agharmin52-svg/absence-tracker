import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, radius, spacing, typography } from '../../theme';
import { JournalEntry } from '../../types/journal';

interface QuickStatsProps {
  entries: JournalEntry[];
}

export function QuickStats({ entries }: QuickStatsProps) {
  const now = new Date();
  
  // Streak (روزهای متوالی)
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    const hasEntryOnDate = entries.some(entry => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === checkDate.getTime();
    });
    
    if (hasEntryOnDate) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  // میانگین ورودی‌ها در هفته
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= weekStart;
  }).length;

  // بیشترین ورودی در یک روز
  const dailyCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const dateKey = new Date(entry.createdAt).toLocaleDateString('fa-IR');
    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
  });
  
  const maxDaily = Math.max(...Object.values(dailyCounts), 0);

  // میانگین کلی
  const totalEntries = entries.length;
  const daysSinceFirst = entries.length > 0 
    ? Math.ceil((now.getTime() - new Date(entries[entries.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const avgPerDay = daysSinceFirst > 0 ? (totalEntries / daysSinceFirst).toFixed(1) : '0';

  return (
    <View style={styles.grid}>
      <Card style={styles.stat}>
        <View style={styles.statHeader}>
          <Ionicons name="flame" size={20} color={colors.warning} />
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statSubtext}>روز متوالی</Text>
      </Card>

      <Card style={styles.stat}>
        <View style={styles.statHeader}>
          <Ionicons name="bar-chart" size={20} color={colors.accent} />
          <Text style={styles.statLabel}>هفتگی</Text>
        </View>
        <Text style={styles.statValue}>{weekEntries}</Text>
        <Text style={styles.statSubtext}>ورودی این هفته</Text>
      </Card>

      <Card style={styles.stat}>
        <View style={styles.statHeader}>
          <Ionicons name="trending-up" size={20} color={colors.success} />
          <Text style={styles.statLabel}>بیشینه</Text>
        </View>
        <Text style={styles.statValue}>{maxDaily}</Text>
        <Text style={styles.statSubtext}>بیش‌ترین در یک روز</Text>
      </Card>

      <Card style={styles.stat}>
        <View style={styles.statHeader}>
          <Ionicons name="calculator" size={20} color={colors.info} />
          <Text style={styles.statLabel}>میانگین</Text>
        </View>
        <Text style={styles.statValue}>{avgPerDay}</Text>
        <Text style={styles.statSubtext}>به ازای هر روز</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stat: {
    width: '48%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statSubtext: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '400',
  },
});

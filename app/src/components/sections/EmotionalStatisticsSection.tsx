import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { colors, spacing, typography } from '../../theme';
import { MoodType } from '../../types/journal';

interface EmotionalStatisticsSectionProps {
  moodStats: Record<MoodType, number>;
}

const MOOD_COLORS: Record<string, string> = {
  آرام: '#5a6c7d',
  خوشحال: '#ffd700',
  غمگین: '#8b6b7a',
  نگران: '#ff9999',
  خسته: '#a0a0a0',
  'انرژی دار': '#ff6b6b',
};

const MOOD_EMOJIS: Record<string, string> = {
  آرام: '😌',
  خوشحال: '😊',
  غمگین: '😢',
  نگران: '😰',
  خسته: '😴',
  'انرژی دار': '⚡',
};

export function EmotionalStatisticsSection({
  moodStats,
}: EmotionalStatisticsSectionProps) {
  const totalMoods = Object.values(moodStats).reduce((a, b) => a + b, 0);

  if (totalMoods === 0) {
    return null;
  }

  const sortedMoods = Object.entries(moodStats)
    .filter(([, count]) => count > 0)
    .sort(([, countA], [, countB]) => countB - countA);

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="تحلیل احساسی"
        hint="توزیع حالات روحی شما"
      />
      <View style={styles.container}>
        {sortedMoods.map(([mood, count]) => {
          const percentage = (count / totalMoods) * 100;
          return (
            <View key={mood} style={styles.moodItem}>
              <View style={styles.moodInfo}>
                <Text style={styles.moodEmoji}>{MOOD_EMOJIS[mood]}</Text>
                <Text style={styles.moodLabel}>{mood}</Text>
              </View>
              <View style={styles.moodStats}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${percentage}%`, backgroundColor: MOOD_COLORS[mood] },
                    ]}
                  />
                </View>
                <Text style={styles.moodCount}>
                  {count} ({percentage.toFixed(0)}%)
                </Text>
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
  moodItem: {
    gap: spacing.sm,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodLabel: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  moodStats: {
    gap: spacing.xs,
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  moodCount: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
});

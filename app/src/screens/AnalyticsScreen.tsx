import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { Card } from '../components/ui/Card';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { colors, spacing, typography } from '../theme';
import { useMemoryStats, useMoodStats, useMemories } from '../hooks/useMemory';
import { MoodType } from '../types/journal';
import { ActivityChart } from '../components/sections/ActivityChart';
import { TagCloud } from '../components/sections/TagCloud';
import { QuickStats } from '../components/sections/QuickStats';

const MOOD_DISPLAY_ORDER: MoodType[] = ['خوشحال', 'آرام', 'انرژی دار', 'نگران', 'خسته', 'غمگین'];

export function AnalyticsScreen() {
  const { entries } = useMemories();
  const stats = useMemoryStats();
  const moodStats = useMoodStats();

  const getMoodColor = (mood: MoodType): string => {
    switch (mood) {
      case 'آرام':
        return colors.accent;
      case 'خوشحال':
        return colors.success || '#10b981';
      case 'غمگین':
        return colors.error || '#ef4444';
      case 'نگران':
        return colors.warning || '#f59e0b';
      case 'خسته':
        return colors.info || '#06b6d4';
      case 'انرژی دار':
        return colors.success || '#10b981';
      default:
        return colors.textTertiary;
    }
  };

  const totalEntries = stats?.totalEntries ?? 0;
  const lastEntry = stats?.lastEntry;
  const entriesThisMonth = stats?.entriesThisMonth ?? 0;
  const entriesThisWeek = stats?.entriesThisWeek ?? 0;

  const getMostCommonMood = (): { mood: MoodType; count: number } | null => {
    if (!moodStats || Object.keys(moodStats).length === 0) return null;
    const entries = Object.entries(moodStats) as [MoodType, number][];
    if (entries.length === 0) return null;
    const [mood, count] = entries.reduce((max, current) =>
      current[1] > max[1] ? current : max
    );
    return { mood, count };
  };

  const mostCommonMood = getMostCommonMood();

  return (
    <ScreenContainer style={styles.screen}>
      <AppHeader title="آمارها و بصیرت" subtitle="الگوهای احساسی طی زمان مرئی می‌شوند." />

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* آمار سریع */}
        <View style={styles.quickStatsContainer}>
          <QuickStats entries={entries} />
        </View>

        {/* آمار کلی */}
        {totalEntries > 0 && (
          <>
            <SectionHeader title="آمار کلی" hint="خلاصه‌ای از یادآوری‌های شما" />
            <View style={styles.metricsGrid}>
              <Card style={styles.metricCard}>
                <Text style={styles.metricValue}>{totalEntries}</Text>
                <Text style={styles.metricLabel}>کل یادآوری‌ها</Text>
              </Card>

              <Card style={styles.metricCard}>
                <Text style={styles.metricValue}>{entriesThisMonth}</Text>
                <Text style={styles.metricLabel}>این ماه</Text>
              </Card>

              <Card style={styles.metricCard}>
                <Text style={styles.metricValue}>{entriesThisWeek}</Text>
                <Text style={styles.metricLabel}>این هفته</Text>
              </Card>
            </View>
          </>
        )}

        {/* نمودار فعالیت */}
        {totalEntries > 0 && <ActivityChart entries={entries} />}

        {/* توزیع حالات روحی */}
        {totalEntries > 0 && (
          <>
            <SectionHeader title="توزیع حالات روحی" hint="شمار دفعات هر حالت" />
            <Card style={styles.card}>
              {MOOD_DISPLAY_ORDER.map((mood) => {
                const count = moodStats[mood] ?? 0;
                const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;

                return (
                  <View key={mood} style={styles.moodRow}>
                    <View style={styles.moodLabel}>
                      <Text style={styles.moodName}>{mood}</Text>
                      <Text style={styles.moodCount}>{count}</Text>
                    </View>
                    <View style={[styles.moodBar, { backgroundColor: getMoodColor(mood) }]}>
                      <View
                        style={[
                          styles.moodBarFill,
                          {
                            width: `${percentage}%`,
                            backgroundColor: getMoodColor(mood),
                            opacity: 0.8,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.moodPercent}>{Math.round(percentage)}%</Text>
                  </View>
                );
              })}
            </Card>
          </>
        )}

        {/* تگ‌های محبوب */}
        {totalEntries > 0 && <TagCloud entries={entries} />}

        {/* حالت روحی محبوب */}
        {mostCommonMood && (
          <>
            <SectionHeader title="حالت روحی محبوب" hint={`بیشترین‌بار ثبت‌شده`} />
            <Card
              style={[
                styles.card,
                {
                  borderLeftWidth: 4,
                  borderLeftColor: getMoodColor(mostCommonMood.mood),
                },
              ]}
            >
              <Text style={styles.cardLabel}>حالت روحی:</Text>
              <Text style={[styles.cardValue, { color: getMoodColor(mostCommonMood.mood) }]}>
                {mostCommonMood.mood}
              </Text>
              <Text style={styles.cardLabel}>تعداد:</Text>
              <Text style={styles.cardValue}>{mostCommonMood.count} بار</Text>
            </Card>
          </>
        )}

        {/* پیغام خالی */}
        {totalEntries === 0 && (
          <Card style={styles.card}>
            <Text style={styles.emptyTitle}>هنوز داده‌ای نیست</Text>
            <Text style={styles.emptyBody}>
              وقتی یادآوری‌های بیشتری اضافه کنید، آمار و بصیرت‌های قابل توجهی اینجا نمایش خواهند یافت.
            </Text>
          </Card>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0 },

  list: { flex: 1 },
  listContent: { paddingBottom: spacing.xl },

  quickStatsContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Card
  card: { marginTop: spacing.md, marginBottom: spacing.md },

  // Mood Row
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  moodLabel: {
    width: 80,
    justifyContent: 'center',
  },
  moodName: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  moodCount: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  moodBar: {
    flex: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  moodBarFill: {
    height: '100%',
  },
  moodPercent: {
    width: 40,
    textAlign: 'right',
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Card Content
  cardLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  // Empty State
  emptyTitle: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/ui/AppHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { colors, radius, spacing, typography } from '../theme';
import { useVideoLibrary } from '../hooks/useVideoLibrary';
import { useReelStudio } from '../hooks/useReelStudio';
import { ReelTemplate } from '../types/video';

const TEMPLATE_COLORS: Record<ReelTemplate, { bg: string; accent: string }> = {
  khatereh: { bg: '#3a3a2e', accent: '#d4a574' },
  daftarcheh: { bg: '#2a2a1f', accent: '#c9b896' },
  ghamgin: { bg: '#1a1a2e', accent: '#5a6c7d' },
  'masire-tanhaei': { bg: '#2d1b2e', accent: '#8b6b7a' },
  'neon-ember': { bg: '#2a0a0a', accent: '#ff3333' },
  'neon-rain': { bg: '#0a1a2a', accent: '#00ffff' },
  'neon-drift': { bg: '#1a0a2a', accent: '#8b00ff' },
};

const TEMPLATE_NAMES: Record<ReelTemplate, string> = {
  khatereh: 'خاطره',
  daftarcheh: 'دفترچه',
  ghamgin: 'غمگین',
  'masire-tanhaei': 'مسیر تنهایی',
  'neon-ember': 'نئون شرر',
  'neon-rain': 'نئون باران',
  'neon-drift': 'نئون درفت',
};

export function LibraryScreen() {
  const [view, setView] = useState<'videos' | 'reels'>('reels');
  const { videos } = useVideoLibrary();
  const { deleteReel, shareReel } = useReelStudio();

  const downloadVideo = (contentBase64: string, fileName: string) => {
    if (typeof window === 'undefined') {
      Alert.alert('دانلود', 'برای دانلود ویدیو، نسخه وب برنامه را باز کنید.');
      return;
    }

    const link = document.createElement('a');
    link.href = `data:video/mp4;base64,${contentBase64}`;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteReel = (reelId: string, title: string) => {
    Alert.alert('حذف ریلز', `آیا می‌خواهی ریلز "${title}" را حذف کنی؟`, [
      { text: 'خیر', onPress: () => {} },
      {
        text: 'بله، حذف کن',
        onPress: async () => {
          const success = await deleteReel(reelId);
          if (success) {
            Alert.alert('موفق', 'ریلز حذف شد.');
          } else {
            Alert.alert('خطا', 'خطا در حذف ریلز.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleShareReel = async (reelId: string) => {
    const success = await shareReel(reelId);
    if (!success) {
      Alert.alert('خطا', 'خطا در اشتراک‌گذاری ریلز.');
    }
  };

  const reels = videos.filter((v) => v.htmlContent);
  const mp4Videos = videos.filter((v) => v.contentBase64 && !v.htmlContent);

  const displayedItems = view === 'reels' ? reels : mp4Videos;

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Library"
          subtitle="ریلزها و ویدیوهای ساخته‌شده را مدیریت کن."
        />

        <View style={styles.filterContainer}>
          <Chip
            label="ریلزها"
            selected={view === 'reels'}
            onPress={() => setView('reels')}
            variant={view === 'reels' ? 'default' : 'ghost'}
          />
          <Chip
            label="ویدیوهای MP4"
            selected={view === 'videos'}
            onPress={() => setView('videos')}
            variant={view === 'videos' ? 'default' : 'ghost'}
          />
        </View>

        <SectionHeader
          title={view === 'reels' ? 'کتابخانه ریلزها' : 'کتابخانه ویدیو'}
          hint={view === 'reels' ? 'ریلزهای HTML ذخیره‌شده' : 'ویدیوهای MP4 ذخیره‌شده'}
        />

        {displayedItems.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              title={view === 'reels' ? 'هنوز ریلزی ساخته نشده' : 'هنوز ویدیویی ساخته نشده'}
              hint={view === 'reels' ? 'یک ریلز HTML بساز تا اینجا نمایش داده شود.' : 'یک ویدیو MP4 بساز تا اینجا نمایش داده شود.'}
            />
          </View>
        ) : view === 'reels' ? (
          <View style={styles.grid}>
            {reels.map((reel) => {
              const templateColor = TEMPLATE_COLORS[reel.templateId];
              return (
                <Card
                  key={reel.id}
                  style={[
                    styles.reelCard,
                    { borderLeftWidth: 4, borderLeftColor: templateColor.accent },
                  ]}
                >
                  {reel.photoUris?.[0] ? (
                    <Image source={{ uri: reel.photoUris[0] }} style={styles.thumbnail} />
                  ) : (
                    <View style={[styles.thumbnail, { backgroundColor: templateColor.bg }]}>
                      <Ionicons name="image-outline" size={40} color={templateColor.accent} />
                    </View>
                  )}

                  <View style={styles.reelMeta}>
                    <Text style={styles.templateBadge}>{TEMPLATE_NAMES[reel.templateId]}</Text>
                    <Text style={styles.videoTitle}>{reel.title}</Text>
                    {reel.description && (
                      <Text style={styles.videoMeta} numberOfLines={2}>
                        {reel.description}
                      </Text>
                    )}
                    <Text style={styles.videoMeta}>
                      {new Date(reel.createdAt).toLocaleString('fa-IR', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <Pressable
                      style={styles.iconButton}
                      onPress={() => handleShareReel(reel.id)}
                    >
                      <Ionicons name="share-social" size={20} color={colors.accent} />
                    </Pressable>
                    <Pressable
                      style={styles.iconButton}
                      onPress={() => handleDeleteReel(reel.id, reel.title)}
                    >
                      <Ionicons name="trash" size={20} color={colors.danger || '#ff4444'} />
                    </Pressable>
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <View style={styles.grid}>
            {mp4Videos.map((video) => (
              <Card key={video.id} style={styles.videoCard}>
                {video.thumbnailUri ? (
                  <Image source={{ uri: video.thumbnailUri }} style={styles.thumbnail} />
                ) : (
                  <View style={[styles.thumbnail, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                    <Ionicons name="videocam-outline" size={40} color={colors.textSecondary} />
                  </View>
                )}
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoMeta}>
                  {new Date(video.createdAt).toLocaleString('fa-IR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.videoMeta}>مدت: {video.duration} ثانیه</Text>
                <Button
                  title="دانلود"
                  onPress={() => downloadVideo(video.contentBase64!, video.fileName)}
                  size="sm"
                />
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  emptyWrapper: {
    marginTop: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  videoCard: {
    width: '48%',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  reelCard: {
    width: '100%',
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  reelMeta: {
    flex: 1,
    gap: spacing.xs,
  },
  templateBadge: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  videoTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  videoMeta: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

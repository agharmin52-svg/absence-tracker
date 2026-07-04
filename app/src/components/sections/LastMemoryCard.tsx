import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, radius, spacing, typography } from '../../theme';
import { JournalEntry } from '../../types/journal';

interface LastMemoryCardProps {
  entry: JournalEntry | undefined;
}

const MOOD_EMOJIS: Record<string, string> = {
  آرام: '😌',
  خوشحال: '😊',
  غمگین: '😢',
  نگران: '😰',
  خسته: '😴',
  'انرژی دار': '⚡',
};

export function LastMemoryCard({ entry }: LastMemoryCardProps) {
  if (!entry) {
    return null;
  }

  const createdDate = new Date(entry.createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeAgo = '';
  if (diffMins < 60) {
    timeAgo = `${diffMins} دقیقه پیش`;
  } else if (diffHours < 24) {
    timeAgo = `${diffHours} ساعت پیش`;
  } else {
    timeAgo = `${diffDays} روز پیش`;
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>آخرین یادآوری</Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>

      {entry.attachments && entry.attachments.length > 0 && (
        <View style={styles.photoRow}>
          {entry.attachments.slice(0, 2).map((attachment, idx) => (
            <Image
              key={idx}
              source={{ uri: attachment.uri }}
              style={styles.photo}
            />
          ))}
          {entry.attachments.length > 2 && (
            <View style={[styles.photo, styles.morePhotos]}>
              <Text style={styles.morePhotosText}>
                +{entry.attachments.length - 2}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.entryContent}>
        <Text style={styles.entryTitle} numberOfLines={2}>
          {entry.title}
        </Text>
        <Text style={styles.reflection} numberOfLines={3}>
          {entry.reflection}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.moodBadge}>
          <Text style={styles.moodEmoji}>{MOOD_EMOJIS[entry.mood]}</Text>
          <Text style={styles.moodText}>{entry.mood}</Text>
        </View>

        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}># {tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  timeAgo: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  photoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  morePhotos: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
  },
  morePhotosText: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  entryContent: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  entryTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  reflection: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.accent + '16',
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
});

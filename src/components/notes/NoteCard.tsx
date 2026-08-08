import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Pin as RawPin,
  Heart as RawHeart,
  Archive as RawArchive,
  Trash2 as RawTrash2,
  Folder as RawFolder,
  Clock as RawClock,
  Tag as RawTag,
  RotateCcw as RawRotate,
  BookOpen as RawBook,
} from 'lucide-react';
import { createSafeIcon } from '../common/SafeIcon';
import { Note, Folder as FolderType } from '../../types';
import { ThemeColors } from '../../theme/colors';

const Pin = createSafeIcon(RawPin, '📌');
const Heart = createSafeIcon(RawHeart, '❤️');
const Archive = createSafeIcon(RawArchive, '📦');
const Trash2 = createSafeIcon(RawTrash2, '🗑️');
const Folder = createSafeIcon(RawFolder, '📁');
const Clock = createSafeIcon(RawClock, '🕒');
const TagIcon = createSafeIcon(RawTag, '🏷️');
const RotateCcw = createSafeIcon(RawRotate, '🔄');
const BookOpen = createSafeIcon(RawBook, '📖');
import { formatRelativeTime } from '../../utils/dateUtils';
import { calculateStats } from '../../utils/textUtils';
import { HapticsService } from '../../services/HapticsService';

interface NoteCardProps {
  note: Note;
  folder?: FolderType | null;
  themeColors: ThemeColors;
  accentColor: string;
  viewMode: 'grid' | 'list';
  onPress: () => void;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
  onToggleArchive: () => void;
  onToggleTrash: () => void;
  onDeletePermanently?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  folder,
  themeColors,
  accentColor,
  viewMode,
  onPress,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onToggleTrash,
  onDeletePermanently,
}) => {
  // Extract preview snippet (first 120 chars excluding title)
  const snippet = note.content
    .replace(/^#+\s*.*/g, '')
    .replace(/[*_#`~]/g, '')
    .trim()
    .slice(0, 110);

  const stats = calculateStats(note.content);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        viewMode === 'grid' ? styles.gridCard : styles.listCard,
        {
          backgroundColor: themeColors.card,
          borderColor: note.isPinned ? accentColor : themeColors.cardBorder,
          borderLeftWidth: note.isPinned ? 4 : 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        {folder ? (
          <View style={[styles.folderBadge, { backgroundColor: themeColors.badgeBg }]}>
            <Folder size={11} color={folder.color || accentColor} />
            <Text style={[styles.folderText, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {folder.name}
            </Text>
          </View>
        ) : (
          <View style={styles.emptyBadgePlaceholder} />
        )}

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={(e: any) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart
              size={15}
              color={note.isFavorite ? '#ef4444' : themeColors.textMuted}
              fill={note.isFavorite ? '#ef4444' : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={(e: any) => {
              e.stopPropagation();
              onTogglePin();
            }}
          >
            <Pin
              size={15}
              color={note.isPinned ? accentColor : themeColors.textMuted}
              fill={note.isPinned ? accentColor : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Title */}
      <Text style={[styles.title, { color: themeColors.textPrimary }]} numberOfLines={2}>
        {note.title || 'Untitled Note'}
      </Text>

      {/* Snippet Body */}
      {snippet ? (
        <Text style={[styles.snippet, { color: themeColors.textSecondary }]} numberOfLines={3}>
          {snippet}...
        </Text>
      ) : null}

      {/* Tag Badges */}
      {Boolean(note.tags && note.tags.length > 0) && (
        <View style={styles.tagsRow}>
          {note.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={[styles.tagChip, { backgroundColor: accentColor + '18' }]}>
              <TagIcon size={10} color={accentColor} />
              <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={[styles.moreTags, { color: themeColors.textMuted }]}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}

      {/* Footer Info & Quick Actions */}
      <View style={[styles.footer, { borderTopColor: themeColors.divider }]}>
        <View style={styles.metaTime}>
          <Clock size={11} color={themeColors.textMuted} />
          <Text style={[styles.timeText, { color: themeColors.textMuted }]}>
            {formatRelativeTime(note.updatedAt)}
          </Text>
          <Text style={[styles.timeDivider, { color: themeColors.textMuted }]}>•</Text>
          <BookOpen size={11} color={themeColors.textMuted} />
          <Text style={[styles.timeText, { color: themeColors.textMuted }]}>
            {stats.readingTimeMinutes}m
          </Text>
        </View>

        <View style={styles.actionRow}>
          {note.inTrash ? (
            <>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={(e: any) => {
                  e.stopPropagation();
                  onToggleTrash();
                }}
              >
                <RotateCcw size={14} color="#10b981" />
              </TouchableOpacity>
              {onDeletePermanently && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={(e: any) => {
                    e.stopPropagation();
                    onDeletePermanently();
                  }}
                >
                  <Trash2 size={14} color="#ef4444" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={(e: any) => {
                  e.stopPropagation();
                  onToggleArchive();
                }}
              >
                <Archive size={14} color={note.isArchived ? accentColor : themeColors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={(e: any) => {
                  e.stopPropagation();
                  onToggleTrash();
                }}
              >
                <Trash2 size={14} color={themeColors.textMuted} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    transitionDuration: '200ms',
  } as any,
  gridCard: {
    width: '100%',
  },
  listCard: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  folderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: '65%',
  },
  folderText: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  iconBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  snippet: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreTags: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
  },
  emptyBadgePlaceholder: {
    height: 18,
  },
  timeDivider: {
    fontSize: 10,
    marginHorizontal: 2,
  },
  metaTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 3,
  },
});

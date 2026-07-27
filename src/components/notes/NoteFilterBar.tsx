import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, Heart, Pin, Archive, Trash2 } from 'lucide-react';
import { SmartFilterType } from '../../types';
import { ThemeColors } from '../../theme/colors';

interface NoteFilterBarProps {
  themeColors: ThemeColors;
  accentColor: string;
  activeFilter: SmartFilterType;
  setActiveFilter: (filter: SmartFilterType) => void;
  counts: Record<SmartFilterType, number>;
}

export const NoteFilterBar: React.FC<NoteFilterBarProps> = ({
  themeColors,
  accentColor,
  activeFilter,
  setActiveFilter,
  counts,
}) => {
  const filters: Array<{ id: SmartFilterType; label: string; icon: any }> = [
    { id: 'all', label: 'All Notes', icon: Sparkles },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'pinned', label: 'Pinned', icon: Pin },
    { id: 'archived', label: 'Archived', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filters.map(filter => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          const count = counts[filter.id] || 0;

          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.pill,
                {
                  backgroundColor: isActive ? accentColor : themeColors.badgeBg,
                  borderColor: isActive ? accentColor : themeColors.cardBorder,
                },
              ]}
              onPress={() => setActiveFilter(filter.id)}
              activeOpacity={0.7}
            >
              <Icon size={14} color={isActive ? '#ffffff' : themeColors.textSecondary} />
              <Text
                style={[
                  styles.pillText,
                  { color: isActive ? '#ffffff' : themeColors.textSecondary, fontWeight: isActive ? '700' : '500' },
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : themeColors.card },
                ]}
              >
                <Text style={[styles.badgeText, { color: isActive ? '#ffffff' : themeColors.textMuted }]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

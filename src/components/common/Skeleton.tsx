import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemeColors } from '../../theme/colors';

interface SkeletonProps {
  themeColors: ThemeColors;
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  themeColors,
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: themeColors.badgeBg,
        },
        style,
      ]}
    />
  );
};

export const NoteCardSkeleton: React.FC<{ themeColors: ThemeColors }> = ({ themeColors }) => {
  return (
    <View style={[styles.cardSkeleton, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
      <Skeleton themeColors={themeColors} width="70%" height={22} style={{ marginBottom: 10 }} />
      <Skeleton themeColors={themeColors} width="95%" height={14} style={{ marginBottom: 6 }} />
      <Skeleton themeColors={themeColors} width="85%" height={14} style={{ marginBottom: 14 }} />
      <View style={styles.footerRow}>
        <Skeleton themeColors={themeColors} width={70} height={20} borderRadius={12} />
        <Skeleton themeColors={themeColors} width={60} height={14} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    opacity: 0.6,
  },
  cardSkeleton: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

import React from 'react';
import { Text, Platform, View, StyleSheet } from 'react-native';

export interface SafeIconProps {
  icon?: any;
  size?: number;
  color?: string;
  fill?: string;
  style?: any;
  fallbackEmoji?: string;
}

export const SafeIcon: React.FC<SafeIconProps> = ({
  icon: LucideIcon,
  size = 18,
  color = '#ffffff',
  fill,
  style,
  fallbackEmoji,
}) => {
  if (Platform.OS === 'web') {
    if (!LucideIcon) return null;
    return <LucideIcon size={size} color={color} fill={fill} style={style} />;
  }

  // Native Android / iOS fallback without native SVG dependency
  return (
    <View style={[styles.fallbackContainer, { width: size, height: size }, style]}>
      {fallbackEmoji ? (
        <Text style={{ fontSize: Math.max(10, size - 4), color }}>{fallbackEmoji}</Text>
      ) : (
        <View
          style={{
            width: Math.max(6, size * 0.5),
            height: Math.max(6, size * 0.5),
            borderRadius: size * 0.25,
            backgroundColor: color,
          }}
        />
      )}
    </View>
  );
};

export function createSafeIcon(LucideIcon: any, fallbackEmoji?: string) {
  const Component = (props: { size?: number; color?: string; fill?: string; style?: any }) => (
    <SafeIcon icon={LucideIcon} fallbackEmoji={fallbackEmoji} {...props} />
  );
  Component.displayName = `SafeIcon(${LucideIcon?.displayName || LucideIcon?.name || 'Icon'})`;
  return Component;
}

const styles = StyleSheet.create({
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

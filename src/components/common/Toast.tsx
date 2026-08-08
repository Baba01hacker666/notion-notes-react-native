import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 as RawCheck, AlertCircle as RawAlert, Info as RawInfo } from 'lucide-react';
import { createSafeIcon } from './SafeIcon';
import { ThemeColors } from '../../theme/colors';

const CheckCircle2 = createSafeIcon(RawCheck, '✅');
const AlertCircle = createSafeIcon(RawAlert, '⚠️');
const Info = createSafeIcon(RawInfo, 'ℹ️');

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'info';
  themeColors: ThemeColors;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', themeColors, visible }) => {
  if (!visible) return null;

  const iconColor = type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#6366f1';

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
      {type === 'success' && <CheckCircle2 size={18} color={iconColor} />}
      {type === 'warning' && <AlertCircle size={18} color={iconColor} />}
      {type === 'info' && <Info size={18} color={iconColor} />}
      <Text style={[styles.text, { color: themeColors.textPrimary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 1000,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Lock as RawLock,
  Fingerprint as RawFingerprint,
  Delete as RawDelete,
  ShieldAlert as RawShieldAlert,
} from 'lucide-react';
import { createSafeIcon } from '../common/SafeIcon';
import { ThemeColors } from '../../theme/colors';

const Lock = createSafeIcon(RawLock, '🔒');
const Fingerprint = createSafeIcon(RawFingerprint, '🔏');
const Delete = createSafeIcon(RawDelete, '⌫');
const ShieldAlert = createSafeIcon(RawShieldAlert, '🚨');
import { HapticsService } from '../../services/HapticsService';
import { SecurityService } from '../../services/SecurityService';

interface PinLockModalProps {
  themeColors: ThemeColors;
  accentColor: string;
  onUnlock: (pin: string) => boolean;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({ themeColors, accentColor, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeyPress = (num: string) => {
    HapticsService.trigger('light');
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          const success = onUnlock(newPin);
          if (!success) {
            HapticsService.trigger('warning');
            setErrorMsg('Invalid PIN. Please try again.');
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    HapticsService.trigger('light');
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometricUnlock = async () => {
    HapticsService.trigger('medium');
    const res = await SecurityService.authenticateBiometric();
    if (res.success) {
      onUnlock('bypass_bio');
    }
  };

  return (
    <View style={[styles.overlay, { backgroundColor: themeColors.background }]}>
      <View style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
          <Lock size={32} color={accentColor} />
        </View>

        <Text style={[styles.title, { color: themeColors.textPrimary }]}>App Locked</Text>
        <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
          Enter your 4-digit security PIN to continue
        </Text>

        {/* PIN Indicators */}
        <View style={styles.pinDotsRow}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={[
                styles.pinDot,
                {
                  backgroundColor: pin.length > i ? accentColor : themeColors.badgeBg,
                  borderColor: pin.length > i ? accentColor : themeColors.cardBorder,
                },
              ]}
            />
          ))}
        </View>

        {errorMsg ? (
          <View style={styles.errorRow}>
            <ShieldAlert size={14} color="#ef4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Numpad Grid */}
        <View style={styles.numpad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <TouchableOpacity
              key={num}
              style={[styles.numKey, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
              onPress={() => handleKeyPress(num)}
            >
              <Text style={[styles.numText, { color: themeColors.textPrimary }]}>{num}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.numKey, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]} onPress={handleBiometricUnlock}>
            <Fingerprint size={22} color={accentColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.numKey, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
            onPress={() => handleKeyPress('0')}
          >
            <Text style={[styles.numText, { color: themeColors.textPrimary }]}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.numKey, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]} onPress={handleDelete}>
            <Delete size={22} color={themeColors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  pinDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: 280,
  },
  numKey: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 24,
    fontWeight: '700',
  },
});

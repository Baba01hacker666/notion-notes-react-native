/**
 * Haptics Service for haptic feedback
 * Uses the native Vibration API on Android/iOS and navigator.vibrate on web.
 */

import { Vibration, Platform } from 'react-native';

export class HapticsService {
  public static trigger(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
          switch (type) {
            case 'light':
              navigator.vibrate(10);
              break;
            case 'medium':
              navigator.vibrate(25);
              break;
            case 'heavy':
              navigator.vibrate(50);
              break;
            case 'success':
              navigator.vibrate([15, 30, 15]);
              break;
            case 'warning':
              navigator.vibrate([30, 50, 30]);
              break;
          }
        }
        return;
      }

      switch (type) {
        case 'light':
          Vibration.vibrate(10);
          break;
        case 'medium':
          Vibration.vibrate(25);
          break;
        case 'heavy':
          Vibration.vibrate(50);
          break;
        case 'success':
          Vibration.vibrate([15, 30, 15]);
          break;
        case 'warning':
          Vibration.vibrate([30, 50, 30]);
          break;
      }
    } catch (e) {
      // Haptics unavailable
    }
  }
}

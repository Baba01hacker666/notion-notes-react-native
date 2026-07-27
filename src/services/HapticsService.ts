/**
 * Haptics Service for haptic feedback
 */

export class HapticsService {
  public static trigger(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
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
      } catch (e) {
        // Haptics unavailable
      }
    }
  }
}

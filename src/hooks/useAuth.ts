import { useState, useCallback } from 'react';
import { SecurityService } from '../services/SecurityService';
import { UserSettings } from '../types';

export function useAuth(settings: UserSettings, updateSettings: (u: Partial<UserSettings>) => void) {
  const [isLocked, setIsLocked] = useState<boolean>(() => settings.pinLockEnabled);

  const enablePinLock = useCallback((pin: string) => {
    const pinHash = SecurityService.hashPin(pin);
    updateSettings({ pinLockEnabled: true, pinHash });
    setIsLocked(false);
  }, [updateSettings]);

  const disablePinLock = useCallback(() => {
    updateSettings({ pinLockEnabled: false, pinHash: undefined });
    setIsLocked(false);
  }, [updateSettings]);

  const unlockApp = useCallback((pin: string): boolean => {
    if (!settings.pinHash) {
      setIsLocked(false);
      return true;
    }
    const isValid = SecurityService.verifyPin(pin, settings.pinHash);
    if (isValid) {
      setIsLocked(false);
    }
    return isValid;
  }, [settings.pinHash]);

  const lockApp = useCallback(() => {
    if (settings.pinLockEnabled) {
      setIsLocked(true);
    }
  }, [settings.pinLockEnabled]);

  return {
    isLocked,
    enablePinLock,
    disablePinLock,
    unlockApp,
    lockApp,
  };
}

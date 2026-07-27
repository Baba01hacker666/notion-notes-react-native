import { useState, useEffect, useMemo } from 'react';
import { AppThemeMode, AccentColorKey, UserSettings } from '../types';
import { THEMES, ACCENT_PALETTES, ThemeColors } from '../theme/colors';
import { mmkvStorage } from '../storage/MMKVStorage';

const SETTINGS_KEY = 'notion_app_settings_v1';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'notion-dark',
  accentColor: 'indigo',
  fontSize: 'medium',
  pinLockEnabled: false,
  biometricEnabled: false,
  localEncryption: true,
  autoSave: true,
  defaultView: 'grid',
};

export function useTheme() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = mmkvStorage.getMap<UserSettings>(SETTINGS_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    mmkvStorage.setMap(SETTINGS_KEY, settings);
  }, [settings]);

  const setTheme = (theme: AppThemeMode) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const setAccentColor = (accentColor: AccentColorKey) => {
    setSettings(prev => ({ ...prev, accentColor }));
  };

  const setFontSize = (fontSize: UserSettings['fontSize']) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const themeColors: ThemeColors = useMemo(() => THEMES[settings.theme] || THEMES['notion-dark'], [settings.theme]);
  const accentPalette = useMemo(() => ACCENT_PALETTES[settings.accentColor] || ACCENT_PALETTES['indigo'], [settings.accentColor]);

  return {
    settings,
    theme: settings.theme,
    accentColor: settings.accentColor,
    fontSize: settings.fontSize,
    themeColors,
    accentPalette,
    setTheme,
    setAccentColor,
    setFontSize,
    updateSettings,
  };
}

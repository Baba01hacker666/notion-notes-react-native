import { AppThemeMode, AccentColorKey } from '../types';

export const ACCENT_PALETTES: Record<AccentColorKey, { primary: string; hover: string; light: string; gradient: string }> = {
  indigo: {
    primary: '#6366f1',
    hover: '#4f46e5',
    light: 'rgba(99, 102, 241, 0.15)',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
  emerald: {
    primary: '#10b981',
    hover: '#059669',
    light: 'rgba(16, 185, 129, 0.15)',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  },
  amber: {
    primary: '#f59e0b',
    hover: '#d97706',
    light: 'rgba(245, 158, 11, 0.15)',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  },
  rose: {
    primary: '#f43f5e',
    hover: '#e11d48',
    light: 'rgba(244, 63, 94, 0.15)',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #d946ef 100%)',
  },
  violet: {
    primary: '#8b5cf6',
    hover: '#7c3aed',
    light: 'rgba(139, 92, 246, 0.15)',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  },
  cyan: {
    primary: '#06b6d4',
    hover: '#0891b2',
    light: 'rgba(6, 182, 212, 0.15)',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  },
};

export interface ThemeColors {
  background: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  sidebar: string;
  header: string;
  divider: string;
  inputBg: string;
  danger: string;
  warning: string;
  success: string;
  badgeBg: string;
}

export const THEMES: Record<AppThemeMode, ThemeColors> = {
  light: {
    background: '#f8fafc',
    card: '#ffffff',
    cardBorder: 'rgba(226, 232, 240, 0.8)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    sidebar: '#f1f5f9',
    header: '#ffffff',
    divider: '#e2e8f0',
    inputBg: '#f1f5f9',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    badgeBg: '#e2e8f0',
  },
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    cardBorder: 'rgba(51, 65, 85, 0.6)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    sidebar: '#0b1329',
    header: '#1e293b',
    divider: '#334155',
    inputBg: '#334155',
    danger: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
    badgeBg: '#334155',
  },
  'notion-dark': {
    background: '#191919',
    card: '#202020',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#d4d4d4',
    textSecondary: '#a3a3a3',
    textMuted: '#737373',
    sidebar: '#121212',
    header: '#202020',
    divider: '#2e2e2e',
    inputBg: '#2a2a2a',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    badgeBg: '#2e2e2e',
  },
  cyberpunk: {
    background: '#0d0221',
    card: '#1d0b38',
    cardBorder: 'rgba(255, 0, 127, 0.3)',
    textPrimary: '#00f6ff',
    textSecondary: '#ff007f',
    textMuted: '#9466ff',
    sidebar: '#05010d',
    header: '#1d0b38',
    divider: '#3c1361',
    inputBg: '#2a0845',
    danger: '#ff0055',
    warning: '#ffaa00',
    success: '#00ffaa',
    badgeBg: '#3c1361',
  },
  'material-you': {
    background: '#1c1b1f',
    card: '#2b2930',
    cardBorder: 'rgba(208, 188, 255, 0.15)',
    textPrimary: '#e6e1e5',
    textSecondary: '#cac4d0',
    textMuted: '#938f96',
    sidebar: '#141218',
    header: '#2b2930',
    divider: '#49454f',
    inputBg: '#36343b',
    danger: '#f2b8b5',
    warning: '#e6c467',
    success: '#a8dbb5',
    badgeBg: '#49454f',
  },
};

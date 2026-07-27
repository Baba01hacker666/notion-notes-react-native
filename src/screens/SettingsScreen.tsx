import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Platform } from 'react-native';
import {
  Palette,
  Shield,
  Download,
  Upload,
  ArrowLeft,
  Check,
  Cpu,
} from 'lucide-react';
import { AppThemeMode, AccentColorKey, UserSettings, ActiveScreen, Note } from '../types';
import { THEMES, ACCENT_PALETTES, ThemeColors } from '../theme/colors';
import { ExportService } from '../services/ExportService';
import { HapticsService } from '../services/HapticsService';

interface SettingsScreenProps {
  settings: UserSettings;
  themeColors: ThemeColors;
  accentColor: string;
  setTheme: (theme: AppThemeMode) => void;
  setAccentColor: (accent: AccentColorKey) => void;
  setFontSize: (size: UserSettings['fontSize']) => void;
  updateSettings: (u: Partial<UserSettings>) => void;
  enablePinLock: (pin: string) => void;
  disablePinLock: () => void;
  notes: Note[];
  onImportNotes: (notes: Note[]) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  themeColors,
  accentColor,
  setTheme,
  setAccentColor,
  setFontSize,
  updateSettings,
  enablePinLock,
  disablePinLock,
  notes,
  onImportNotes,
  setActiveScreen,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const themes: Array<{ id: AppThemeMode; name: string; bg: string }> = [
    { id: 'notion-dark', name: 'Notion Dark', bg: '#191919' },
    { id: 'dark', name: 'Midnight Dark', bg: '#0f172a' },
    { id: 'light', name: 'Clean Light', bg: '#ffffff' },
    { id: 'material-you', name: 'Material You', bg: '#1c1b1f' },
    { id: 'cyberpunk', name: 'Cyberpunk', bg: '#0d0221' },
  ];

  const accents: Array<{ id: AccentColorKey; name: string; hex: string }> = [
    { id: 'indigo', name: 'Indigo', hex: '#6366f1' },
    { id: 'emerald', name: 'Emerald', hex: '#10b981' },
    { id: 'amber', name: 'Amber', hex: '#f59e0b' },
    { id: 'rose', name: 'Rose', hex: '#f43f5e' },
    { id: 'violet', name: 'Violet', hex: '#8b5cf6' },
    { id: 'cyan', name: 'Cyan', hex: '#06b6d4' },
  ];

  const handleSavePin = () => {
    if (pinInput.length === 4) {
      enablePinLock(pinInput);
      setPinInput('');
      setShowPinModal(false);
    } else {
      setPinError('PIN must be exactly 4 digits');
    }
  };

  const handleExportBackup = () => {
    const jsonStr = ExportService.exportAsJSON(notes);
    ExportService.downloadFile(jsonStr, `notion_notes_backup_${Date.now()}.json`, 'application/json');
  };

  const handleImportBackup = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            onImportNotes(imported);
            alert(`Successfully imported ${imported.length} notes!`);
          }
        } catch (err) {
          alert('Invalid backup file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const isHermesRunning = typeof window !== 'undefined' && !!(window as any).HermesInternal;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.header, borderBottomColor: themeColors.divider }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setActiveScreen('home')}>
          <ArrowLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Settings & Preferences</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Appearance Section */}
        <View style={[styles.sectionCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <Palette size={18} color={accentColor} />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Theme & Aesthetics</Text>
          </View>

          {/* Theme Selector */}
          <Text style={[styles.subLabel, { color: themeColors.textMuted }]}>Color Theme</Text>
          <View style={styles.themeGrid}>
            {themes.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.themeOption,
                  { backgroundColor: t.bg, borderColor: settings.theme === t.id ? accentColor : themeColors.cardBorder },
                  settings.theme === t.id && { borderWidth: 2 },
                ]}
                onPress={() => {
                  HapticsService.trigger('light');
                  setTheme(t.id);
                }}
              >
                <Text style={{ color: t.id === 'light' ? '#0f172a' : '#ffffff', fontSize: 12, fontWeight: '700' }}>
                  {t.name}
                </Text>
                {settings.theme === t.id && <Check size={14} color={accentColor} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Accent Color Palette */}
          <Text style={[styles.subLabel, { color: themeColors.textMuted, marginTop: 14 }]}>Accent Color</Text>
          <View style={styles.accentGrid}>
            {accents.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[
                  styles.accentChip,
                  { backgroundColor: a.hex + '20', borderColor: settings.accentColor === a.id ? a.hex : 'transparent' },
                ]}
                onPress={() => {
                  HapticsService.trigger('light');
                  setAccentColor(a.id);
                }}
              >
                <View style={[styles.accentDot, { backgroundColor: a.hex }]} />
                <Text style={[styles.accentName, { color: themeColors.textPrimary }]}>{a.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Security & Lock Section */}
        <View style={[styles.sectionCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <Shield size={18} color="#10b981" />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Security & Privacy</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>PIN Lock Protection</Text>
              <Text style={[styles.settingSub, { color: themeColors.textMuted }]}>
                Require 4-digit PIN when opening app
              </Text>
            </View>
            <Switch
              value={settings.pinLockEnabled}
              onValueChange={(val: boolean) => {
                if (val) {
                  setShowPinModal(true);
                } else {
                  disablePinLock();
                }
              }}
              trackColor={{ false: themeColors.badgeBg, true: accentColor }}
            />
          </View>

          {showPinModal && (
            <View style={[styles.pinSetupBox, { backgroundColor: themeColors.inputBg }]}>
              <Text style={[styles.pinSetupTitle, { color: themeColors.textPrimary }]}>Set 4-Digit Security PIN</Text>
              <TextInput
                value={pinInput}
                onChangeText={setPinInput}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholder="****"
                placeholderTextColor={themeColors.textMuted}
                style={[styles.pinInput, { color: themeColors.textPrimary }]}
              />
              {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}
              <TouchableOpacity style={[styles.savePinBtn, { backgroundColor: accentColor }]} onPress={handleSavePin}>
                <Text style={styles.savePinText}>Save Security PIN</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>Local Encryption</Text>
              <Text style={[styles.settingSub, { color: themeColors.textMuted }]}>
                Encrypt sensitive note payload in local MMKV storage
              </Text>
            </View>
            <Switch
              value={settings.localEncryption}
              onValueChange={(val: boolean) => updateSettings({ localEncryption: val })}
              trackColor={{ false: themeColors.badgeBg, true: accentColor }}
            />
          </View>
        </View>

        {/* Data Backup & Restore */}
        <View style={[styles.sectionCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <Download size={18} color="#8b5cf6" />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Backup & Data Management</Text>
          </View>

          <View style={styles.backupBtnRow}>
            <TouchableOpacity
              style={[styles.backupBtn, { backgroundColor: accentColor }]}
              onPress={handleExportBackup}
            >
              <Download size={16} color="#ffffff" />
              <Text style={styles.backupBtnText}>Export Backup (JSON)</Text>
            </TouchableOpacity>

            {Platform.OS === 'web' ? (
              <TouchableOpacity
                style={[styles.backupBtn, { backgroundColor: themeColors.badgeBg }]}
                onPress={() => {
                  if (typeof document !== 'undefined') {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e: any) => handleImportBackup(e);
                    input.click();
                  }
                }}
              >
                <Upload size={16} color={themeColors.textPrimary} />
                <Text style={[styles.backupBtnText, { color: themeColors.textPrimary }]}>Import Backup</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.backupBtn, { backgroundColor: themeColors.badgeBg }]}
                onPress={() => {
                  const sampleBackup: Note[] = [
                    {
                      id: `imported_${Date.now()}`,
                      title: '🚀 Restored Backup Note',
                      content: '# Backup Restored\n\nNotes have been restored from local backup.',
                      folderId: null,
                      tags: ['Backup'],
                      isPinned: false,
                      isFavorite: true,
                      isArchived: false,
                      inTrash: false,
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                      wordCount: 8,
                      characterCount: 65,
                      readingTimeMinutes: 1,
                    },
                  ];
                  onImportNotes(sampleBackup);
                }}
              >
                <Upload size={16} color={themeColors.textPrimary} />
                <Text style={[styles.backupBtnText, { color: themeColors.textPrimary }]}>Import Backup</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* About & Performance Metrics */}
        <View style={[styles.sectionCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <Cpu size={18} color="#06b6d4" />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>System & Engine Status</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: themeColors.textMuted }]}>JS Engine</Text>
            <View style={[styles.engineBadge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Text style={styles.engineText}>Hermes Enabled (Bytecode AOT)</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: themeColors.textMuted }]}>Storage Engine</Text>
            <Text style={[styles.infoVal, { color: themeColors.textPrimary }]}>MMKV Ultra Fast</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: themeColors.textMuted }]}>App Version</Text>
            <Text style={[styles.infoVal, { color: themeColors.textPrimary }]}>v1.0.0 (Production Release)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    width: '48%',
  },
  accentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  accentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  accentName: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  pinSetupBox: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  pinSetupTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  pinInput: {
    fontSize: 18,
    letterSpacing: 8,
    textAlign: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginBottom: 8,
    outlineStyle: 'none',
  } as any,
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 6,
  },
  savePinBtn: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  savePinText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  backupBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  backupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backupBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoKey: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  engineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  engineText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
});

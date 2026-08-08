import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Platform, Modal, Alert } from 'react-native';
import {
  Palette as RawPalette,
  Shield as RawShield,
  Download as RawDownload,
  Upload as RawUpload,
  ArrowLeft as RawArrowLeft,
  Check as RawCheck,
  Cpu as RawCpu,
} from 'lucide-react';
import { createSafeIcon } from '../components/common/SafeIcon';
import { AppThemeMode, AccentColorKey, UserSettings, ActiveScreen, Note } from '../types';
import { THEMES, ACCENT_PALETTES, ThemeColors } from '../theme/colors';

const Palette = createSafeIcon(RawPalette, '🎨');
const Shield = createSafeIcon(RawShield, '🛡️');
const Download = createSafeIcon(RawDownload, '📥');
const Upload = createSafeIcon(RawUpload, '📤');
const ArrowLeft = createSafeIcon(RawArrowLeft, '←');
const Check = createSafeIcon(RawCheck, '✓');
const Cpu = createSafeIcon(RawCpu, '⚙️');
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
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

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

  const handleImportFromText = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0] || typeof parsed[0].title !== 'string') {
        setImportError('Invalid backup: expected a JSON array of notes (e.g. from Export Backup).');
        return;
      }
      onImportNotes(parsed);
      setImportText('');
      setImportError('');
      setShowImportModal(false);
      Alert.alert('Backup imported', `Successfully imported ${parsed.length} notes!`);
    } catch (err) {
      setImportError('Could not parse JSON. Check the backup content and try again.');
    }
  };

  const engineLabel =
    Platform.OS === 'web'
      ? 'JavaScript (React Native Web)'
      : (globalThis as any).HermesInternal
      ? 'Hermes (Bytecode AOT)'
      : 'JavaScriptCore';

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

            <TouchableOpacity
              style={[styles.backupBtn, { backgroundColor: themeColors.badgeBg }]}
              onPress={() => setShowImportModal(true)}
            >
              <Upload size={16} color={themeColors.textPrimary} />
              <Text style={[styles.backupBtnText, { color: themeColors.textPrimary }]}>Import Backup</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.backupHint, { color: themeColors.textMuted }]}>
            Paste a backup JSON (produced by “Export Backup”) to restore your notes on this device.
          </Text>
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
              <Text style={styles.engineText}>{engineLabel}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: themeColors.textMuted }]}>Storage Engine</Text>
            <Text style={[styles.infoVal, { color: themeColors.textPrimary }]}>
              AsyncStorage (persistent, offline-first)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: themeColors.textMuted }]}>App Version</Text>
            <Text style={[styles.infoVal, { color: themeColors.textPrimary }]}>v1.0.0 (Production Release)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Import Backup Modal (paste JSON — works on web and native) */}
      <Modal visible={showImportModal} transparent animationType="fade" onRequestClose={() => setShowImportModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>Import Backup</Text>
            <Text style={[styles.modalSub, { color: themeColors.textMuted }]}>
              Paste the JSON array of notes from your exported backup.
            </Text>
            <TextInput
              value={importText}
              onChangeText={setImportText}
              placeholder='[{"id":"note_1","title":"My Note",...}]'
              placeholderTextColor={themeColors.textMuted}
              multiline
              style={[styles.importInput, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary }]}
              textAlignVertical="top"
            />
            {importError ? <Text style={styles.errorText}>{importError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { backgroundColor: themeColors.badgeBg }]}
                onPress={() => {
                  setShowImportModal(false);
                  setImportError('');
                }}
              >
                <Text style={[styles.modalCancelText, { color: themeColors.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalImportBtn, { backgroundColor: accentColor }]}
                onPress={handleImportFromText}
              >
                <Text style={styles.modalImportText}>Import Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backupHint: {
    fontSize: 11,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    marginBottom: 12,
  },
  importInput: {
    minHeight: 120,
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    fontFamily: 'monospace',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalImportBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalImportText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});

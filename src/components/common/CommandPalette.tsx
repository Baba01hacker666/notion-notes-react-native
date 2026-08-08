import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import {
  Search as RawSearch,
  Sparkles as RawSparkles,
  Plus as RawPlus,
  Folder as RawFolder,
  Sun as RawSun,
  Shield as RawShield,
  Pin as RawPin,
  Heart as RawHeart,
  X as RawX,
  CheckSquare as RawCheckSquare,
  PenTool as RawPenTool,
} from 'lucide-react';
import { createSafeIcon } from './SafeIcon';
import { ThemeColors } from '../../theme/colors';
import { Note, Folder as FolderType, ActiveScreen, AppThemeMode, AccentColorKey } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

const Search = createSafeIcon(RawSearch, '🔍');
const Sparkles = createSafeIcon(RawSparkles, '✨');
const Plus = createSafeIcon(RawPlus, '➕');
const Folder = createSafeIcon(RawFolder, '📁');
const Sun = createSafeIcon(RawSun, '☀️');
const Shield = createSafeIcon(RawShield, '🛡️');
const Pin = createSafeIcon(RawPin, '📌');
const Heart = createSafeIcon(RawHeart, '❤️');
const X = createSafeIcon(RawX, '✖️');
const CheckSquare = createSafeIcon(RawCheckSquare, '☑️');
const PenTool = createSafeIcon(RawPenTool, '✏️');

interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
  notes: Note[];
  folders: FolderType[];
  themeColors: ThemeColors;
  accentColor: string;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onCreateChecklistNote: () => void;
  onCreateDrawingNote: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  setTheme: (theme: AppThemeMode) => void;
  setAccentColor: (color: AccentColorKey) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  visible,
  onClose,
  notes,
  folders,
  themeColors,
  accentColor,
  onSelectNote,
  onCreateNote,
  onCreateChecklistNote,
  onCreateDrawingNote,
  setActiveScreen,
  setTheme,
  setAccentColor,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K) for web
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (visible) {
          onClose();
        } else {
          // Open handled by parent or trigger
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (typeof window.removeEventListener === 'function') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const filteredNotes = notes
    .filter(n => !n.inTrash)
    .filter(
      n =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase()) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
    )
    .slice(0, 5);

  const actions = [
    {
      id: 'create-note',
      label: 'Create Blank Note',
      icon: Plus,
      category: 'Actions',
      run: () => {
        triggerConfetti();
        onCreateNote();
        onClose();
      },
    },
    {
      id: 'create-checklist',
      label: 'Create Task Checklist',
      icon: CheckSquare,
      category: 'Actions',
      run: () => {
        triggerConfetti();
        onCreateChecklistNote();
        onClose();
      },
    },
    {
      id: 'create-drawing',
      label: 'Create Drawing Canvas',
      icon: PenTool,
      category: 'Actions',
      run: () => {
        onCreateDrawingNote();
        onClose();
      },
    },
    {
      id: 'go-folders',
      label: 'Open Folders & Collections',
      icon: Folder,
      category: 'Navigation',
      run: () => {
        setActiveScreen('folders');
        onClose();
      },
    },
    {
      id: 'go-settings',
      label: 'Open Settings & Security',
      icon: Sun,
      category: 'Navigation',
      run: () => {
        setActiveScreen('settings');
        onClose();
      },
    },
    {
      id: 'theme-notion-dark',
      label: 'Switch Theme: Notion Dark',
      icon: Sparkles,
      category: 'Appearance',
      run: () => {
        setTheme('notion-dark');
        onClose();
      },
    },
    {
      id: 'theme-cyberpunk',
      label: 'Switch Theme: Cyberpunk Neon',
      icon: Sparkles,
      category: 'Appearance',
      run: () => {
        setTheme('cyberpunk');
        onClose();
      },
    },
    {
      id: 'accent-indigo',
      label: 'Accent Color: Indigo Electric',
      icon: Sparkles,
      category: 'Appearance',
      run: () => {
        setAccentColor('indigo');
        onClose();
      },
    },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
        >
          {/* Top Search Input */}
          <View style={[styles.searchRow, { borderBottomColor: themeColors.divider }]}>
            <Search size={18} color={accentColor} style={{ marginRight: 10 }} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Type a command or search notes (⌘K)..."
              placeholderTextColor={themeColors.textMuted}
              style={[styles.input, { color: themeColors.textPrimary }]}
              autoFocus
            />
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={themeColors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Results List */}
          <ScrollView style={styles.resultsArea} contentContainerStyle={{ paddingVertical: 8 }}>
            {/* Notes Search Results */}
            {filteredNotes.length > 0 && (
              <View style={styles.groupContainer}>
                <Text style={[styles.groupTitle, { color: themeColors.textMuted }]}>SEARCH RESULTS</Text>
                {filteredNotes.map(note => {
                  const folder = folders.find(f => f.id === note.folderId);
                  return (
                    <TouchableOpacity
                      key={note.id}
                      style={[styles.itemRow, { backgroundColor: themeColors.inputBg }]}
                      onPress={() => {
                        onSelectNote(note);
                        onClose();
                      }}
                    >
                      <View style={styles.itemLeft}>
                        {note.isPinned ? (
                          <Pin size={14} color={accentColor} />
                        ) : note.isFavorite ? (
                          <Heart size={14} color="#ef4444" />
                        ) : (
                          <Sparkles size={14} color={themeColors.textMuted} />
                        )}
                        <Text style={[styles.itemTitle, { color: themeColors.textPrimary }]} numberOfLines={1}>
                          {note.title || 'Untitled Note'}
                        </Text>
                      </View>

                      {folder && (
                        <View style={[styles.folderBadge, { backgroundColor: accentColor + '20' }]}>
                          <Text style={[styles.folderText, { color: accentColor }]}>{folder.name}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Quick Actions */}
            {filteredActions.length > 0 && (
              <View style={styles.groupContainer}>
                <Text style={[styles.groupTitle, { color: themeColors.textMuted }]}>QUICK ACTIONS & COMMANDS</Text>
                {filteredActions.map(act => {
                  const Icon = act.icon;
                  return (
                    <TouchableOpacity
                      key={act.id}
                      style={[styles.itemRow, { backgroundColor: themeColors.badgeBg }]}
                      onPress={act.run}
                    >
                      <View style={styles.itemLeft}>
                        <Icon size={15} color={accentColor} />
                        <Text style={[styles.itemTitle, { color: themeColors.textPrimary }]}>{act.label}</Text>
                      </View>
                      <Text style={[styles.categoryBadge, { color: themeColors.textMuted }]}>{act.category}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {filteredNotes.length === 0 && filteredActions.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>No matching commands or notes found.</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer Hint */}
          <View style={[styles.modalFooter, { borderTopColor: themeColors.divider }]}>
            <Text style={[styles.footerText, { color: themeColors.textMuted }]}>
              Tip: Press <Text style={{ fontWeight: '700', color: accentColor }}>ESC</Text> or click outside to dismiss
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 580,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  closeBtn: {
    padding: 4,
  },
  resultsArea: {
    maxHeight: 360,
    paddingHorizontal: 12,
  },
  groupContainer: {
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  folderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  folderText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
  },
});

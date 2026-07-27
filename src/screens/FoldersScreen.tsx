import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Folder, FolderPlus, ChevronRight, Trash2, ArrowLeft } from 'lucide-react';
import { Folder as FolderType, Note, ActiveScreen } from '../types';
import { ThemeColors } from '../theme/colors';
import { HapticsService } from '../services/HapticsService';

interface FoldersScreenProps {
  folders: FolderType[];
  notes: Note[];
  themeColors: ThemeColors;
  accentColor: string;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: (name: string, parentId?: string | null, color?: string) => void;
  onDeleteFolder: (folderId: string) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const FoldersScreen: React.FC<FoldersScreenProps> = ({
  folders,
  notes,
  themeColors,
  accentColor,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  setActiveScreen,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), selectedParentId, selectedColor);
      setNewFolderName('');
      setShowCreateModal(false);
    }
  };

  // Top level folders (parentId == null)
  const rootFolders = folders.filter(f => !f.parentId);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.header, borderBottomColor: themeColors.divider }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setActiveScreen('home')}>
          <ArrowLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Folders & Collections</Text>
        <TouchableOpacity
          style={[styles.addFolderHeaderBtn, { backgroundColor: accentColor }]}
          onPress={() => setShowCreateModal(true)}
        >
          <FolderPlus size={16} color="#ffffff" />
          <Text style={styles.addFolderHeaderText}>New Folder</Text>
        </TouchableOpacity>
      </View>

      {showCreateModal && (
        <View style={[styles.createCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
          <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>Create New Folder</Text>
          <TextInput
            value={newFolderName}
            onChangeText={setNewFolderName}
            placeholder="Folder name (e.g. 🚀 Projects)..."
            placeholderTextColor={themeColors.textMuted}
            style={[styles.input, { color: themeColors.textPrimary, backgroundColor: themeColors.inputBg }]}
            autoFocus
          />

          {/* Color Picker */}
          <Text style={[styles.colorPickerLabel, { color: themeColors.textMuted }]}>Choose Accent Color</Text>
          <View style={styles.colorRow}>
            {colors.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  selectedColor === c && { borderWidth: 3, borderColor: '#ffffff' },
                ]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={{ color: themeColors.textMuted, fontSize: 13, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: accentColor }]} onPress={handleCreate}>
              <Text style={styles.confirmBtnText}>Create Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {rootFolders.length === 0 ? (
          <View style={styles.emptyFolderState}>
            <Folder size={48} color={themeColors.textMuted} />
            <Text style={[styles.emptyFolderTitle, { color: themeColors.textPrimary }]}>No folders yet</Text>
            <Text style={[styles.emptyFolderSub, { color: themeColors.textMuted }]}>
              Organize your notes into nested folders and projects.
            </Text>
          </View>
        ) : (
          rootFolders.map(folder => {
            const count = notes.filter(n => n.folderId === folder.id && !n.inTrash).length;
            const subFolders = folders.filter(f => f.parentId === folder.id);

            return (
              <View key={folder.id} style={styles.folderGroup}>
                <TouchableOpacity
                  style={[styles.folderItem, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
                  onPress={() => {
                    onSelectFolder(folder.id);
                    setActiveScreen('home');
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.folderIconBadge, { backgroundColor: (folder.color || accentColor) + '20' }]}>
                    <Folder size={20} color={folder.color || accentColor} />
                  </View>

                  <View style={styles.folderMainInfo}>
                    <Text style={[styles.folderName, { color: themeColors.textPrimary }]}>{folder.name}</Text>
                    <Text style={[styles.folderCount, { color: themeColors.textMuted }]}>
                      {count} {count === 1 ? 'note' : 'notes'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteFolderBtn}
                    onPress={(e: any) => {
                      e.stopPropagation();
                      onDeleteFolder(folder.id);
                    }}
                  >
                    <Trash2 size={16} color={themeColors.textMuted} />
                  </TouchableOpacity>
                  <ChevronRight size={18} color={themeColors.textMuted} />
                </TouchableOpacity>

                {/* Render Nested Subfolders */}
                {subFolders.length > 0 && (
                  <View style={styles.subFoldersList}>
                    {subFolders.map(sub => {
                      const subCount = notes.filter(n => n.folderId === sub.id && !n.inTrash).length;
                      return (
                        <TouchableOpacity
                          key={sub.id}
                          style={[
                            styles.subFolderItem,
                            { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder },
                          ]}
                          onPress={() => {
                            onSelectFolder(sub.id);
                            setActiveScreen('home');
                          }}
                        >
                          <Folder size={16} color={sub.color || accentColor} />
                          <Text style={[styles.subFolderName, { color: themeColors.textPrimary }]}>{sub.name}</Text>
                          <Text style={[styles.folderCount, { color: themeColors.textMuted }]}>{subCount} notes</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  addFolderHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addFolderHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  createCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 14,
    outlineStyle: 'none',
  } as any,
  colorPickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyFolderState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyFolderTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyFolderSub: {
    fontSize: 13,
    marginTop: 4,
  },
  folderGroup: {
    marginBottom: 12,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  folderIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderMainInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 15,
    fontWeight: '700',
  },
  folderCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteFolderBtn: {
    padding: 6,
  },
  subFoldersList: {
    marginLeft: 24,
    marginTop: 6,
    gap: 6,
  },
  subFolderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  subFolderName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
});

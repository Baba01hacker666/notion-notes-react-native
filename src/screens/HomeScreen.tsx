import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FileText, Pin, Trash2, Plus, Folder } from 'lucide-react';
import { Note, Folder as FolderType, SmartFilterType, ActiveScreen } from '../types';
import { ThemeColors } from '../theme/colors';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteFilterBar } from '../components/notes/NoteFilterBar';
import { NoteCardSkeleton } from '../components/common/Skeleton';

interface HomeScreenProps {
  notes: Note[];
  filteredNotes: Note[];
  pinnedNotes: Note[];
  otherNotes: Note[];
  folders: FolderType[];
  themeColors: ThemeColors;
  accentColor: string;
  viewMode: 'grid' | 'list';
  activeFilter: SmartFilterType;
  setActiveFilter: (filter: SmartFilterType) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleTrash: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  onEmptyTrash: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  isLoading?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  notes,
  filteredNotes,
  pinnedNotes,
  otherNotes,
  folders,
  themeColors,
  accentColor,
  viewMode,
  activeFilter,
  setActiveFilter,
  selectedFolderId,
  setSelectedFolderId,
  onSelectNote,
  onCreateNote,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onToggleTrash,
  onDeletePermanently,
  onEmptyTrash,
  setActiveScreen: _setActiveScreen,
  isLoading = false,
}) => {
  const counts: Record<SmartFilterType, number> = {
    all: notes.filter(n => !n.inTrash && !n.isArchived).length,
    favorites: notes.filter(n => n.isFavorite && !n.inTrash).length,
    pinned: notes.filter(n => n.isPinned && !n.inTrash).length,
    archived: notes.filter(n => n.isArchived && !n.inTrash).length,
    trash: notes.filter(n => n.inTrash).length,
    recent: notes.length,
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Smart Filter Pills */}
      <NoteFilterBar
        themeColors={themeColors}
        accentColor={accentColor}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {/* Selected Folder Banner */}
      {selectedFolder && (
        <View style={[styles.folderBanner, { backgroundColor: accentColor + '15', borderColor: accentColor + '30' }]}>
          <View style={styles.folderBannerLeft}>
            <Folder size={16} color={selectedFolder.color || accentColor} />
            <Text style={[styles.folderBannerTitle, { color: themeColors.textPrimary }]}>
              Folder: {selectedFolder.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedFolderId(null)}>
            <Text style={[styles.clearFolderText, { color: accentColor }]}>Show All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Trash Header with Empty Trash Button */}
      {activeFilter === 'trash' && counts.trash > 0 && (
        <View style={styles.trashBanner}>
          <Text style={[styles.trashBannerText, { color: themeColors.textMuted }]}>
            Notes in trash will remain until permanently deleted
          </Text>
          <TouchableOpacity style={[styles.emptyTrashBtn, { backgroundColor: '#ef4444' }]} onPress={onEmptyTrash}>
            <Trash2 size={13} color="#ffffff" />
            <Text style={styles.emptyTrashText}>Empty Trash</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <>
            <NoteCardSkeleton themeColors={themeColors} />
            <NoteCardSkeleton themeColors={themeColors} />
            <NoteCardSkeleton themeColors={themeColors} />
          </>
        ) : filteredNotes.length === 0 ? (
          /* Empty State Illustration */
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyIllustrationBg, { backgroundColor: accentColor + '15' }]}>
              <FileText size={48} color={accentColor} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: themeColors.textPrimary }]}>
              {activeFilter === 'trash'
                ? 'Trash is empty'
                : activeFilter === 'archived'
                ? 'No archived notes'
                : activeFilter === 'favorites'
                ? 'No favorite notes'
                : activeFilter === 'pinned'
                ? 'No pinned notes'
                : 'No notes found'}
            </Text>
            <Text style={[styles.emptyStateSubtitle, { color: themeColors.textMuted }]}>
              {activeFilter === 'trash'
                ? 'Deleted notes will appear here.'
                : activeFilter === 'archived'
                ? 'Notes you archive will appear here.'
                : activeFilter === 'favorites'
                ? 'Heart notes to add them to your favorites.'
                : activeFilter === 'pinned'
                ? 'Pin important notes to access them quickly.'
                : 'Create your first note to capture ideas, code snippets, or checklists.'}
            </Text>
            {activeFilter === 'all' && (
              <TouchableOpacity
                style={[styles.createFirstNoteBtn, { backgroundColor: accentColor }]}
                onPress={onCreateNote}
                activeOpacity={0.85}
              >
                <Plus size={18} color="#ffffff" />
                <Text style={styles.createBtnText}>Create New Note</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {/* When viewing 'All Notes' dashboard, organize into PINNED and OTHERS */}
            {activeFilter === 'all' && !selectedFolderId ? (
              <>
                {/* Pinned Section */}
                {pinnedNotes.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                      <Pin size={14} color={accentColor} fill={accentColor} />
                      <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>PINNED NOTES</Text>
                    </View>

                    <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
                      {pinnedNotes.map(note => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          folder={folders.find(f => f.id === note.folderId)}
                          themeColors={themeColors}
                          accentColor={accentColor}
                          viewMode={viewMode}
                          onPress={() => onSelectNote(note)}
                          onTogglePin={() => onTogglePin(note.id)}
                          onToggleFavorite={() => onToggleFavorite(note.id)}
                          onToggleArchive={() => onToggleArchive(note.id)}
                          onToggleTrash={() => onToggleTrash(note.id)}
                          onDeletePermanently={() => onDeletePermanently(note.id)}
                        />
                      ))}
                    </View>
                  </View>
                )}

                {/* Other Notes Section */}
                {otherNotes.length > 0 && (
                  <View style={styles.sectionHeader}>
                    {pinnedNotes.length > 0 && (
                      <Text style={[styles.sectionTitle, { color: themeColors.textMuted, marginTop: 8 }]}>OTHERS</Text>
                    )}

                    <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
                      {otherNotes.map(note => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          folder={folders.find(f => f.id === note.folderId)}
                          themeColors={themeColors}
                          accentColor={accentColor}
                          viewMode={viewMode}
                          onPress={() => onSelectNote(note)}
                          onTogglePin={() => onTogglePin(note.id)}
                          onToggleFavorite={() => onToggleFavorite(note.id)}
                          onToggleArchive={() => onToggleArchive(note.id)}
                          onToggleTrash={() => onToggleTrash(note.id)}
                          onDeletePermanently={() => onDeletePermanently(note.id)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </>
            ) : (
              /* When filtering by Favorites, Pinned, Archived, Trash, or Folder, show ALL matching notes */
              <View style={styles.sectionHeader}>
                <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
                  {filteredNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      folder={folders.find(f => f.id === note.folderId)}
                      themeColors={themeColors}
                      accentColor={accentColor}
                      viewMode={viewMode}
                      onPress={() => onSelectNote(note)}
                      onTogglePin={() => onTogglePin(note.id)}
                      onToggleFavorite={() => onToggleFavorite(note.id)}
                      onToggleArchive={() => onToggleArchive(note.id)}
                      onToggleTrash={() => onToggleTrash(note.id)}
                      onDeletePermanently={() => onDeletePermanently(note.id)}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  folderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  folderBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  folderBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  clearFolderText: {
    fontSize: 12,
    fontWeight: '700',
  },
  trashBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trashBannerText: {
    fontSize: 12,
    flex: 1,
  },
  emptyTrashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  emptyTrashText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listContainer: {
    flexDirection: 'column',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIllustrationBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
    marginBottom: 24,
  },
  createFirstNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

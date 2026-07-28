import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';

import { Header } from './components/common/Header';
import { FAB } from './components/common/FAB';
import { PinLockModal } from './components/security/PinLockModal';
import { CommandPalette } from './components/common/CommandPalette';

import { HomeScreen } from './screens/HomeScreen';
import { RichMarkdownEditor } from './components/editor/RichMarkdownEditor';
import { FoldersScreen } from './screens/FoldersScreen';
import { SettingsScreen } from './screens/SettingsScreen';

import { ActiveScreen } from './types';
import { triggerConfetti } from './utils/confetti';

export default function App() {
  const {
    notes,
    filteredNotes,
    pinnedNotes,
    otherNotes,
    folders,
    tags,
    activeNote,
    setActiveNoteId,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    selectedFolderId,
    setSelectedFolderId,
    createNote,
    updateNote,
    togglePinNote,
    toggleFavoriteNote,
    toggleArchiveNote,
    toggleTrashNote,
    deleteNotePermanently,
    emptyTrash,
    createFolder,
    deleteFolder,
    importNotes,
  } = useNotes();

  const {
    settings,
    themeColors,
    accentPalette,
    setTheme,
    setAccentColor,
    setFontSize,
    updateSettings,
  } = useTheme();

  const { isLocked, unlockApp, enablePinLock, disablePinLock } = useAuth(settings, updateSettings);

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(settings.defaultView);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const handleCreateNote = () => {
    triggerConfetti();
    createNote();
    setActiveScreen('editor');
  };

  const handleCreateChecklistNote = () => {
    const note = createNote(null, 'Task Checklist');
    updateNote(note.id, {
      content: `# Task Checklist\n\n- [ ] First task\n- [ ] Second task\n- [ ] Third task`,
    });
    setActiveScreen('editor');
  };

  const handleCreateDrawingNote = () => {
    createNote(null, 'Drawing Note');
    setActiveScreen('editor');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.appWrapper, { backgroundColor: themeColors.background }]}>
        {/* Security Lock Overlay */}
        {isLocked && (
          <PinLockModal
            themeColors={themeColors}
            accentColor={accentPalette.primary}
            onUnlock={unlockApp}
          />
        )}

        {/* Header - Shown on home, folders, settings */}
        {activeScreen !== 'editor' && (
          <Header
            themeColors={themeColors}
            accentColor={accentPalette.primary}
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            pinLockEnabled={settings.pinLockEnabled}
            totalNotesCount={notes.filter(n => !n.inTrash).length}
            onOpenCommandPalette={() => setShowCommandPalette(true)}
          />
        )}

        {/* Command Palette Modal */}
        <CommandPalette
          visible={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          notes={notes}
          folders={folders}
          themeColors={themeColors}
          accentColor={accentPalette.primary}
          onSelectNote={note => {
            setActiveNoteId(note.id);
            setActiveScreen('editor');
          }}
          onCreateNote={handleCreateNote}
          onCreateChecklistNote={handleCreateChecklistNote}
          onCreateDrawingNote={handleCreateDrawingNote}
          setActiveScreen={setActiveScreen}
          setTheme={setTheme}
          setAccentColor={setAccentColor}
        />

        {/* Screen Switcher */}
        <View style={styles.mainContent}>
          {activeScreen === 'home' && (
            <HomeScreen
              notes={notes}
              filteredNotes={filteredNotes}
              pinnedNotes={pinnedNotes}
              otherNotes={otherNotes}
              folders={folders}
              themeColors={themeColors}
              accentColor={accentPalette.primary}
              viewMode={viewMode}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={setSelectedFolderId}
              onSelectNote={note => {
                setActiveNoteId(note.id);
                setActiveScreen('editor');
              }}
              onCreateNote={handleCreateNote}
              onTogglePin={togglePinNote}
              onToggleFavorite={toggleFavoriteNote}
              onToggleArchive={toggleArchiveNote}
              onToggleTrash={toggleTrashNote}
              onDeletePermanently={deleteNotePermanently}
              onEmptyTrash={emptyTrash}
              setActiveScreen={setActiveScreen}
            />
          )}

          {activeScreen === 'editor' && activeNote && (
            <RichMarkdownEditor
              note={activeNote}
              folders={folders}
              tags={tags}
              themeColors={themeColors}
              accentColor={accentPalette.primary}
              onBack={() => setActiveScreen('home')}
              onUpdateNote={updateNote}
              onTogglePin={togglePinNote}
              onToggleFavorite={toggleFavoriteNote}
              onToggleArchive={toggleArchiveNote}
              onToggleTrash={toggleTrashNote}
            />
          )}

          {activeScreen === 'folders' && (
            <FoldersScreen
              folders={folders}
              notes={notes}
              themeColors={themeColors}
              accentColor={accentPalette.primary}
              onSelectFolder={setSelectedFolderId}
              onCreateFolder={createFolder}
              onDeleteFolder={deleteFolder}
              setActiveScreen={setActiveScreen}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsScreen
              settings={settings}
              themeColors={themeColors}
              accentColor={accentPalette.primary}
              setTheme={setTheme}
              setAccentColor={setAccentColor}
              setFontSize={setFontSize}
              updateSettings={updateSettings}
              enablePinLock={enablePinLock}
              disablePinLock={disablePinLock}
              notes={notes}
              onImportNotes={importNotes}
              setActiveScreen={setActiveScreen}
            />
          )}
        </View>

        {/* Bottom Navigation Dock / Settings Trigger */}
        {activeScreen !== 'editor' && (
          <View style={[styles.bottomDock, { backgroundColor: themeColors.header, borderTopColor: themeColors.divider }]}>
            <FAB
              themeColors={themeColors}
              accentColor={accentPalette.primary}
              onCreateNote={handleCreateNote}
              onCreateChecklistNote={handleCreateChecklistNote}
              onCreateDrawingNote={handleCreateDrawingNote}
              onCreateFolder={() => setActiveScreen('folders')}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
  },
  bottomDock: {
    height: 0,
  },
});

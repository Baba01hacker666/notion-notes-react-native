import { useState, useEffect, useCallback, useMemo } from 'react';
import { Note, Folder, Tag, SmartFilterType } from '../types';
import { DEFAULT_NOTES, DEFAULT_FOLDERS, DEFAULT_TAGS } from '../constants/DefaultNotes';
import { mmkvStorage } from '../storage/MMKVStorage';
import { calculateStats } from '../utils/textUtils';
import { HapticsService } from '../services/HapticsService';

const STORAGE_KEYS = {
  NOTES: 'notion_app_notes_v1',
  FOLDERS: 'notion_app_folders_v1',
  TAGS: 'notion_app_tags_v1',
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = mmkvStorage.getMap<Note[]>(STORAGE_KEYS.NOTES);
    return saved && saved.length > 0 ? saved : DEFAULT_NOTES;
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = mmkvStorage.getMap<Folder[]>(STORAGE_KEYS.FOLDERS);
    return saved && saved.length > 0 ? saved : DEFAULT_FOLDERS;
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = mmkvStorage.getMap<Tag[]>(STORAGE_KEYS.TAGS);
    return saved && saved.length > 0 ? saved : DEFAULT_TAGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SmartFilterType>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Sync to MMKV storage whenever notes, folders, or tags change
  useEffect(() => {
    mmkvStorage.setMap(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  useEffect(() => {
    mmkvStorage.setMap(STORAGE_KEYS.FOLDERS, folders);
  }, [folders]);

  useEffect(() => {
    mmkvStorage.setMap(STORAGE_KEYS.TAGS, tags);
  }, [tags]);

  // Create a new Note
  const createNote = useCallback((folderId?: string | null, initialTitle?: string): Note => {
    HapticsService.trigger('medium');
    const now = Date.now();
    const title = initialTitle || 'Untitled Note';
    const content = `# ${title}\n\nStart typing here...`;
    const stats = calculateStats(content);

    const newNote: Note = {
      id: 'note_' + now + '_' + Math.random().toString(36).substr(2, 5),
      title,
      content,
      isPinned: false,
      isArchived: false,
      isFavorite: false,
      inTrash: false,
      folderId: folderId ?? selectedFolderId ?? null,
      tags: [],
      color: '#6366f1',
      createdAt: now,
      updatedAt: now,
      ...stats,
      checklist: [],
      drawings: [],
      voiceNotes: [],
      attachments: [],
    };

    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    return newNote;
  }, [selectedFolderId]);

  // Update existing note
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id !== id) return note;
        const now = Date.now();
        const updatedContent = updates.content !== undefined ? updates.content : note.content;
        const stats = updates.content !== undefined ? calculateStats(updatedContent) : {};

        return {
          ...note,
          ...updates,
          updatedAt: now,
          ...stats,
        };
      })
    );
  }, []);

  // Toggle Pin
  const togglePinNote = useCallback((id: string) => {
    HapticsService.trigger('light');
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n))
    );
  }, []);

  // Toggle Favorite
  const toggleFavoriteNote = useCallback((id: string) => {
    HapticsService.trigger('light');
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite, updatedAt: Date.now() } : n))
    );
  }, []);

  // Toggle Archive
  const toggleArchiveNote = useCallback((id: string) => {
    HapticsService.trigger('light');
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isArchived: !n.isArchived, updatedAt: Date.now() } : n))
    );
  }, []);

  // Move to Trash / Restore
  const toggleTrashNote = useCallback((id: string) => {
    HapticsService.trigger('warning');
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, inTrash: !n.inTrash, updatedAt: Date.now() } : n))
    );
  }, []);

  // Delete Permanently
  const deleteNotePermanently = useCallback((id: string) => {
    HapticsService.trigger('heavy');
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  }, [activeNoteId]);

  // Empty Trash
  const emptyTrash = useCallback(() => {
    HapticsService.trigger('heavy');
    setNotes(prev => prev.filter(n => !n.inTrash));
  }, []);

  // Create Folder
  const createFolder = useCallback((name: string, parentId: string | null = null, color: string = '#6366f1') => {
    HapticsService.trigger('light');
    const newFolder: Folder = {
      id: 'folder_' + Date.now(),
      name,
      parentId,
      color,
      createdAt: Date.now(),
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, []);

  // Delete Folder
  const deleteFolder = useCallback((id: string) => {
    HapticsService.trigger('warning');
    setFolders(prev => prev.filter(f => f.id !== id));
    // Reset folderId on notes in this folder
    setNotes(prev => prev.map(n => (n.folderId === id ? { ...n, folderId: null } : n)));
    if (selectedFolderId === id) setSelectedFolderId(null);
  }, [selectedFolderId]);

  // Create Tag
  const createTag = useCallback((name: string, color: string = '#10b981') => {
    HapticsService.trigger('light');
    const newTag: Tag = {
      id: 'tag_' + Date.now(),
      name,
      color,
    };
    setTags(prev => [...prev, newTag]);
    return newTag;
  }, []);

  // Filtered notes calculation
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Trash filtering
      if (activeFilter === 'trash') {
        if (!note.inTrash) return false;
      } else {
        if (note.inTrash) return false;
      }

      // Archive filtering
      if (activeFilter === 'archived') {
        if (!note.isArchived) return false;
      } else if (activeFilter !== 'trash') {
        if (note.isArchived) return false;
      }

      // Favorites filtering
      if (activeFilter === 'favorites' && !note.isFavorite) return false;

      // Pinned filtering
      if (activeFilter === 'pinned' && !note.isPinned) return false;

      // Folder filtering
      if (selectedFolderId && note.folderId !== selectedFolderId) return false;

      // Tag filtering
      if (selectedTag && (!note.tags || !note.tags.includes(selectedTag))) return false;

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = note.title.toLowerCase().includes(q);
        const matchesContent = note.content.toLowerCase().includes(q);
        const matchesTags = note.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTags) return false;
      }

      return true;
    });
  }, [notes, activeFilter, selectedFolderId, selectedTag, searchQuery]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(n => !n.isPinned), [filteredNotes]);

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId) || null, [notes, activeNoteId]);

  return {
    notes,
    filteredNotes,
    pinnedNotes,
    otherNotes,
    folders,
    tags,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    selectedFolderId,
    setSelectedFolderId,
    selectedTag,
    setSelectedTag,
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
    createTag,
    importNotes: (importedNotes: Note[]) => setNotes(importedNotes),
  };
}

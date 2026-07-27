export type AppThemeMode = 'light' | 'dark' | 'notion-dark' | 'cyberpunk' | 'material-you';

export type AccentColorKey = 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  icon?: string;
  color?: string;
  createdAt: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface DrawingData {
  id: string;
  svgPath: string;
  createdAt: number;
  thumbnailUrl?: string;
}

export interface VoiceNoteData {
  id: string;
  audioUrl?: string;
  durationSeconds: number;
  transcript?: string;
  createdAt: number;
}

export interface NoteAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  inTrash: boolean;
  folderId?: string | null;
  tags: string[]; // Tag names or IDs
  color?: string;
  createdAt: number;
  updatedAt: number;
  characterCount: number;
  wordCount: number;
  readingTimeMinutes: number;
  checklist?: ChecklistItem[];
  drawings?: DrawingData[];
  voiceNotes?: VoiceNoteData[];
  attachments?: NoteAttachment[];
}

export interface UserSettings {
  theme: AppThemeMode;
  accentColor: AccentColorKey;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  pinLockEnabled: boolean;
  pinHash?: string;
  biometricEnabled: boolean;
  localEncryption: boolean;
  autoSave: boolean;
  defaultView: 'grid' | 'list';
}

export type SmartFilterType = 'all' | 'favorites' | 'pinned' | 'archived' | 'trash' | 'recent';

export type ActiveScreen = 'home' | 'editor' | 'folders' | 'search' | 'favorites' | 'trash' | 'settings';

import { Note, Folder, Tag } from '../types';

export const DEFAULT_TAGS: Tag[] = [
  { id: 'tag-1', name: 'Work', color: '#6366f1' },
  { id: 'tag-2', name: 'Ideas', color: '#10b981' },
  { id: 'tag-3', name: 'Personal', color: '#f59e0b' },
  { id: 'tag-4', name: 'Code', color: '#8b5cf6' },
  { id: 'tag-5', name: 'Productivity', color: '#06b6d4' },
];

export const DEFAULT_FOLDERS: Folder[] = [
  { id: 'folder-1', name: '🚀 Projects', parentId: null, color: '#6366f1', createdAt: Date.now() - 1000000 },
  { id: 'folder-2', name: '🧠 Brainstorming', parentId: null, color: '#10b981', createdAt: Date.now() - 900000 },
  { id: 'folder-3', name: '📚 Reading & Research', parentId: null, color: '#f59e0b', createdAt: Date.now() - 800000 },
  { id: 'folder-4', name: '💻 System Architecture', parentId: 'folder-1', color: '#8b5cf6', createdAt: Date.now() - 700000 },
];

export const DEFAULT_NOTES: Note[] = [
  {
    id: 'note-welcome',
    title: '✨ Welcome to Notion Notes Native',
    content: `# Welcome to Notion Notes! 🚀

A high-performance, **Hermes-powered** notes application designed with sleek dark aesthetics, instant search, rich formatting, and offline-first storage.

## Key Highlights

- **Fast Startup & 60 FPS Animations**: Powered by Hermes & Reanimated.
- **Rich Content Support**: Markdown, Code blocks, Checklists, Drawings, and Voice Notes.
- **Offline First**: All data stored locally using MMKV abstraction.
- **Security**: Local PIN code & Biometric lock support.

> "Simplicity is prerequisite for reliability." – Edsger W. Dijkstra

### Interactive Checklist

- [x] Create project setup
- [x] Configure Hermes & Reanimated
- [ ] Try creating your first note
- [ ] Export note as PDF or Markdown
- [ ] Customize app theme in Settings

\`\`\`typescript
// Hermes JS Engine Status Check
const isHermesEnabled = () => !!(global as any).HermesInternal;
console.log('Hermes Engine Running:', isHermesEnabled());
\`\`\`
`,
    isPinned: true,
    isArchived: false,
    isFavorite: true,
    inTrash: false,
    folderId: 'folder-1',
    tags: ['Productivity', 'Work'],
    color: '#6366f1',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
    characterCount: 620,
    wordCount: 88,
    readingTimeMinutes: 1,
    checklist: [
      { id: 'c1', text: 'Create project setup', completed: true },
      { id: 'c2', text: 'Configure Hermes & Reanimated', completed: true },
      { id: 'c3', text: 'Try creating your first note', completed: false },
      { id: 'c4', text: 'Export note as PDF or Markdown', completed: false },
    ],
  },
  {
    id: 'note-architecture',
    title: '⚡ React Native Hermes & Performance Tuning',
    content: `# React Native Hermes Engine & Performance Guide

Hermes is an open-source JavaScript engine optimized for React Native.

## Benefits of Hermes:
1. **Faster App Launch Time**: Pre-compiled bytecode reduces execution latency.
2. **Reduced APK Size**: Hermes binaries are compact.
3. **Decreased Memory Footprint**: Efficient garbage collector.

| Feature | Standard V8 / JSC | Hermes |
|---|---|---|
| Bytecode | Runtime Compilation | AOT Pre-compiled |
| TTI (Time to Interactive) | ~1.8s | ~0.6s |
| Memory Usage | 120MB | 68MB |

\`\`\`json
{
  "expo": {
    "jsEngine": "hermes"
  }
}
\`\`\`
`,
    isPinned: true,
    isArchived: false,
    isFavorite: true,
    inTrash: false,
    folderId: 'folder-4',
    tags: ['Code', 'Work'],
    color: '#8b5cf6',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 43200000,
    characterCount: 520,
    wordCount: 75,
    readingTimeMinutes: 1,
  },
  {
    id: 'note-ideas',
    title: '💡 Product Feature Ideas 2026',
    content: `# Product Roadmap & Feature Ideas

### Upcoming Modules
- [ ] AI-assisted note summarization
- [ ] Infinite spatial canvas support
- [ ] Peer-to-peer end-to-end encrypted backup
- [ ] Custom Notion-style slash commands (\`/table\`, \`/code\`)

\`\`\`bash
# Local backup command
npm run export:json --out ./backups
\`\`\`
`,
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    inTrash: false,
    folderId: 'folder-2',
    tags: ['Ideas', 'Productivity'],
    color: '#10b981',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 86400000,
    characterCount: 290,
    wordCount: 40,
    readingTimeMinutes: 1,
  },
];

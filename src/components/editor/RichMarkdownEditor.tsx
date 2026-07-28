import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  CheckSquare,
  Code,
  Quote,
  Table as TableIcon,
  Image as ImageIcon,
  PenTool,
  Mic,
  Eye,
  Edit3,
  Folder as FolderIcon,
  Tag as TagIcon,
  Sparkles,
  FileText,
  Download,
  Heart,
  Pin,
  Archive,
} from 'lucide-react';
import { Note, Folder, Tag } from '../../types';
import { ThemeColors } from '../../theme/colors';
import { DrawingCanvas } from './DrawingCanvas';
import { VoiceRecorder } from './VoiceRecorder';
import { ExportService } from '../../services/ExportService';
import { calculateStats } from '../../utils/textUtils';
import { HapticsService } from '../../services/HapticsService';

interface RichMarkdownEditorProps {
  note: Note;
  folders: Folder[];
  tags: Tag[];
  themeColors: ThemeColors;
  accentColor: string;
  onBack: () => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleTrash: (id: string) => void;
}

export const RichMarkdownEditor: React.FC<RichMarkdownEditorProps> = ({
  note,
  folders,
  tags: _tags,
  themeColors,
  accentColor,
  onBack,
  onUpdateNote,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onToggleTrash: _onToggleTrash,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Auto save when title or content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdateNote(note.id, {
        title,
        content,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [title, content, note.id, onUpdateNote]);

  const insertTextAtCursor = (insertion: string) => {
    HapticsService.trigger('light');
    setContent(prev => prev + '\n' + insertion);
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const tagText = newTagInput.trim();
      const currentTags = note.tags || [];
      if (!currentTags.includes(tagText)) {
        onUpdateNote(note.id, { tags: [...currentTags, tagText] });
      }
      setNewTagInput('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateNote(note.id, {
      tags: (note.tags || []).filter(t => t !== tagToRemove),
    });
  };

  const currentFolder = folders.find(f => f.id === note.folderId);
  const stats = calculateStats(content);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Top Navbar */}
      <View style={[styles.navbar, { backgroundColor: themeColors.header, borderBottomColor: themeColors.divider }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={[styles.navTitle, { color: themeColors.textPrimary }]} numberOfLines={1}>
            {title || 'Untitled Note'}
          </Text>

          {/* Folder Picker Badge */}
          <View style={[styles.folderSelector, { backgroundColor: themeColors.badgeBg }]}>
            <FolderIcon size={12} color={currentFolder?.color || accentColor} />
            <Text style={[styles.folderNameText, { color: themeColors.textSecondary }]}>
              {currentFolder ? currentFolder.name : 'No Folder'}
            </Text>
          </View>
        </View>

        <View style={styles.navActions}>
          <TouchableOpacity onPress={() => onToggleFavorite(note.id)} style={styles.actionIconBtn}>
            <Heart
              size={18}
              color={note.isFavorite ? '#ef4444' : themeColors.textMuted}
              fill={note.isFavorite ? '#ef4444' : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onTogglePin(note.id)} style={styles.actionIconBtn}>
            <Pin
              size={18}
              color={note.isPinned ? accentColor : themeColors.textMuted}
              fill={note.isPinned ? accentColor : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onToggleArchive(note.id)} style={styles.actionIconBtn}>
            <Archive
              size={18}
              color={note.isArchived ? accentColor : themeColors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewToggleBtn, { backgroundColor: isPreviewMode ? accentColor : themeColors.badgeBg }]}
            onPress={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <Edit3 size={15} color="#ffffff" />
                <Text style={styles.toggleText}>Edit</Text>
              </>
            ) : (
              <>
                <Eye size={15} color={themeColors.textSecondary} />
                <Text style={[styles.toggleText, { color: themeColors.textSecondary }]}>Preview</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionIconBtn, { backgroundColor: themeColors.badgeBg }]}
            onPress={() => setShowExportMenu(!showExportMenu)}
          >
            <Download size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Export Options Dropdown */}
      {showExportMenu && (
        <View style={[styles.exportMenu, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
          <Text style={[styles.exportHeader, { color: themeColors.textMuted }]}>EXPORT NOTE</Text>
          <TouchableOpacity
            style={styles.exportItem}
            onPress={() => {
              ExportService.downloadFile(ExportService.exportAsMarkdown(note), `${title}.md`, 'text/markdown');
              setShowExportMenu(false);
            }}
          >
            <FileText size={16} color={accentColor} />
            <Text style={[styles.exportItemText, { color: themeColors.textPrimary }]}>Export as Markdown (.md)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportItem}
            onPress={() => {
              ExportService.printOrSavePDF(note);
              setShowExportMenu(false);
            }}
          >
            <Sparkles size={16} color="#8b5cf6" />
            <Text style={[styles.exportItemText, { color: themeColors.textPrimary }]}>Export as PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportItem}
            onPress={() => {
              ExportService.downloadFile(ExportService.exportAsHTML(note), `${title}.html`, 'text/html');
              setShowExportMenu(false);
            }}
          >
            <Code size={16} color="#10b981" />
            <Text style={[styles.exportItemText, { color: themeColors.textPrimary }]}>Export as HTML</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportItem}
            onPress={() => {
              ExportService.downloadFile(ExportService.exportAsTXT(note), `${title}.txt`, 'text/plain');
              setShowExportMenu(false);
            }}
          >
            <FileText size={16} color="#f59e0b" />
            <Text style={[styles.exportItemText, { color: themeColors.textPrimary }]}>Export as Plain Text (.txt)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Formatting Toolbar */}
      {!isPreviewMode && (
        <View style={[styles.toolbar, { backgroundColor: themeColors.card, borderBottomColor: themeColors.divider }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarScroll}>
            <TouchableOpacity style={styles.toolBtn} onPress={() => insertTextAtCursor('# Header 1')}>
              <Text style={[styles.toolBtnText, { color: themeColors.textPrimary, fontWeight: '800' }]}>H1</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => insertTextAtCursor('## Header 2')}>
              <Text style={[styles.toolBtnText, { color: themeColors.textPrimary, fontWeight: '700' }]}>H2</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => insertTextAtCursor('**bold text**')}>
              <Bold size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => insertTextAtCursor('*italic text*')}>
              <Italic size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => insertTextAtCursor('- [ ] New checklist item')}>
              <CheckSquare size={16} color="#10b981" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => insertTextAtCursor('- Bullet point item')}>
              <List size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolBtn}
              onPress={() => insertTextAtCursor('```typescript\nconst greeting = "Hello Notion!";\n```')}
            >
              <Code size={16} color="#8b5cf6" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => insertTextAtCursor('> "Important quote or insight."')}>
              <Quote size={16} color="#f59e0b" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolBtn}
              onPress={() => insertTextAtCursor('| Feature | Status |\n|---|---|\n| Hermes | Enabled |')}
            >
              <TableIcon size={16} color="#06b6d4" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolBtn}
              onPress={() => insertTextAtCursor('![Image](https://images.unsplash.com/photo-1517842645767-c639042777db)')}
            >
              <ImageIcon size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => setShowDrawingModal(!showDrawingModal)}>
              <PenTool size={16} color={accentColor} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={() => setShowVoiceRecorder(!showVoiceRecorder)}>
              <Mic size={16} color="#ef4444" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Editor Main Content Scroll */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.editorContent}>
        {/* Drawing Modal */}
        {showDrawingModal && (
          <DrawingCanvas
            themeColors={themeColors}
            accentColor={accentColor}
            onSave={svgPath => {
              insertTextAtCursor(`![Drawing](${svgPath})`);
              setShowDrawingModal(false);
            }}
            onClose={() => setShowDrawingModal(false)}
          />
        )}

        {/* Voice Recorder Modal */}
        {showVoiceRecorder && (
          <VoiceRecorder
            themeColors={themeColors}
            accentColor={accentColor}
            onSaveVoiceNote={(duration, transcript) => {
              insertTextAtCursor(`> 🎙️ **Voice Note** (${duration}s): ${transcript}`);
              setShowVoiceRecorder(false);
            }}
            onClose={() => setShowVoiceRecorder(false)}
          />
        )}

        {/* Decorative Cover Gradient Accent Bar */}
        <View style={[styles.coverAccentBar, { backgroundColor: accentColor }]} />

        {/* Title Input */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Untitled Note"
          placeholderTextColor={themeColors.textMuted}
          style={[styles.titleInput, { color: themeColors.textPrimary }]}
          editable={!isPreviewMode}
        />

        {/* Tags Row */}
        <View style={styles.tagsContainer}>
          {(note.tags || []).map((tag, idx) => (
            <View key={idx} style={[styles.tagBadge, { backgroundColor: accentColor + '20' }]}>
              <TagIcon size={11} color={accentColor} />
              <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
              {!isPreviewMode && (
                <TouchableOpacity onPress={() => handleRemoveTag(tag)} style={styles.removeTagBtn}>
                  <Text style={{ color: accentColor, fontSize: 11, fontWeight: '700' }}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {!isPreviewMode && (
            showTagInput ? (
              <View style={[styles.tagInputWrapper, { backgroundColor: themeColors.inputBg }]}>
                <TextInput
                  value={newTagInput}
                  onChangeText={setNewTagInput}
                  onSubmitEditing={handleAddTag}
                  placeholder="Tag name..."
                  placeholderTextColor={themeColors.textMuted}
                  style={[styles.tagInput, { color: themeColors.textPrimary }]}
                  autoFocus
                />
                <TouchableOpacity onPress={handleAddTag}>
                  <Text style={{ color: accentColor, fontWeight: '700', fontSize: 12 }}>Add</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.addTagBtn, { backgroundColor: themeColors.badgeBg }]}
                onPress={() => setShowTagInput(true)}
              >
                <Text style={[styles.addTagText, { color: themeColors.textSecondary }]}>+ Tag</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Content Body Editor or Live Markdown Preview */}
        {isPreviewMode ? (
          <View style={[styles.previewArea, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
            <Text style={[styles.previewContent, { color: themeColors.textPrimary }]}>{content}</Text>
          </View>
        ) : (
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Start typing your note in Markdown..."
            placeholderTextColor={themeColors.textMuted}
            multiline
            style={[styles.contentInput, { color: themeColors.textPrimary }]}
            textAlignVertical="top"
          />
        )}
      </ScrollView>

      {/* Footer Word Count & Stats Bar */}
      <View style={[styles.footerBar, { backgroundColor: themeColors.header, borderTopColor: themeColors.divider }]}>
        <Text style={[styles.statText, { color: themeColors.textMuted }]}>
          {stats.wordCount} words • {stats.characterCount} characters • {stats.readingTimeMinutes} min read
        </Text>
        <Text style={[styles.autoSaveText, { color: accentColor }]}>Auto-saved locally</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
  },
  navTitleContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  folderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  folderNameText: {
    fontSize: 11,
    fontWeight: '600',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  previewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  exportMenu: {
    position: 'absolute',
    top: 54,
    right: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 220,
  },
  exportHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  exportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exportItemText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toolbar: {
    borderBottomWidth: 1,
    paddingVertical: 6,
  },
  toolbarScroll: {
    paddingHorizontal: 12,
    gap: 6,
    alignItems: 'center',
  },
  toolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnText: {
    fontSize: 13,
  },
  scrollArea: {
    flex: 1,
  },
  editorContent: {
    padding: 16,
    minHeight: '100%',
  },
  coverAccentBar: {
    height: 4,
    width: 60,
    borderRadius: 2,
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
    outlineStyle: 'none',
  } as any,
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  removeTagBtn: {
    marginLeft: 2,
  },
  addTagBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagInput: {
    fontSize: 12,
    padding: 0,
    width: 80,
    outlineStyle: 'none',
  } as any,
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 400,
    fontFamily: 'Inter, sans-serif',
    outlineStyle: 'none',
  } as any,
  previewArea: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 400,
  },
  previewContent: {
    fontSize: 15,
    lineHeight: 24,
    whiteSpace: 'pre-wrap',
  } as any,
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  autoSaveText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

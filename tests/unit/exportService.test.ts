import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ExportService } from '../../src/services/ExportService';
import type { Note } from '../../src/types';

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'note_1',
  title: 'Meeting Notes',
  content: '# Agenda\n\n- [x] Review roadmap',
  isPinned: false,
  isArchived: false,
  isFavorite: false,
  inTrash: false,
  folderId: null,
  tags: ['work', 'planning'],
  color: '#6366f1',
  createdAt: 1700000000000,
  updatedAt: 1700000100000,
  characterCount: 30,
  wordCount: 6,
  readingTimeMinutes: 1,
  checklist: [],
  drawings: [],
  voiceNotes: [],
  attachments: [],
  ...overrides,
});

test('exportAsMarkdown includes title, content, and tags', () => {
  const md = ExportService.exportAsMarkdown(makeNote());
  assert.ok(md.startsWith('# Meeting Notes'));
  assert.ok(md.includes('**Tags:** work, planning'));
  assert.ok(md.includes('- [x] Review roadmap'));
});

test('exportAsTXT includes title separator and content', () => {
  const txt = ExportService.exportAsTXT(makeNote());
  assert.ok(txt.startsWith('Meeting Notes\n'));
  assert.ok(txt.includes('======'));
  assert.ok(txt.includes('Agenda'));
});

test('exportAsJSON round-trips the full array', () => {
  const notes = [makeNote(), makeNote({ id: 'note_2', title: 'Ideas' })];
  const json = ExportService.exportAsJSON(notes);
  const parsed = JSON.parse(json);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[1].title, 'Ideas');
});

test('exportAsHTML embeds the title and content', () => {
  const html = ExportService.exportAsHTML(makeNote());
  assert.ok(html.includes('<title>Meeting Notes</title>'));
  assert.ok(html.includes('Review roadmap'));
});

test('exportAsMarkdown escapes nothing and keeps raw markdown content', () => {
  const note = makeNote({ content: '**bold** and `code`' });
  const md = ExportService.exportAsMarkdown(note);
  assert.ok(md.includes('**bold** and `code`'));
});

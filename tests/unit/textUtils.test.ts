import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStats, extractHeader } from '../../src/utils/textUtils';

test('calculateStats counts characters, words, and reading time', () => {
  const stats = calculateStats('hello world');
  assert.equal(stats.characterCount, 11);
  assert.equal(stats.wordCount, 2);
  assert.equal(stats.readingTimeMinutes, 1);
});

test('calculateStats returns zeros for empty input', () => {
  const stats = calculateStats('   ');
  assert.equal(stats.characterCount, 0);
  assert.equal(stats.wordCount, 0);
  assert.equal(stats.readingTimeMinutes, 1);
});

test('calculateStats reading time scales with word count', () => {
  const words = Array(400).fill('word').join(' ');
  const stats = calculateStats(words);
  assert.equal(stats.wordCount, 400);
  assert.equal(stats.readingTimeMinutes, 2);
});

test('calculateStats handles multiple spaces and newlines', () => {
  const stats = calculateStats('one\n\ntwo   three');
  assert.equal(stats.wordCount, 3);
});

test('extractHeader pulls title from "# " heading', () => {
  const { title, body } = extractHeader('# My Title\n\nSome body text.');
  assert.equal(title, 'My Title');
  assert.ok(body.includes('Some body text.'));
});

test('extractHeader falls back to first line when no heading', () => {
  const { title } = extractHeader('Just a title-ish line\nmore text');
  assert.equal(title, 'Just a title-ish line');
});

test('extractHeader defaults to Untitled Note for empty input', () => {
  const { title } = extractHeader('');
  assert.equal(title, 'Untitled Note');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatRelativeTime, formatFullDate } from '../../src/utils/dateUtils';

const now = () => Date.now();

test('formatRelativeTime: just now under 30s', () => {
  assert.equal(formatRelativeTime(now() - 15_000), 'Just now');
});

test('formatRelativeTime: seconds ago', () => {
  assert.equal(formatRelativeTime(now() - 45_000), '45s ago');
});

test('formatRelativeTime: minutes ago', () => {
  assert.equal(formatRelativeTime(now() - 5 * 60_000), '5m ago');
});

test('formatRelativeTime: hours ago', () => {
  assert.equal(formatRelativeTime(now() - 3 * 3_600_000), '3h ago');
});

test('formatRelativeTime: yesterday', () => {
  assert.equal(formatRelativeTime(now() - 24 * 3_600_000), 'Yesterday');
});

test('formatRelativeTime: days ago', () => {
  assert.equal(formatRelativeTime(now() - 4 * 24 * 3_600_000), '4d ago');
});

test('formatRelativeTime: older dates render a short locale date', () => {
  const older = now() - 30 * 24 * 3_600_000;
  const result = formatRelativeTime(older);
  assert.ok(!result.includes('ago'), `expected a date string, got "${result}"`);
  assert.ok(result.length > 0);
});

test('formatFullDate returns a non-empty formatted string', () => {
  const result = formatFullDate(now());
  assert.ok(typeof result === 'string' && result.length > 0);
  assert.ok(result.includes(new Date(now()).getFullYear().toString()));
});

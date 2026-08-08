import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SecurityService } from '../../src/services/SecurityService';

test('hashPin is stable for the same pin', () => {
  assert.equal(SecurityService.hashPin('1234'), SecurityService.hashPin('1234'));
});

test('hashPin differs between pins', () => {
  assert.notEqual(SecurityService.hashPin('1234'), SecurityService.hashPin('4321'));
});

test('verifyPin accepts the correct pin', () => {
  const hash = SecurityService.hashPin('5678');
  assert.equal(SecurityService.verifyPin('5678', hash), true);
});

test('verifyPin rejects an incorrect pin', () => {
  const hash = SecurityService.hashPin('5678');
  assert.equal(SecurityService.verifyPin('1111', hash), false);
});

test('encryptText/decryptText round-trips content', () => {
  const original = 'My secret note #1 with symbols: á é 漢字 🚀';
  const encrypted = SecurityService.encryptText(original);
  assert.notEqual(encrypted, original);
  assert.equal(SecurityService.decryptText(encrypted), original);
});

test('decryptText fails gracefully on garbage input', () => {
  assert.equal(SecurityService.decryptText('not-base64!!!'), 'not-base64!!!');
});

test('encryptText output is standard base64 (ASCII, padded)', () => {
  const encrypted = SecurityService.encryptText('hello');
  assert.match(encrypted, /^[A-Za-z0-9+/]+={0,2}$/);
});

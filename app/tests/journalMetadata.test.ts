import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTags } from '../src/utils/journalMetadata';

test('normalizeTags trims whitespace and removes empty values', () => {
  assert.deepEqual(normalizeTags('  سفر ,  خانوادگی  , ,   صمیمی  '), ['سفر', 'خانوادگی', 'صمیمی']);
});

test('normalizeTags returns empty array for blank input', () => {
  assert.deepEqual(normalizeTags('   ,  '), []);
});

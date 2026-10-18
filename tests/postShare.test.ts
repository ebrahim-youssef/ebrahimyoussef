import { describe, expect, test } from 'vitest';
import { chooseCopyFallback, chooseShareFallback } from '../src/scripts/postShare';

describe('post share fallback decisions', () => {
  test('does nothing when native sharing is cancelled', () => {
    expect(chooseShareFallback({ name: 'AbortError' })).toBe('cancel');
  });

  test('falls through to copying after another native share error', () => {
    expect(chooseShareFallback(new Error('share failed'))).toBe('copy');
  });

  test('reveals the URL field when copying fails', () => {
    expect(chooseCopyFallback('unavailable')).toBe('reveal-url');
  });
});

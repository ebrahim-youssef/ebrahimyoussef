import { describe, expect, test } from 'vitest';
import { outcomeFor } from '../src/scripts/contactForm';

describe('contact form response outcomes', () => {
  test('treats a successful response as sent', () => {
    expect(outcomeFor(200, { ok: true })).toBe('sent');
  });

  test('treats a field response as field', () => {
    expect(outcomeFor(400, { ok: false, field: 'message' })).toBe('field');
  });

  test('rejects an unknown field response', () => {
    expect(outcomeFor(400, { ok: false, field: 'website' })).toBe('failed');
  });

  test('treats every other response as failed', () => {
    expect(outcomeFor(503, { ok: false })).toBe('failed');
    expect(outcomeFor(200, { ok: false })).toBe('failed');
    expect(outcomeFor(400, null)).toBe('failed');
  });
});

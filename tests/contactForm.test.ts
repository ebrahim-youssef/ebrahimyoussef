import { describe, expect, test } from 'vitest';
import { outcomeFor, validateContactForm } from '../src/scripts/contactForm';

function makeForm(contact: string): HTMLFormElement {
  const inputs = new Map([
    ['name', { value: 'Visitor', setAttribute: () => undefined, focus: () => undefined }],
    ['contact', { value: contact, setAttribute: () => undefined, focus: () => undefined }],
    ['message', { value: 'A message', setAttribute: () => undefined, focus: () => undefined }],
  ]);
  const errors = new Map([['contact', { textContent: '' }]]);

  return {
    elements: { namedItem: (name: string) => inputs.get(name) },
    querySelector: (selector: string) => (selector === '#e-contact' ? errors.get('contact') : null),
    dataset: { errorContact: 'Enter a valid contact.' },
  } as unknown as HTMLFormElement;
}

describe('contact form response outcomes', () => {
  test('rejects a gibberish contact before submission', () => {
    const form = makeForm('hello');

    expect(validateContactForm(form)).toBe(false);
  });

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

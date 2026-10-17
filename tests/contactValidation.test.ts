import { describe, expect, test } from 'vitest';
import { classifyContact } from '../worker/contactValidation.js';

describe('classifyContact', () => {
  test.each(['visitor@example.com', ' visitor@example.co.uk '])('classifies %s as an email', (value) => {
    expect(classifyContact(value)).toEqual({ kind: 'email', address: value.trim() });
  });

  test.each([
    ['+20 100 123 4567', '201001234567'],
    ['0020-100-123-4567', '201001234567'],
    ['(+971) 50 123 4567', '971501234567'],
  ])('classifies %s as a WhatsApp number', (value, digits) => {
    expect(classifyContact(value)).toEqual({ kind: 'whatsapp', digits });
  });

  test.each(['01001234567', 'hello', 'abc@def', '+12 34', '+1234567890123456', '+20 100 12a 4567'])('rejects %s', (value) => {
    expect(classifyContact(value)).toBeNull();
  });
});

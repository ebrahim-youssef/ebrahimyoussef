import { describe, expect, test } from 'vitest';
import { figures } from '../src/data/figures';

describe('figure clues', () => {
  test('every figure has a non-empty Arabic clue containing Arabic letters', () => {
    for (const figure of figures) {
      expect(figure.hintAr, `${figure.id}.hintAr`).toMatch(/\S/);
      expect(figure.hintAr, `${figure.id}.hintAr`).toMatch(/[\u0600-\u06ff]/);
    }
  });
});

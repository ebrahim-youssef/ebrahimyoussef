import { describe, expect, test } from 'vitest';
import { gameStrings } from '../src/components/game/strings';

describe('game strings', () => {
  test('English and Arabic expose the same non-empty keys', () => {
    expect(Object.keys(gameStrings.en).sort()).toEqual(Object.keys(gameStrings.ar).sort());

    for (const locale of ['en', 'ar'] as const) {
      for (const [key, value] of Object.entries(gameStrings[locale])) {
        expect(value, `${locale}.${key}`).toMatch(/\S/);
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import { alternateLinks, localizedPath, SITE_URL } from '../src/data/siteMeta';

describe('localizedPath', () => {
  it('leaves English paths unchanged', () => {
    expect(localizedPath('en', '/fastabiqu/')).toBe('/fastabiqu/');
  });

  it('prefixes the Arabic root path', () => {
    expect(localizedPath('ar', '/')).toBe('/ar/');
  });

  it('prefixes Arabic nested paths', () => {
    expect(localizedPath('ar', '/fastabiqu/')).toBe('/ar/fastabiqu/');
  });

  it('rejects paths without leading and trailing slashes', () => {
    expect(() => localizedPath('en', 'fastabiqu')).toThrow(/fastabiqu/);
  });
});

describe('alternateLinks', () => {
  it('returns absolute English, Arabic and x-default links', () => {
    expect(alternateLinks('/fastabiqu/')).toEqual([
      { hreflang: 'en', href: `${SITE_URL}/fastabiqu/` },
      { hreflang: 'ar', href: `${SITE_URL}/ar/fastabiqu/` },
      { hreflang: 'x-default', href: `${SITE_URL}/fastabiqu/` },
    ]);
  });
});

import { describe, expect, test } from 'vitest';
import { SITE } from '../src/data/site';
import { products } from '../src/data/products';

const placeholderPattern = /\b(?:coming soon|tbd|todo)\b/i;

describe('portfolio content contract', () => {
  test('keeps contact routes valid and distinct', () => {
    expect(SITE.url).toMatch(/^https:\/\//);
    expect(SITE.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(SITE.bookingUrl).toMatch(/^(?:https:\/\/|mailto:)/);
    expect(SITE.bookingUrl).not.toBe(`mailto:${SITE.email}`);
  });

  test('maps navigation to unique page sections', () => {
    const hrefs = SITE.navigation.map((item) => item.href);

    expect(hrefs).toEqual(['#work', '#services', '#process', '#about', '#contact']);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  test('describes a clear service and delivery model', () => {
    expect(SITE.services).toHaveLength(3);
    expect(SITE.process).toHaveLength(4);
    expect(SITE.process.map((step) => step.name)).toEqual([
      'Understand',
      'Build',
      'Refine',
      'Ship',
    ]);
  });

  test('publishes only complete featured work', () => {
    const featured = products.filter((product) => product.featured);

    expect(featured).toHaveLength(2);
    for (const product of featured) {
      expect(product.href).toMatch(/^https:\/\//);
      expect(product.repo).toMatch(/^https:\/\//);
      expect(product.problem).not.toMatch(placeholderPattern);
      expect(product.contribution).not.toMatch(placeholderPattern);
      expect(product.result).not.toMatch(placeholderPattern);
    }
  });

  test('contains no placeholder marketing copy', () => {
    const copy = JSON.stringify({ site: SITE, products });

    expect(copy).not.toMatch(placeholderPattern);
  });
});

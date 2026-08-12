import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { SITE, socials, socialUrl } from '../src/data/site';
import { products } from '../src/data/products';

const placeholderPattern = /—|\b(?:coming soon|tbd|todo|passionate|world-class|cutting-edge|rockstar|seamless|leverage|showcase|pixel-perfect|high-converting|industry-leading)\b/i;

const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:astro|tsx|ts)$/.test(entry.name) ? [path] : [];
  });
}

/* Comments are authored for developers, not readers, so they are exempt from the copy rules.
   The line-comment pattern requires whitespace before // so it never eats a URL. */
const withoutComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(?:^|\s)\/\/.*$/gm, ' ');

describe('portfolio content contract', () => {
  test('keeps contact routes valid', () => {
    expect(SITE.url).toMatch(/^https:\/\//);
    expect(SITE.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(SITE.emailUrl).toMatch(/^mailto:/);
  });

  test('maps navigation to unique page sections', () => {
    const hrefs = SITE.navigation.map((item) => item.href);

    expect(hrefs).toEqual(['#work', '#services', '#process', '#about', '#sharing', '#contact']);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  test('describes a clear service and delivery model', () => {
    expect(SITE.services).toHaveLength(3);
    expect(SITE.process.map((step) => step.name)).toEqual([
      'Understand',
      'Shape',
      'Build',
      'Refine and ship',
    ]);
    expect(SITE.audiences).toHaveLength(2);
  });

  test('features the intended products in the intended order', () => {
    const featured = products.filter((product) => product.featured);

    expect(featured.map((product) => product.id)).toEqual([
      'arkan',
      'nabd',
      'quran-api',
      'quote-vault',
    ]);
    for (const product of featured) {
      /* a live URL is optional, but a broken one is not: every href that exists must be
         absolute, and every card always has a source link to fall back on. */
      if (product.href !== null) expect(product.href).toMatch(/^https:\/\//);
      expect(product.repo).toMatch(/^https:\/\//);
      expect(JSON.stringify(product)).not.toMatch(placeholderPattern);
    }
  });

  test('publishes the expected social links', () => {
    expect(socials.map(({ id, url }) => ({ id, url }))).toEqual([
      { id: 'linkedin', url: 'https://www.linkedin.com/in/ebrahimyoussef391/' },
      { id: 'qabilah', url: 'https://qabilah.com/profile/ibrahim-youssef' },
      { id: 'facebook', url: 'https://www.facebook.com/61586254296785' },
      { id: 'youtube', url: 'https://www.youtube.com/@ebrahimyoussef391' },
      { id: 'github', url: 'https://github.com/Ibrahim-Rezq' },
    ]);
    for (const social of socials) expect(social.url).toMatch(/^https:\/\//);
    expect(socials.find((social) => social.id === 'linkedin')?.arabic).toBe(true);
    expect(socials.find((social) => social.id === 'qabilah')?.arabic).toBe(true);
  });

  test('resolves social links by id', () => {
    expect(socialUrl('github')).toBe('https://github.com/Ibrahim-Rezq');
    expect(() => socialUrl('nope')).toThrow();
  });

  test('contains no placeholder marketing copy', () => {
    const copy = JSON.stringify({ site: SITE, products, socials });

    expect(copy).not.toMatch(placeholderPattern);
  });

  test('publishes no product outside the intended set', () => {
    expect(products.map((product) => product.id)).toEqual([
      'arkan',
      'nabd',
      'quran-api',
      'quote-vault',
      'figures-game',
    ]);
  });

  /* Serialized data misses copy written straight into a component, which is where the
     old framing and the em dashes were actually hiding. */
  test('keeps banned copy out of every source file', () => {
    const offenders = sourceFiles(sourceRoot)
      .filter((path) => placeholderPattern.test(withoutComments(readFileSync(path, 'utf8'))))
      .map((path) => path.slice(sourceRoot.length));

    expect(offenders).toEqual([]);
  });
});

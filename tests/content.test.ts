import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { CAL_URL, WHATSAPP_MESSAGE, WHATSAPP_NUMBER, whatsappUrl } from '../src/data/contact';
import { LOCALES, type Locale } from '../src/data/locale';
import { LANDING_SOCIAL_IDS, SOCIAL_LINKS } from '../src/data/social';
import { landing } from '../src/data/landing';

const bannedCopyPattern = /[—–]|\b(?:coming soon|tbd|todo|passionate|world-class|cutting-edge|rockstar|seamless|leverage|showcase|pixel-perfect|high-converting|industry-leading)\b/i;

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

const sourceSnapshot = sourceFiles(sourceRoot).map((path) => ({
  path,
  source: withoutComments(readFileSync(path, 'utf8')),
}));

function contentLinks(locale: Locale): string[] {
  return [
    landing[locale].cv.href,
    ...landing[locale].work.flatMap((work) => work.links?.map((link) => link.href) ?? []),
  ];
}

describe('portfolio content contract', () => {
  test('lists the six work entries in the agreed order in both languages', () => {
    const workIds = ['fastabiqu', 'institution', 'store', 'calendar', 'quote-vault', 'figures'];

    expect(landing.en.work.map((work) => work.id)).toEqual(workIds);
    expect(landing.ar.work.map((work) => work.id)).toEqual(workIds);
  });

  test('gives English and Arabic the same number of entries in every list', () => {
    expect(landing.en.nav).toHaveLength(6);
    expect(landing.en.services).toHaveLength(4);
    expect(landing.en.results).toHaveLength(6);
    expect(landing.en.work).toHaveLength(6);
    expect(landing.en.steps).toHaveLength(5);
    expect(landing.en.journey).toHaveLength(6);

    for (const list of ['nav', 'services', 'results', 'work', 'steps', 'journey'] as const) {
      expect(landing.ar[list]).toHaveLength(landing.en[list].length);
    }
    expect(landing.ar.nav.map((entry) => entry.id)).toEqual(landing.en.nav.map((entry) => entry.id));
    expect(landing.ar.services.map((entry) => entry.id)).toEqual(landing.en.services.map((entry) => entry.id));
    expect(landing.ar.work.map((entry) => entry.id)).toEqual(landing.en.work.map((entry) => entry.id));
  });

  test('builds the WhatsApp link with each language message', () => {
    for (const locale of LOCALES) {
      const url = new URL(whatsappUrl(locale));

      expect(url.host).toBe('wa.me');
      expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);
      expect(url.searchParams.get('text')).toBe(WHATSAPP_MESSAGE[locale]);
    }
  });

  test('keeps every content link either https or a site path starting with a slash', () => {
    for (const locale of LOCALES) {
      for (const href of contentLinks(locale)) expect(href).toMatch(/^(?:https:\/\/|\/)/);
    }
    for (const social of SOCIAL_LINKS) expect(social.url).toMatch(/^https:\/\//);
  });

  test('offers the Cal.com booking only when a URL is configured', () => {
    expect(CAL_URL === '' || CAL_URL.startsWith('https://')).toBe(true);
  });

  test('shows only LinkedIn, GitHub and YouTube on the landing page', () => {
    expect(LANDING_SOCIAL_IDS).toEqual(['linkedin', 'github', 'youtube']);
  });

  test('names no town anywhere in the source', () => {
    const townPattern = /Tukh|طوخ|Qalyubia|القليوبية/i;
    const offenders = sourceSnapshot.filter(({ source }) => townPattern.test(source)).map(({ path }) => path.slice(sourceRoot.length));

    expect(offenders).toEqual([]);
  });

  test('links no TikTok anywhere in the source', () => {
    const offenders = sourceSnapshot.filter(({ source }) => /tiktok/i.test(source)).map(({ path }) => path.slice(sourceRoot.length));

    expect(offenders).toEqual([]);
  });

  test('keeps banned copy out of every source file', () => {
    const offenders = sourceSnapshot.filter(({ source }) => bannedCopyPattern.test(source)).map(({ path }) => path.slice(sourceRoot.length));

    expect(offenders).toEqual([]);
  });

  test('rejects em and en dashes but accepts a plain hyphen-minus', () => {
    expect('a — b').toMatch(bannedCopyPattern);
    expect('a – b').toMatch(bannedCopyPattern);
    expect('full-stack').not.toMatch(bannedCopyPattern);
  });
});

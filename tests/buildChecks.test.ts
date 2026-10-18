import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { checkFeedAlternateLink, checkForbidden, checkLanguageSwitch, checkPage, checkPdf, checkRss, checkSitemap, localizedPath as buildLocalizedPath, PUBLIC_PAGE_PATHS, SITE_URL as buildSiteUrl } from '../scripts/buildChecks.mjs';
import { localizedPath, SITE_URL } from '../src/data/siteMeta';

const validPage = `<!doctype html>
<html lang="en" dir="ltr"><head>
<link rel="canonical" href="https://ebrahimyoussef.com/">
<link rel="alternate" hreflang="en" href="https://ebrahimyoussef.com/">
<link rel="alternate" hreflang="ar" href="https://ebrahimyoussef.com/ar/">
<link rel="alternate" hreflang="x-default" href="https://ebrahimyoussef.com/">
<meta property="og:locale" content="en_US"><meta property="og:url" content="https://ebrahimyoussef.com/">
<meta property="og:title" content="Title"><meta property="og:description" content="Description">
<meta property="og:image" content="https://ebrahimyoussef.com/og.png"><meta property="og:image:alt" content="Alt">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Title">
<meta name="twitter:description" content="Description"><meta name="twitter:image" content="https://ebrahimyoussef.com/og.png">
<meta name="twitter:image:alt" content="Alt">
<script type="application/ld+json">{"@graph":[{"@type":"Person"},{"@type":"WebSite"}]}</script>
</head><body><a href="#main">Skip</a><h1>Title</h1><main id="main"></main></body></html>`;

function pageWith(replacement: string, replacementValue: string) {
  return validPage.replace(replacement, replacementValue);
}

function validPageFor(locale: 'en' | 'ar', path: string) {
  const englishUrl = `${buildSiteUrl}${buildLocalizedPath('en', path)}`;
  const arabicUrl = `${buildSiteUrl}${buildLocalizedPath('ar', path)}`;
  return validPage
    .replace('<html lang="en" dir="ltr">', `<html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace('<link rel="canonical" href="https://ebrahimyoussef.com/">', `<link rel="canonical" href="${locale === 'ar' ? arabicUrl : englishUrl}">`)
    .replace('<link rel="alternate" hreflang="en" href="https://ebrahimyoussef.com/">', `<link rel="alternate" hreflang="en" href="${englishUrl}">`)
    .replace('<link rel="alternate" hreflang="ar" href="https://ebrahimyoussef.com/ar/">', `<link rel="alternate" hreflang="ar" href="${arabicUrl}">`)
    .replace('<link rel="alternate" hreflang="x-default" href="https://ebrahimyoussef.com/">', `<link rel="alternate" hreflang="x-default" href="${englishUrl}">`)
    .replace('content="https://ebrahimyoussef.com/">', `content="${locale === 'ar' ? arabicUrl : englishUrl}">`);
}

describe('checkPage', () => {
  test('accepts a page with the complete English document contract', () => {
    expect(checkPage(validPage, { locale: 'en', path: '/' })).toEqual([]);
  });

  test('does not count an RSS alternate link as hreflang metadata', () => {
    const html = validPage.replace('</head>', '<link rel="alternate" type="application/rss+xml" href="https://ebrahimyoussef.com/rss.xml"></head>');
    expect(checkPage(html, { locale: 'en', path: '/' })).toEqual([]);
  });

  test.each(PUBLIC_PAGE_PATHS.flatMap((path) => [
    ['English', 'en' as const, path],
    ['Arabic', 'ar' as const, path],
  ]))('accepts the complete %s %s document contract', (_name, locale, path) => {
    expect(checkPage(validPageFor(locale, path), { locale, path })).toEqual([]);
  });

  test.each([
    ['wrong language', '<html lang="ar" dir="rtl">'],
    ['wrong direction', '<html lang="en" dir="rtl">'],
  ])('rejects a page with %s', (_name, root) => {
    expect(checkPage(pageWith('<html lang="en" dir="ltr">', root), { locale: 'en', path: '/' })).toContain(
      '/: html lang and dir must be en/ltr',
    );
  });

  test.each([
    ['a missing canonical link', validPage.replace('<link rel="canonical" href="https://ebrahimyoussef.com/">\n', '')],
    ['a wrong canonical URL', pageWith('<link rel="canonical" href="https://ebrahimyoussef.com/">', '<link rel="canonical" href="https://example.com/">')],
  ])('rejects %s', (_name, html) => {
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain(
      '/: exactly one canonical link must equal https://ebrahimyoussef.com/',
    );
  });

  test.each([
    ['a missing alternate', validPage.replace('<link rel="alternate" hreflang="ar" href="https://ebrahimyoussef.com/ar/">\n', '')],
    ['a wrong alternate URL', pageWith('<link rel="alternate" hreflang="ar" href="https://ebrahimyoussef.com/ar/">', '<link rel="alternate" hreflang="ar" href="https://example.com/ar/">')],
  ])('rejects %s', (_name, html) => {
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain(
      '/: hreflang ar must equal https://ebrahimyoussef.com/ar/',
    );
  });

  test('rejects a page with the wrong alternate count', () => {
    const html = validPage.replace('<link rel="alternate" hreflang="x-default" href="https://ebrahimyoussef.com/">\n', '');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain('/: there must be exactly three hreflang alternate links');
  });

  test('rejects a page without an Open Graph locale', () => {
    expect(checkPage(validPage.replace('<meta property="og:locale" content="en_US">', ''), { locale: 'en', path: '/' })).toContain(
      '/: missing non-empty og:locale metadata',
    );
  });

  test('rejects a page with the wrong Open Graph URL', () => {
    const html = pageWith('content="https://ebrahimyoussef.com/">', 'content="https://example.com/">');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain('/: og:url must equal https://ebrahimyoussef.com/');
  });

  test.each(['og:title', 'og:description', 'og:image', 'og:image:alt'])('rejects a page without %s', (property) => {
    const html = validPage.replace(new RegExp(`<meta property="${property}"[^>]*>`), '');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain(`/: missing non-empty ${property} metadata`);
  });

  test.each(['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'])('rejects a page without %s', (name) => {
    const html = validPage.replace(new RegExp(`<meta name="${name}"[^>]*>`), '');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain(`/: missing non-empty ${name} metadata`);
  });

  test('rejects a page with invalid JSON-LD', () => {
    const html = validPage.replace('{"@graph":[{"@type":"Person"},{"@type":"WebSite"}]}', '{bad');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain('/: a JSON-LD script must contain parseable JSON');
  });

  test('rejects JSON-LD without Person and WebSite in its graph', () => {
    const html = validPage.replace('"WebSite"', '"Article"');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain('/: JSON-LD must contain Person and WebSite in its graph');
  });

  test.each([
    ['no h1', '<h1>Title</h1>', ''],
    ['two h1 elements', '<h1>Title</h1>', '<h1>Second</h1><h1>Third</h1>'],
  ])('rejects a page with %s', (_name, original, replacement) => {
    const html = replacement ? validPage.replace(original, replacement) : validPage.replace(original, '');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain('/: page must contain exactly one h1');
  });

  test.each([
    ['no main element', '<main id="main"></main>', ''],
    ['two main elements', '<main id="main"></main>', '<main id="main"></main><main id="main"></main>'],
  ])('rejects a page with %s', (_name, original, replacement) => {
    const html = replacement ? validPage.replace(original, replacement) : validPage.replace(original, '');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain('/: page must contain exactly one main element with id main');
  });

  test('rejects a page without a skip link to main', () => {
    const html = validPage.replace('<a href="#main">Skip</a>', '<a href="/">Skip</a>');
    expect(checkPage(html, { locale: 'en', path: '/' })).toContain('/: page must contain a skip link to #main');
  });
});

describe('checkForbidden', () => {
  test('accepts clean rendered text', () => {
    expect(checkForbidden('<a href="/work/">Work</a><p>Useful products.</p>', 'home.html')).toEqual([]);
  });

  test.each(['googletagmanager', 'gtag(', 'G-ZSD8RW67L3', 'analytics-consent', 'data-analytics', 'privacy-region'])('rejects %s', (marker) => {
    expect(checkForbidden(marker, 'home.html')).toHaveLength(1);
  });

  test('rejects TikTok in any letter case', () => {
    expect(checkForbidden('TikTok', 'home.html')).toHaveLength(1);
  });

  test.each(['href=""', 'href="#"'])('rejects %s', (link) => {
    expect(checkForbidden(`<a ${link}>bad</a>`, 'home.html')).toHaveLength(1);
  });

  test.each(['TBD', 'TODO', 'coming soon', 'lorem'])('rejects placeholder text %s', (placeholder) => {
    expect(checkForbidden(placeholder, 'home.html')).toHaveLength(1);
  });

  test.each(['Tukh', 'طوخ', 'Qalyubia', 'القليوبية'])('rejects the town name %s', (town) => {
    expect(checkForbidden(town, 'home.html')).toHaveLength(1);
  });
});

describe('RSS build checks', () => {
  const feed = `<?xml version="1.0"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Writing</title><link>https://ebrahimyoussef.com/daftar/</link><description>Notes</description><language>en</language><atom:link href="https://ebrahimyoussef.com/rss.xml" rel="self" type="application/rss+xml" /></channel></rss>`;

  test('accepts an English RSS 2.0 feed', () => {
    expect(checkRss(feed, { language: 'en', path: 'dist/rss.xml' })).toEqual([]);
  });

  test('rejects a feed with the wrong language', () => {
    expect(checkRss(feed, { language: 'ar', path: 'dist/ar/rss.xml' })).toContain('dist/ar/rss.xml: RSS language must be ar');
  });

  test('accepts the daftar feed alternate link for each locale', () => {
    const html = '<link rel="alternate" type="application/rss+xml" href="https://ebrahimyoussef.com/rss.xml">';
    expect(checkFeedAlternateLink(html, { locale: 'en' })).toEqual([]);
  });

  test('rejects a daftar page without the matching feed alternate link', () => {
    expect(checkFeedAlternateLink('', { locale: 'ar' })).toEqual(['/ar/daftar/: RSS alternate link must equal https://ebrahimyoussef.com/ar/rss.xml']);
  });
});

describe('language switch build checks', () => {
  test.each([
    ['en', '/ar/daftar/tags/'],
    ['ar', '/daftar/tags/'],
  ] as const)('accepts the %s tags index link to the other language', (locale, expectedHref) => {
    expect(checkLanguageSwitch(`<a class="lang" href="${expectedHref}">Switch</a>`, { locale, path: '/daftar/tags/' })).toEqual([]);
  });

  test('rejects a tags index language link to the daftar home', () => {
    expect(checkLanguageSwitch('<a class="lang" href="/ar/daftar/">Switch</a>', { locale: 'en', path: '/daftar/tags/' })).toContain(
      '/daftar/tags/: language switch must link to /ar/daftar/tags/',
    );
  });
});

describe('sitemap build checks', () => {
  test('does not count feed URLs when referenced sitemaps omit the root URLs', () => {
    const sitemapIndex = `<sitemapindex><sitemap><loc>${buildSiteUrl}/sitemap-0.xml</loc></sitemap></sitemapindex>`;
    const sitemap = '<urlset><url><loc>https://ebrahimyoussef.com/other-page/</loc></url></urlset>';
    const feed = `<rss><channel><link>${buildSiteUrl}/</link><link>${buildSiteUrl}/ar/</link></channel></rss>`;

    expect(checkSitemap(sitemapIndex, [
      { url: `${buildSiteUrl}/sitemap-0.xml`, xml: sitemap },
      { url: `${buildSiteUrl}/rss.xml`, xml: feed },
    ])).toEqual([
      'dist/sitemap-index.xml: sitemap must list the English root URL',
      'dist/sitemap-index.xml: sitemap must list the Arabic root URL',
    ]);
  });
});

describe('checkPdf', () => {
  test('accepts a PDF with the required header and size', () => {
    const bytes = new Uint8Array(10 * 1024 + 1);
    bytes.set(new TextEncoder().encode('%PDF-'));
    expect(checkPdf(bytes)).toEqual([]);
  });

  test('rejects a file without the PDF header', () => {
    expect(checkPdf(new Uint8Array(10 * 1024 + 1))).toContain('PDF: file must start with %PDF-');
  });

  test('rejects a PDF that is 10 KB or smaller', () => {
    const bytes = new Uint8Array(10 * 1024);
    bytes.set(new TextEncoder().encode('%PDF-'));
    expect(checkPdf(bytes)).toContain('PDF: file must be larger than 10 KB');
  });
});

describe('duplicated build constants', () => {
  test('keeps the build constants aligned with siteMeta', () => {
    expect(buildSiteUrl).toBe(SITE_URL);
    for (const path of ['/', '/fastabiqu/', '/daftar/', '/daftar/tags/']) {
      expect(buildLocalizedPath('en', path)).toBe(localizedPath('en', path));
      expect(buildLocalizedPath('ar', path)).toBe(localizedPath('ar', path));
    }
    expect(readFileSync(new URL('../src/data/siteMeta.ts', import.meta.url), 'utf8')).toContain(`SITE_URL = '${buildSiteUrl}'`);
  });
});

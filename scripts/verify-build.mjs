import { access, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkFeedAlternateLink, checkForbidden, checkLanguageSwitch, checkPage, checkPdf, checkRss, checkSitemap, localizedPath, PUBLIC_PAGE_PATHS, SITE_URL, sitemapReferences } from './buildChecks.mjs';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const distRoot = join(projectRoot, 'dist');
const problems = [];
const pageHtml = [];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function filesIn(directory, extension) {
  if (!(await exists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(path, extension)));
    else if (entry.name.endsWith(extension)) files.push(path);
  }
  return files;
}

async function readText(relativePath) {
  const path = join(projectRoot, relativePath);
  try {
    return await readFile(path, 'utf8');
  } catch {
    problems.push(`${relativePath}: required file is missing or unreadable`);
    return null;
  }
}

async function readPage(relativePath, locale, path) {
  const html = await readText(relativePath);
  if (html !== null) {
    pageHtml.push(html);
    problems.push(...checkPage(html, { locale, path }));
    if (path === '/daftar/') problems.push(...checkFeedAlternateLink(html, { locale }));
    if (path === '/daftar/tags/') problems.push(...checkLanguageSwitch(html, { locale, path }));
  }
}

const requiredFiles = ['dist/robots.txt', 'dist/og.png', 'dist/favicon.svg', 'dist/sitemap-index.xml', 'dist/rss.xml', 'dist/ar/rss.xml'];
for (const relativePath of requiredFiles) await readText(relativePath);

for (const [relativePath, language] of [['dist/rss.xml', 'en'], ['dist/ar/rss.xml', 'ar']]) {
  const xml = await readText(relativePath);
  if (xml !== null) problems.push(...checkRss(xml, { language, path: relativePath }));
}

const pages = PUBLIC_PAGE_PATHS.flatMap((path) => [
  [`dist${localizedPath('en', path)}index.html`, 'en', path],
  [`dist${localizedPath('ar', path)}index.html`, 'ar', path],
]);
const hasFastabiquSource = await exists(join(projectRoot, 'src/pages/fastabiqu.astro')) || await exists(join(projectRoot, 'src/pages/fastabiqu'));
if (hasFastabiquSource) {
  pages.push(['dist/fastabiqu/index.html', 'en', '/fastabiqu/']);
  pages.push(['dist/ar/fastabiqu/index.html', 'ar', '/fastabiqu/']);
}
for (const [relativePath, locale, path] of pages) await readPage(relativePath, locale, path);

const htmlFiles = await filesIn(distRoot, '.html');
for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  problems.push(...checkForbidden(text, relative(projectRoot, file)));
}

const clientScriptFiles = await filesIn(join(distRoot, '_astro'), '.js');
for (const file of clientScriptFiles) {
  const text = await readFile(file, 'utf8');
  problems.push(...checkForbidden(text, relative(projectRoot, file)));
}

const sitemapIndex = await readText('dist/sitemap-index.xml');
if (sitemapIndex !== null) {
  const sitemapDocuments = [];
  for (const url of sitemapReferences(sitemapIndex)) {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      problems.push(`dist/sitemap-index.xml: sitemap reference is not a valid URL: ${url}`);
      continue;
    }

    if (parsedUrl.origin !== SITE_URL) {
      problems.push(`dist/sitemap-index.xml: sitemap reference must use ${SITE_URL}: ${url}`);
      continue;
    }

    const relativePath = parsedUrl.pathname.replace(/^\/+/, '');
    const sitemapPath = join(distRoot, relativePath);
    const withinDist = relative(distRoot, sitemapPath);
    if (withinDist.startsWith('..') || withinDist.includes(':')) {
      problems.push(`dist/sitemap-index.xml: sitemap reference must point inside dist: ${url}`);
      continue;
    }

    try {
      sitemapDocuments.push({ url, xml: await readFile(sitemapPath, 'utf8') });
    } catch {
      problems.push(`dist/${relativePath}: sitemap file is referenced but missing or unreadable`);
    }
  }
  problems.push(...checkSitemap(sitemapIndex, sitemapDocuments));
}

if (await exists(join(projectRoot, 'public/cv.pdf'))) {
  try {
    const pdf = await readFile(join(distRoot, 'cv.pdf'));
    problems.push(...checkPdf(pdf).map((problem) => `dist/cv.pdf: ${problem}`));
  } catch {
    problems.push('dist/cv.pdf: public/cv.pdf exists but the built PDF is missing or unreadable');
  }
}

if (pageHtml.some((html) => html.includes('1x00000000000000000000AA'))) {
  console.log('Warning: built HTML contains the Turnstile test site key; the owner must set the real key.');
}

if (problems.length > 0) {
  for (const problem of problems) console.error(problem);
  process.exitCode = 1;
} else {
  console.log(`Verified ${pages.length} pages.`);
}

import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'dist/index.html',
  'dist/robots.txt',
  'dist/og.png',
  'dist/favicon.svg',
  'dist/sitemap-index.xml',
];

await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile('dist/index.html', 'utf8');
const requiredText = [
  'I build clear, dependable digital products for startups and small businesses.',
  'Email me about a project',
  'Book a call',
  'Selected work',
  'How I can help',
  'How we get from idea to launch',
];
const requiredIds = ['work', 'services', 'process', 'about', 'play', 'contact'];

for (const text of requiredText) {
  if (!html.includes(text)) throw new Error(`Missing rendered text: ${text}`);
}

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing rendered section: #${id}`);
}

if (!html.includes('rel="canonical" href="https://ebrahimyoussef.com"')) {
  throw new Error('Missing production canonical URL');
}

const socialMetadata = [
  'property="og:image"',
  'property="og:image:alt"',
  'name="twitter:card"',
  'name="twitter:title"',
  'name="twitter:description"',
  'name="twitter:image"',
  'name="twitter:image:alt"',
];

if (socialMetadata.some((attribute) => !html.includes(attribute))) {
  throw new Error('Missing social metadata');
}

if (!html.includes('"@type":"Person"') || !html.includes('"@type":"WebSite"')) {
  throw new Error('Missing structured data graph');
}

if (/href=""|\b(?:TBD|TODO|coming soon)\b/i.test(html)) {
  throw new Error('Rendered page contains an empty link or placeholder copy');
}

console.log('Verified production build structure and metadata.');

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile } from 'node:fs/promises';

const mark = await readFile('assets/brand/monogram.svg', 'utf8');
const markContent = mark
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/\s*<title>.*?<\/title>/, '');
const lightMarkContent = markContent.replace('#2E2A26', '#F7F1E8');
const icon = `<svg viewBox="0 0 156 156" xmlns="http://www.w3.org/2000/svg"><title>Ebrahim Youssef mark</title><rect width="156" height="156" rx="18" fill="#2E2A26"/><g transform="translate(22 35.3) scale(0.718)">${lightMarkContent}</g></svg>`;
await writeFile('public/favicon.svg', icon);
for (const [file, size] of [
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
  ['/tmp/fav-32.png', 32],
]) await sharp(Buffer.from(icon), { density: 300 }).resize(size, size).png().toFile(file);
await writeFile('public/favicon.ico', await pngToIco(['/tmp/fav-32.png']));
const ogTemplate = await readFile('assets/brand/og-template.svg', 'utf8');
const og = ogTemplate.replace('<!-- MARK -->', lightMarkContent);
await sharp(Buffer.from(og), { density: 150 }).resize(1200, 630).png().toFile('public/og.png');
console.log('icons + og done');

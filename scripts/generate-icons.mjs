import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile, copyFile } from 'node:fs/promises';

const mono = 'assets/brand/monogram.svg';
await copyFile(mono, 'public/favicon.svg');
for (const [file, size] of [
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
  ['/tmp/fav-32.png', 32],
]) await sharp(mono, { density: 300 }).resize(size, size).flatten({ background: '#faf6ef' }).png().toFile(file);
await writeFile('public/favicon.ico', await pngToIco(['/tmp/fav-32.png']));
await sharp('assets/brand/og-template.svg', { density: 150 }).resize(1200, 630).png().toFile('public/og.png');
console.log('icons + og done');

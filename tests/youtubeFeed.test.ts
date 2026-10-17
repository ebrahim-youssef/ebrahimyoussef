import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { fetchLatestVideos, parseYouTubeFeed } from '../src/lib/youtubeFeed';

const fixturePath = (name: string) =>
  fileURLToPath(new URL(`./fixtures/youtube/${name}.xml`, import.meta.url));

async function readFixture(name: string): Promise<string> {
  return readFile(fixturePath(name), 'utf8');
}

describe('YouTube feed reader', () => {
  test('parses the valid feed in newest-first order', async () => {
    const xml = await readFixture('valid');
    const videos = parseYouTubeFeed(xml);

    expect(videos).toHaveLength(3);
    expect(videos.map(({ id }) => id)).toEqual([
      'uxXI5w92lDo',
      'VybsxNVT-Jo',
      'NEdqtdSP2IU',
    ]);
    expect(videos[0]).toMatchObject({
      title: 'سؤال اليوم #٧ | ما الميزة في الصدقة على قريبٍ محتاج؟ #shorts',
      url: 'https://www.youtube.com/shorts/uxXI5w92lDo',
      thumbnailUrl: 'https://i2.ytimg.com/vi/uxXI5w92lDo/hqdefault.jpg',
      isShort: true,
    });
    expect(videos[0]?.publishedAt).toEqual(new Date('2026-10-17T12:00:12Z'));
  });

  test('returns an empty list for an empty feed', async () => {
    expect(parseYouTubeFeed(await readFixture('empty'))).toEqual([]);
  });

  test('returns an empty list for malformed XML', async () => {
    expect(parseYouTubeFeed(await readFixture('malformed'))).toEqual([]);
  });

  test('returns an empty list when fetching fails', async () => {
    const fetchImpl = async () => {
      throw new Error('network unavailable');
    };

    await expect(fetchLatestVideos(6, fetchImpl)).resolves.toEqual([]);
  });

  test('returns an empty list for a non-200 response', async () => {
    const fetchImpl = async () => new Response('', { status: 500 });

    await expect(fetchLatestVideos(6, fetchImpl)).resolves.toEqual([]);
  });

  test('applies the requested limit after sorting', async () => {
    const xml = await readFixture('valid');

    await expect(fetchLatestVideos(2, async () => new Response(xml))).resolves.toHaveLength(2);
  });
});

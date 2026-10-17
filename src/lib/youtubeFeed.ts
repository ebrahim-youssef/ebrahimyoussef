import { XMLParser } from 'fast-xml-parser';

export const YOUTUBE_CHANNEL_ID = 'UCcKyBs8u4-ZEkJC-Z7FdVUQ';
export const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  publishedAt: Date;
  thumbnailUrl: string;
  isShort: boolean;
};

type XmlRecord = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

function asRecord(value: unknown): XmlRecord | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
  return value as XmlRecord;
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    const text = String(value).trim();
    return text || undefined;
  }

  const record = asRecord(value);
  return record ? asString(record['#text']) : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value === undefined ? [] : [value];
}

function getVideoId(entry: XmlRecord): string | undefined {
  const id = asString(entry['yt:videoId']);
  if (id) return id;

  const feedId = asString(entry.id);
  return feedId?.replace(/^yt:video:/, '') || undefined;
}

function getVideoLink(entry: XmlRecord): string | undefined {
  const links = asArray(entry.link).map(asRecord).filter((link): link is XmlRecord => link !== undefined);
  const shortLink = links.find((link) => asString(link['@_href'])?.includes('/shorts/'));
  const alternate = links.find((link) => asString(link['@_rel']) === 'alternate');
  return asString(shortLink?.['@_href']) ?? asString(alternate?.['@_href']) ?? asString(links[0]?.['@_href']);
}

function getThumbnailUrl(entry: XmlRecord, id: string): string {
  const group = asRecord(asArray(entry['media:group'])[0]);
  const thumbnail = asRecord(asArray(group?.['media:thumbnail'])[0]);
  return asString(thumbnail?.['@_url']) ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function parseVideo(entry: XmlRecord): YouTubeVideo | undefined {
  const id = getVideoId(entry);
  const title = asString(entry.title);
  const published = asString(entry.published) ?? asString(entry.updated);

  if (!id || !title || !published) return undefined;

  const publishedAt = new Date(published);
  if (Number.isNaN(publishedAt.getTime())) return undefined;

  const url = getVideoLink(entry) ?? `https://www.youtube.com/watch?v=${id}`;

  return {
    id,
    title,
    url,
    publishedAt,
    thumbnailUrl: getThumbnailUrl(entry, id),
    isShort: url.includes('/shorts/'),
  };
}

export function parseYouTubeFeed(xml: string): YouTubeVideo[] {
  if (typeof xml !== 'string' || !xml.trim()) return [];

  try {
    const feed = asRecord(asRecord(parser.parse(xml))?.feed);
    if (!feed) return [];

    return asArray(feed.entry)
      .map(asRecord)
      .filter((entry): entry is XmlRecord => entry !== undefined)
      .map(parseVideo)
      .filter((video): video is YouTubeVideo => video !== undefined)
      .sort((first, second) => second.publishedAt.getTime() - first.publishedAt.getTime());
  } catch {
    return [];
  }
}

export async function fetchLatestVideos(
  limit = 6,
  fetchImpl: typeof fetch = fetch,
): Promise<YouTubeVideo[]> {
  try {
    const response = await fetchImpl(YOUTUBE_FEED_URL, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.status !== 200) {
      console.warn(`YouTube feed request returned HTTP ${response.status}`);
      return [];
    }

    const xml = await response.text();
    return parseYouTubeFeed(xml).slice(0, Math.max(0, limit));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`YouTube feed request failed: ${message}`);
    return [];
  }
}

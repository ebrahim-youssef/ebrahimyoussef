import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './locale';

export type NowEntry = Pick<CollectionEntry<'now'>, 'data' | 'body'>;

export async function getNow(locale: Locale): Promise<{ date: Date; text: string }> {
  const entries = await getCollection('now', ({ data }) => data.lang === locale);
  const entry: NowEntry | undefined = entries[0];

  if (!entry) {
    throw new Error(`Missing now entry for locale: ${locale}`);
  }

  return {
    date: entry.data.date,
    text: entry.body?.trim() ?? '',
  };
}

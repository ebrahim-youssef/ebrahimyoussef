import type { Locale } from '../data/locale';
import { localizedPath } from '../data/siteMeta';

export interface PostLike {
  id: string;
  data: {
    title: string;
    date: Date | string;
    lang: Locale;
    tags: readonly string[];
    translation?: string;
    draft?: boolean;
  };
  body?: string;
}

export function slugify(value: string): string {
  const slug = value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) throw new Error(`Cannot create a slug from value: ${value}`);
  return slug;
}

export function postSlug(value: string): string {
  const filename = value.split(/[\\/]/u).pop() ?? value;
  return slugify(filename);
}

export function publishedPosts<T extends PostLike>(entries: readonly T[], locale: Locale): T[] {
  return entries
    .filter((entry) => entry.data.lang === locale && entry.data.draft !== true)
    .slice()
    .sort((first, second) => new Date(second.data.date).getTime() - new Date(first.data.date).getTime());
}

export function tagsOf(posts: readonly PostLike[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags.map(slugify)))].sort((first, second) => first.localeCompare(second));
}

export function postPath(locale: Locale, slug: string): string {
  return localizedPath(locale, `/daftar/posts/${postSlug(slug)}/`);
}

export function tagPath(locale: Locale, tag: string): string {
  return localizedPath(locale, `/daftar/tags/${slugify(tag)}/`);
}

export function firstParagraph(markdown: string | undefined, fallback: string): string {
  const paragraph = markdown
    ?.split(/\n\s*\n/u)[0]
    .replace(/^#{1,6}\s+/u, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return (paragraph || fallback).slice(0, 155).trim();
}

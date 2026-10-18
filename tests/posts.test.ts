import { describe, expect, test } from 'vitest';
import { fixturePosts } from './fixtures/posts';
import { firstParagraph, postPath, postSlug, publishedPosts, slugify, tagPath, tagsOf } from '../src/lib/posts';

describe('post helpers', () => {
  test('returns published posts for one locale, newest first, without mutating entries', () => {
    const entries = [...fixturePosts];
    const result = publishedPosts(entries, 'en');

    expect(result.map((entry) => entry.id)).toEqual(['newer-note', 'older-note']);
    expect(entries.map((entry) => entry.id)).toEqual(fixturePosts.map((entry) => entry.id));
  });

  test('returns normalized unique tags in sorted order', () => {
    expect(tagsOf(publishedPosts(fixturePosts, 'en'))).toEqual(['building', 'life', 'new-tag']);
  });

  test.each([
    ['New Tag', 'new-tag'],
    ['  Arabic  Notes  ', 'arabic-notes'],
    ['ملاحظات عربية', 'ملاحظات-عربية'],
  ])('slugifies %s as %s', (value, expected) => {
    expect(slugify(value)).toBe(expected);
  });

  test('rejects values that cannot become a slug', () => {
    expect(() => slugify('---')).toThrow(/slug/);
  });

  test('extracts and trims the first Markdown paragraph for metadata', () => {
    expect(firstParagraph('# Heading\n\nRead **this** [note](/note).', 'Fallback')).toBe('Heading');
    expect(firstParagraph(undefined, 'Fallback')).toBe('Fallback');
  });

  test('builds localized post and tag paths', () => {
    expect(postSlug('posts/new-note')).toBe('new-note');
    expect(postPath('en', 'New Note')).toBe('/daftar/posts/new-note/');
    expect(postPath('ar', 'ملاحظة عربية')).toBe('/ar/daftar/posts/ملاحظة-عربية/');
    expect(tagPath('en', 'New Tag')).toBe('/daftar/tags/new-tag/');
    expect(tagPath('ar', 'New Tag')).toBe('/ar/daftar/tags/new-tag/');
  });
});

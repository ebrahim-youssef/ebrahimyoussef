import { describe, expect, test } from 'vitest';
import { escapeXml, renderRss } from '../src/lib/rss';
import { fixturePosts } from './fixtures/posts';

describe('RSS helpers', () => {
  test('escapes XML text and attribute characters', () => {
    expect(escapeXml(`A & B < C > D "quoted" 'single'`)).toBe('A &amp; B &lt; C &gt; D &quot;quoted&quot; &apos;single&apos;');
  });

  test('renders a valid empty RSS 2.0 channel', () => {
    const xml = renderRss({
      title: 'Writing',
      link: 'https://ebrahimyoussef.com/daftar/',
      description: 'Notes',
      language: 'en',
      selfLink: 'https://ebrahimyoussef.com/rss.xml',
      posts: [],
    });

    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(xml).toContain('<language>en</language>');
    expect(xml).toContain('rel="self"');
    expect(xml).not.toContain('<item>');
  });

  test('renders escaped published post fields', () => {
    const xml = renderRss({
      title: 'Writing & notes',
      link: 'https://ebrahimyoussef.com/daftar/',
      description: 'Notes <here>',
      language: 'en',
      selfLink: 'https://ebrahimyoussef.com/rss.xml',
      posts: [
        {
          ...fixturePosts[1],
          data: { ...fixturePosts[1].data, title: 'A & note' },
          body: 'First paragraph <with> details.',
        },
      ],
      postUrl: (post) => `https://ebrahimyoussef.com/daftar/posts/${post.id}/`,
    });

    expect(xml).toContain('<title>A &amp; note</title>');
    expect(xml).toContain('<description>First paragraph &lt;with&gt; details.</description>');
    expect(xml).toContain('<pubDate>Tue, 10 Feb 2026 00:00:00 GMT</pubDate>');
  });
});

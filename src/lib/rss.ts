import { firstParagraph, type PostLike } from './posts';

export interface RssOptions {
  title: string;
  link: string;
  description: string;
  language: 'en' | 'ar';
  selfLink: string;
  posts: readonly PostLike[];
  postUrl?: (post: PostLike) => string;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderRss(options: RssOptions): string {
  const postUrl = options.postUrl ?? ((post) => `${options.link}${post.id}/`);
  const items = options.posts
    .map((post) => {
      const link = postUrl(post);
      return [
        '    <item>',
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(firstParagraph(post.body, post.data.title))}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(options.title)}</title>`,
    `    <link>${escapeXml(options.link)}</link>`,
    `    <description>${escapeXml(options.description)}</description>`,
    `    <language>${options.language}</language>`,
    `    <atom:link href="${escapeXml(options.selfLink)}" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');
}

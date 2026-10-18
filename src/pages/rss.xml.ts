import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE_URL, localizedPath } from '../data/siteMeta';
import { postPath, publishedPosts } from '../lib/posts';
import { renderRss } from '../lib/rss';

export const GET: APIRoute = async () => {
  const posts = publishedPosts(await getCollection('posts'), 'en');
  const feedUrl = `${SITE_URL}/rss.xml`;
  const xml = renderRss({
    title: 'Ebrahim Youssef writing',
    link: `${SITE_URL}${localizedPath('en', '/daftar/')}`,
    description: 'Notes on building products, working in Arabic first, and what I study.',
    language: 'en',
    selfLink: feedUrl,
    posts,
    postUrl: (post) => `${SITE_URL}${postPath('en', post.id)}`,
  });

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};

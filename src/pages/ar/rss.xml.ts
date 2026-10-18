import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE_URL, localizedPath } from '../../data/siteMeta';
import { postPath, publishedPosts } from '../../lib/posts';
import { renderRss } from '../../lib/rss';

export const GET: APIRoute = async () => {
  const posts = publishedPosts(await getCollection('posts'), 'ar');
  const feedUrl = `${SITE_URL}/ar/rss.xml`;
  const xml = renderRss({
    title: 'كتابات إبراهيم يوسف',
    link: `${SITE_URL}${localizedPath('ar', '/daftar/')}`,
    description: 'ملاحظات عن بناء المنتجات والعمل بالعربية وما أدرسه.',
    language: 'ar',
    selfLink: feedUrl,
    posts,
    postUrl: (post) => `${SITE_URL}${postPath('ar', post.id)}`,
  });

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};

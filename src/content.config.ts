import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const language = z.enum(['en', 'ar']);

const posts = defineCollection({
  loader: glob({ pattern: 'posts/**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: language,
    tags: z.array(z.string()).default([]),
    translation: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: 'now/*.md', base: './src/content' }),
  schema: z.object({
    lang: language,
    date: z.coerce.date(),
  }),
});

export const collections = { posts, now };

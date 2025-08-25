import { z, defineCollection } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string().optional(),
    }),
    excerpt: z.string(),
    featured_media: z.string(),
    categories: z.array(z.string()).optional(), // ✅ هذا السطر مهم
  }),
});

export const collections = { posts };

import { defineCollection, z } from 'astro:content';

const logs = defineCollection({
  type: 'content',
  schema: z.object({
    index: z.number(),
    title: z.string(),
    youtube: z.string().optional(),
    tags: z.array(z.string()).optional(),
    palette: z.array(z.string()).optional()
  })
});

export const collections = { logs };

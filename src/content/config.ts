import { defineCollection, z } from 'astro:content';

const logs = defineCollection({
  type: 'content',
  schema: z.object({
    index: z.number(),
    id: z.string(),
    title: z.string(),
    scene: z.string(),
    characters: z.array(z.string()),
    author: z.string(),
    date: z.string().optional(),
    status: z.enum(["Declassified", "Restricted", "Corrupted", "Recovered", "Degraded"]).optional(),
    perspective: z.enum(["System", "Human", "Hybrid"]).optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
    youtube: z.string().optional(),
    palette: z.array(z.string()).optional()
  })
});

const archives = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    year: z.number(),
    classification: z.enum(['RESTRICTED', 'CONFIDENTIAL', 'INTERNAL', 'PUBLIC']),
    status: z.string(),
    authors: z.array(z.string()).optional(),
    integrity: z.number().optional(),
    recoveredFrom: z.string().optional()
  })
});

export const collections = { logs, archives };

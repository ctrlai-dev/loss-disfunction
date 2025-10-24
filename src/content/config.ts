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

const about = defineCollection({
  type: 'content',
  schema: z.object({
    type: z.enum(['World', 'Entity', 'Figure', 'Artifact', 'Theme', 'Diagram']),
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    cover: z.string().optional()
  })
});

// Universe collection (Cosmos)
const universeEntry = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['character','faction','technology','location','artifact','theme']).default('character'),
    order: z.number().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    plottrId: z.string().optional(),
    related: z.array(z.string()).default([]),
    summary: z.string().min(1)
  })
});

export const collections = { logs, archives, about, universe: universeEntry };
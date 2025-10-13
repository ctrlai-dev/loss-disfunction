import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({ site: 'https://lossdisfunction.com', integrations: [mdx(), tailwind({ applyBaseStyles: false })] });
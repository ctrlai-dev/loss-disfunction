import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lossdisfunction.com',
  integrations: [mdx(), tailwind({ applyBaseStyles: false })],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'astro': ['astro'],
            'mdx': ['@astrojs/mdx'],
          }
        }
      }
    }
  },
  // experimental: {
  //   contentCollectionCache: true,
  // }
});

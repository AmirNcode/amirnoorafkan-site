// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amirnoorafkan.com',
  compressHTML: true,
  integrations: [react(), sitemap()],
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.answerlayer.io',
  integrations: [sitemap(), react()],
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['intel', 'intel.tail0b4a76.ts.net', 'dev.local'],
    }
  }
});
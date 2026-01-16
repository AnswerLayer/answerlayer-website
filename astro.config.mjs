// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.getanswerlayer.com',
  integrations: [sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['intel', 'intel.tail0b4a76.ts.net', 'dev.local'],
    }
  }
});
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shalusharma.github.io',
  base: process.env.NODE_ENV === 'production' ? '/rk5-shopping-bar' : '/',
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shalusharma.github.io',
  base: process.env.GITHUB_ACTIONS ? '/rk5-shopping-bar' : '/',
});

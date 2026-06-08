import { defineConfig } from 'vite';

const GITHUB_PAGES_BASE = '/osrs-surfing-sim/';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? GITHUB_PAGES_BASE : '/',
  server: {
    port: 5173,
  },
});

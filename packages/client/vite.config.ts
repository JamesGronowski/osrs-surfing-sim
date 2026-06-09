import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const GITHUB_PAGES_BASE = '/osrs-surfing-sim/';
const clientDir = path.dirname(fileURLToPath(import.meta.url));
const engineSrc = path.resolve(clientDir, '../engine/src/index.ts');

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? GITHUB_PAGES_BASE : '/',
  resolve: {
    alias: {
      // Dev uses engine source so coralParkCoast elevation edits apply without rebuilding dist.
      '@osrs-surfing/engine': engineSrc,
    },
  },
  server: {
    port: 5173,
  },
});

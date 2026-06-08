import { test } from '@playwright/test';

import { runCoralParkPlaytest } from './helpers/playSession.js';

test.describe('gameplay flow', () => {
  test('walk, talk, mount, sail, trick successes, and trick failures', async ({ page }) => {
    test.setTimeout(300_000);
    await runCoralParkPlaytest(page, { screenshots: false });
  });
});

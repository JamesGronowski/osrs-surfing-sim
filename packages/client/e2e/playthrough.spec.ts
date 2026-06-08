import { test } from '@playwright/test';

import { runCoralParkPlaytest } from './helpers/playSession.js';

test.describe('visual playthrough', () => {
  test('coral park milestones with tricks and bails', async ({ page }) => {
    test.setTimeout(300_000);
    await runCoralParkPlaytest(page, { screenshots: true });
  });
});

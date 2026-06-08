import { expect, test } from '@playwright/test';

const FRAME_WIDTH = 765;
const FRAME_HEIGHT = 503;

test.describe('fixed classic layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: FRAME_WIDTH, height: FRAME_HEIGHT });
  });

  test('coral park', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#osrs-client');
    await page.waitForSelector('#game-root canvas');
    await page.waitForTimeout(300);
    await expect(page.locator('#osrs-client')).toHaveScreenshot('coral-park.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

import { createAnimationTestSlice, type TrickZone } from '@osrs-surfing/engine';
import { expect, test, type Page } from '@playwright/test';

import {
  advanceTicks,
  clickWorld,
  getSnapshot,
  prepareTrick,
  setSpeedState,
} from './helpers/playSession.js';

const ARENA = createAnimationTestSlice();
const HEADING_EAST = 0;
const ALIGNED_ZONES = ARENA.trickZones.filter((zone) => zone.rotationRadians === 0);
const COUNTER_RAIL = ARENA.trickZones.find((zone) => zone.id === 'anim-rail-counter')!;

/** Rail/wall hitboxes are only ~±0.64 tiles laterally — stay on the row before priming. */
const LATERAL_ALIGN_TOLERANCE = 0.6;

async function openAnimationScene(page: Page): Promise<void> {
  await page.setViewportSize({ width: 765, height: 503 });
  await page.goto('/?arena=animtest');
  await page.waitForSelector('#game-root canvas');
  await page.waitForFunction(() => window.__surfTest !== undefined);
  await page.waitForTimeout(400);
  await page.evaluate(() => window.__surfTest!.pause());
}

async function mountBoard(page: Page): Promise<void> {
  await clickWorld(page, ARENA.boardDockX, ARENA.boardDockY);
  for (let i = 0; i < 40; i += 1) {
    if ((await getSnapshot(page)).boardMounted) {
      await setSpeedState(page, 'riding');
      return;
    }
    await advanceTicks(page, 1);
  }
  throw new Error('Failed to mount board in animation scene');
}

/** Steer toward a waypoint on simulation ticks; recovers to riding after bails. */
async function rideTo(page: Page, x: number, y: number, within = 2): Promise<void> {
  for (let i = 0; i < 240; i += 1) {
    const snap = await getSnapshot(page);
    if (snap.trickAnimation) {
      await advanceTicks(page, 1);
      continue;
    }
    if (snap.surfboard.speedState !== 'riding') {
      await setSpeedState(page, 'riding');
    }
    const pos = snap.surfboard.position;
    if (Math.hypot(pos.x - x, pos.y - y) <= within) {
      return;
    }
    await clickWorld(page, x, y);
    await advanceTicks(page, 1);
  }
  throw new Error(`Did not reach waypoint (${x}, ${y})`);
}

/** Re-steer onto the feature row without orbiting (diagonal aim, not straight north/south). */
async function alignToRow(page: Page, rowY: number): Promise<void> {
  for (let i = 0; i < 60; i += 1) {
    const snap = await getSnapshot(page);
    if (snap.trickAnimation) {
      await advanceTicks(page, 1);
      continue;
    }
    const pos = snap.surfboard.position;
    if (Math.abs(pos.y - rowY) <= LATERAL_ALIGN_TOLERANCE) {
      return;
    }
    await clickWorld(page, pos.x + 4, rowY);
    await advanceTicks(page, 1);
  }
  throw new Error(`Failed to align to row y=${rowY}`);
}

/** Ride east into the zone along its row, priming on approach; returns when the trick lands. */
async function rideTrickThroughZone(page: Page, zone: TrickZone): Promise<void> {
  const before = (await getSnapshot(page)).progression.session.tricksLanded;
  const aimX = Math.min(ARENA.map.widthTiles - 3, zone.center.x + 30);

  for (let i = 0; i < 120; i += 1) {
    const snap = await getSnapshot(page);
    if (snap.surfboard.speedState !== 'riding' && !snap.trickAnimation) {
      await setSpeedState(page, 'riding');
    }
    const pos = snap.surfboard.position;
    const dist = Math.hypot(pos.x - zone.center.x, pos.y - zone.center.y);

    if (!snap.trickAnimation) {
      await clickWorld(page, aimX, zone.center.y);
      if (dist < 7 && dist > zone.radius * 0.6 && !snap.trickPrepare) {
        await prepareTrick(page, zone.prepareSlot);
      }
    }

    await advanceTicks(page, 1);

    const after = await getSnapshot(page);
    if (after.progression.session.tricksLanded > before && !after.trickAnimation) {
      return;
    }
  }
  throw new Error(`Failed to land trick on ${zone.id}`);
}

test.describe('animation test scene', () => {
  test('tricks exit in the direction of travel riding east through every feature', async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await openAnimationScene(page);
    await mountBoard(page);

    for (const zone of ALIGNED_ZONES) {
      await rideTo(page, zone.center.x - 9, zone.center.y);
      await alignToRow(page, zone.center.y);
      await rideTrickThroughZone(page, zone);

      const snap = await getSnapshot(page);
      expect(snap.surfboard.currentHeading, `${zone.id} exit heading`).toBe(HEADING_EAST);
      expect(snap.surfboard.position.x, `${zone.id} exit position`).toBeGreaterThan(zone.center.x);
    }
  });

  test('entering a counter-rotated feature keeps the rider traveling forward', async ({ page }) => {
    test.setTimeout(180_000);
    await openAnimationScene(page);
    await mountBoard(page);

    // The counter row's axis faces west; an eastbound entry must still exit
    // east with the rider's momentum instead of flipping them around.
    await rideTo(page, COUNTER_RAIL.center.x - 9, COUNTER_RAIL.center.y);
    await alignToRow(page, COUNTER_RAIL.center.y);
    await rideTrickThroughZone(page, COUNTER_RAIL);

    const snap = await getSnapshot(page);
    expect(snap.surfboard.currentHeading, 'counter-rotated exit heading').toBe(HEADING_EAST);
    expect(snap.surfboard.position.x, 'counter-rotated exit position').toBeGreaterThan(
      COUNTER_RAIL.center.x,
    );
  });
});

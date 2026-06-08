import {
  createCoralParkSlice,
  isTrickZoneSubmerged,
  type SimulationSnapshot,
  type TrickFeatureType,
  type TrickPrepareSlot,
  type TrickZone,
} from '@osrs-surfing/engine';
import { expect, type Locator, type Page } from '@playwright/test';

import '../../src/dev/surfTestBridge.js';

export const CORAL_PARK = createCoralParkSlice();

const FRAME_WIDTH = 765;
const FRAME_HEIGHT = 503;
const STEER_POLL_MS = 150;
const PLAYTHROUGH_SNAPSHOT_RATIO = 0.04;
/** Stop this many tiles outside the zone center before priming. */
const TRICK_PRIME_APPROACH_MARGIN = 4;
/** Stay at least this far outside the zone hitbox until after prepare. */
const TRICK_PRIME_MIN_OUTSIDE = 0.5;
/** Ticks to wait after prepare before entering bail scenarios (valid window is 1–4). */
const TRICK_BAIL_PRIME_TICKS_BEFORE_ENTRY = 1;
/** Ticks to wait after prepare so timing is expired before entry (max window is 4). */
const TRICK_EXPIRED_PREPARE_WAIT_TICKS = 7;

export interface PlaytestOptions {
  screenshots?: boolean;
  screenshotTarget?: '#game-root' | '#osrs-client';
}

export async function openGame(page: Page): Promise<void> {
  await page.setViewportSize({ width: FRAME_WIDTH, height: FRAME_HEIGHT });
  await page.goto('/');
  await page.waitForSelector('#game-root canvas');
  await page.waitForFunction(() => window.__surfTest !== undefined);
  await page.waitForTimeout(400);
}

export async function clickWorld(page: Page, x: number, y: number): Promise<void> {
  await page.evaluate(
    ([wx, wy]) => {
      window.__surfTest!.clickWorld(wx, wy);
    },
    [x, y] as const,
  );
}

export async function getSnapshot(page: Page): Promise<SimulationSnapshot> {
  return page.evaluate(() => window.__surfTest!.getSnapshot());
}

export async function setSpeedState(
  page: Page,
  state: 'seated' | 'paddling' | 'riding',
): Promise<void> {
  await page.evaluate((next) => window.__surfTest!.setSpeedState(next), state);
}

export async function prepareTrick(page: Page, slot: TrickPrepareSlot): Promise<void> {
  await page.evaluate((s) => window.__surfTest!.prepareTrick(s), slot);
}

async function clearTrickPrepare(page: Page): Promise<void> {
  await page.evaluate(() => window.__surfTest!.clearTrickPrepare());
}

export async function tickMs(page: Page): Promise<number> {
  return page.evaluate(() => window.__surfTest!.tickMs);
}

export async function advanceTicks(page: Page, count: number): Promise<void> {
  await page.evaluate((n) => window.__surfTest!.advanceTicks(n), count);
}

async function advanceTicksHoldOutsideZone(
  page: Page,
  _zone: TrickZone,
  count: number,
): Promise<void> {
  await page.evaluate(() => window.__surfTest!.setMovementFrozen(true));
  try {
    await advanceTicks(page, count);
  } finally {
    await page.evaluate(() => window.__surfTest!.setMovementFrozen(false));
  }
}

function distanceFromDock(zone: TrickZone): number {
  return Math.hypot(zone.center.x - CORAL_PARK.boardDockX, zone.center.y - CORAL_PARK.boardDockY);
}

/** Advance tide while paused until exposed features sit near the south beach. */
async function advanceTideForPlaytest(page: Page): Promise<void> {
  await page.evaluate(() => window.__surfTest!.pause());

  for (let i = 0; i < 200; i += 1) {
    const snap = await getSnapshot(page);
    const exposedRails = trickZonesOfType(snap, 'rail').filter(
      (zone) => distanceFromDock(zone) < 50,
    );
    if (exposedRails.length >= 2) {
      break;
    }
    await advanceTicks(page, 1);
  }

  await page.evaluate(() => {
    window.__surfTest!.renderFrame();
    window.__surfTest!.resume();
  });
}

export function trickZonesNearDock(
  snapshot: SimulationSnapshot,
  type: TrickFeatureType,
  maxDistance = 50,
): TrickZone[] {
  return trickZonesOfType(snapshot, type).filter((zone) => distanceFromDock(zone) < maxDistance);
}

async function tickUntilZoneExposed(page: Page, zone: TrickZone): Promise<void> {
  for (let i = 0; i < 250; i += 1) {
    const snap = await getSnapshot(page);
    if (!snap.tide || !isTrickZoneSubmerged(zone, snap.tide)) {
      return;
    }
    await advanceTicks(page, 1);
  }

  throw new Error(`${zone.id} did not become exposed for playtest`);
}

async function ensureZoneExposed(page: Page, zone: TrickZone): Promise<void> {
  await page.evaluate(() => window.__surfTest!.pause());
  await tickUntilZoneExposed(page, zone);
  await page.evaluate(() => {
    window.__surfTest!.renderFrame();
    window.__surfTest!.resume();
  });
}

async function pickPlaytestZone(
  page: Page,
  type: TrickFeatureType,
  preferNearDock = false,
): Promise<TrickZone> {
  const snap = await getSnapshot(page);
  const candidates = preferNearDock ? trickZonesNearDock(snap, type) : trickZonesOfType(snap, type);
  for (const zone of candidates) {
    await ensureZoneExposed(page, zone);
    return zone;
  }
  const zone = nearestTrickZone(snap, type);
  await ensureZoneExposed(page, zone);
  return zone;
}

async function withPausedSimulation(page: Page, run: () => Promise<void>): Promise<void> {
  await page.evaluate(() => {
    window.__surfTest!.pause();
    window.__surfTest!.setTideFrozen(true);
  });
  await run();
  await page.evaluate(() => {
    window.__surfTest!.setTideFrozen(false);
    window.__surfTest!.renderFrame();
    window.__surfTest!.resume();
  });
}

async function rideIntoZoneTicksBody(
  page: Page,
  zone: TrickZone,
  prepareSlot: TrickPrepareSlot | null,
  prepareAfterTicks: number,
): Promise<void> {
  await setSpeedState(page, 'riding');

  for (let i = 0; i < 100; i += 1) {
    if (prepareSlot !== null && prepareAfterTicks >= 0 && i === prepareAfterTicks) {
      await prepareTrick(page, prepareSlot);
    }

    await clickWorld(page, zone.center.x, zone.center.y);
    await advanceTicks(page, 1);

    const after = await getSnapshot(page);
    if (after.surfboard.speedState === 'seated') {
      return;
    }

    if (distanceToZone(after, zone) <= zone.radius + 0.3) {
      await advanceTicks(page, 2);
      return;
    }
  }

  throw new Error(
    `Did not reach ${zone.id} during tick ride (dist=${distanceToZone(await getSnapshot(page), zone).toFixed(1)})`,
  );
}

function approachPointOutside(zone: TrickZone, distanceOutside: number): { x: number; y: number } {
  const offset = zone.radius + distanceOutside;
  return {
    x: zone.center.x - Math.cos(zone.rotationRadians) * offset,
    y: zone.center.y - Math.sin(zone.rotationRadians) * offset,
  };
}

function isInPrimeApproachBand(snapshot: SimulationSnapshot, zone: TrickZone): boolean {
  const dist = distanceToZone(snapshot, zone);
  return (
    dist <= zone.radius + TRICK_PRIME_APPROACH_MARGIN &&
    dist > zone.radius + TRICK_PRIME_MIN_OUTSIDE
  );
}

async function rideNearZoneForPrepare(page: Page, zone: TrickZone): Promise<void> {
  const staging = approachPointOutside(zone, TRICK_PRIME_APPROACH_MARGIN);
  await setSpeedState(page, 'riding');

  for (let i = 0; i < 100; i += 1) {
    const snap = await getSnapshot(page);
    if (isInPrimeApproachBand(snap, zone)) {
      return;
    }

    const pos = snap.surfboard.position;
    const dist = distanceToZone(snap, zone);
    if (dist > zone.radius + TRICK_PRIME_APPROACH_MARGIN + 8) {
      await clickWorld(page, zone.center.x, zone.center.y);
    } else {
      const distToStaging = Math.hypot(pos.x - staging.x, pos.y - staging.y);
      if (distToStaging > 2) {
        await clickWorld(page, staging.x, staging.y);
      } else {
        const aheadX = pos.x + Math.cos(zone.rotationRadians) * 4;
        const aheadY = pos.y + Math.sin(zone.rotationRadians) * 4;
        await clickWorld(page, aheadX, aheadY);
      }
    }
    await advanceTicks(page, 1);

    const after = await getSnapshot(page);
    if (after.surfboard.speedState === 'seated') {
      await setSpeedState(page, 'paddling');
      await advanceTicks(page, 2);
      continue;
    }
    if (isInPrimeApproachBand(after, zone)) {
      return;
    }
  }

  throw new Error(
    `Did not approach ${zone.id} for prepare (dist=${distanceToZone(await getSnapshot(page), zone).toFixed(1)})`,
  );
}

/** Prime (optional), wait, then ride into the zone on simulation ticks. */
async function primeAndRideIntoZone(
  page: Page,
  zone: TrickZone,
  prepareSlot: TrickPrepareSlot | null,
  primeTicksBeforeEntry = TRICK_BAIL_PRIME_TICKS_BEFORE_ENTRY,
): Promise<void> {
  await withPausedSimulation(page, async () => {
    await clearTrickPrepare(page);
    await setSpeedState(page, 'riding');
    await rideNearZoneForPrepare(page, zone);
    if (prepareSlot !== null) {
      await prepareTrick(page, prepareSlot);
      await advanceTicksHoldOutsideZone(page, zone, primeTicksBeforeEntry);
    }
    await rideIntoZoneTicksBody(page, zone, null, -1);
  });
}

async function approachZoneForEntry(page: Page, zone: TrickZone): Promise<void> {
  if (distanceToZone(await getSnapshot(page), zone) > zone.radius + 12) {
    await steerTowardZone(page, zone, {
      arriveWithin: zone.radius + 12,
      paddlingOnly: true,
    });
  }
  await ensureZoneExposed(page, zone);
}

export function trickZonesOfType(
  snapshot: SimulationSnapshot,
  type: TrickFeatureType,
  onlyUntricked = true,
): TrickZone[] {
  const pos = snapshot.surfboard.position;
  return snapshot.trickZones
    .filter((zone) => {
      if (zone.type !== type) {
        return false;
      }
      if (onlyUntricked && zone.tricked) {
        return false;
      }
      if (snapshot.tide && isTrickZoneSubmerged(zone, snapshot.tide)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const da = Math.hypot(a.center.x - pos.x, a.center.y - pos.y);
      const db = Math.hypot(b.center.x - pos.x, b.center.y - pos.y);
      return da - db;
    });
}

export function nearestTrickZone(
  snapshot: SimulationSnapshot,
  type: TrickFeatureType,
  onlyUntricked = true,
): TrickZone {
  const zone = trickZonesOfType(snapshot, type, onlyUntricked)[0];
  if (!zone) {
    throw new Error(`No ${type} trick zone available`);
  }
  return zone;
}

function distanceToZone(snapshot: SimulationSnapshot, zone: TrickZone): number {
  const pos = snapshot.surfboard.position;
  return Math.hypot(pos.x - zone.center.x, pos.y - zone.center.y);
}

function isInsideAnyExposedTrickZone(snapshot: SimulationSnapshot, margin = 1): boolean {
  return snapshot.trickZones.some((zone) => {
    if (zone.tricked) {
      return false;
    }
    if (snapshot.tide && isTrickZoneSubmerged(zone, snapshot.tide)) {
      return false;
    }
    return distanceToZone(snapshot, zone) <= zone.radius + margin;
  });
}

async function waitForMounted(page: Page): Promise<void> {
  await page.waitForFunction(() => window.__surfTest!.getSnapshot().boardMounted, undefined, {
    timeout: 30_000,
  });
}

async function waitForSpeedState(
  page: Page,
  state: 'paddling' | 'riding',
  timeout = 15_000,
): Promise<void> {
  await page.waitForFunction(
    (expected) => window.__surfTest!.getSnapshot().surfboard.speedState === expected,
    state,
    { timeout },
  );
}

async function waitForChat(page: Page, pattern: RegExp, timeout = 20_000): Promise<void> {
  await expect(page.locator('#chat-messages')).toContainText(pattern, { timeout });
}

async function ensurePaddling(page: Page): Promise<void> {
  const snap = await getSnapshot(page);
  if (snap.surfboard.speedState === 'paddling') {
    return;
  }
  await setSpeedState(page, 'paddling');
  await waitForSpeedState(page, 'paddling');
}

async function ensureRiding(page: Page): Promise<void> {
  const snap = await getSnapshot(page);
  if (snap.surfboard.speedState === 'riding') {
    return;
  }
  await setSpeedState(page, 'riding');
  await waitForSpeedState(page, 'riding');
}

async function steerAwayFromZone(page: Page, zone: TrickZone): Promise<void> {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const snap = await getSnapshot(page);
    if (distanceToZone(snap, zone) > zone.radius + 2.5) {
      return;
    }

    const pos = snap.surfboard.position;
    const vx = pos.x - zone.center.x;
    const vy = pos.y - zone.center.y;
    const len = Math.hypot(vx, vy) || 1;
    await clickWorld(page, pos.x + (vx / len) * 20, pos.y + (vy / len) * 20);

    if (snap.surfboard.speedState === 'seated') {
      await setSpeedState(page, 'paddling');
      await waitForSpeedState(page, 'paddling', 10_000);
    }

    await page.waitForTimeout(STEER_POLL_MS);
  }

  throw new Error(`Could not sail away from ${zone.id}`);
}

async function steerClearOfTrickZones(page: Page): Promise<void> {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const snap = await getSnapshot(page);
    if (!isInsideAnyExposedTrickZone(snap, 2)) {
      return;
    }

    await ensurePaddling(page);

    const blockingZone = snap.trickZones
      .filter((candidate) => {
        if (candidate.tricked) {
          return false;
        }
        if (snap.tide && isTrickZoneSubmerged(candidate, snap.tide)) {
          return false;
        }
        return distanceToZone(snap, candidate) <= candidate.radius + 4;
      })
      .sort((a, b) => distanceToZone(snap, a) - distanceToZone(snap, b))[0];

    const pos = snap.surfboard.position;
    if (blockingZone) {
      const vx = pos.x - blockingZone.center.x;
      const vy = pos.y - blockingZone.center.y;
      const len = Math.hypot(vx, vy) || 1;
      await clickWorld(page, pos.x + (vx / len) * 20, pos.y + (vy / len) * 20);
    } else {
      await clickWorld(page, CORAL_PARK.boardDockX, CORAL_PARK.boardDockY);
    }

    await page.waitForTimeout(STEER_POLL_MS);
  }

  throw new Error('Could not clear trick zones after bail');
}

async function recoverAfterBail(page: Page, zone: TrickZone): Promise<void> {
  await steerAwayFromZone(page, zone);
  await steerClearOfTrickZones(page);
  await setSpeedState(page, 'riding');
  await waitForSpeedState(page, 'riding');
}

interface SteerOptions {
  timeoutMs?: number;
  /** Stop while still outside the feature hitbox. */
  holdOutside?: boolean;
  /** Stop when within this many tiles of the zone center (without entering). */
  arriveWithin?: number;
  /** Approach at paddle speed so crossing other features does not bail. */
  paddlingOnly?: boolean;
}

async function steerTowardZone(
  page: Page,
  zone: TrickZone,
  options: SteerOptions = {},
): Promise<number> {
  const timeoutMs = options.timeoutMs ?? 240_000;
  const holdOutside = options.holdOutside ?? false;
  const arriveWithin = options.arriveWithin;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const snap = await getSnapshot(page);
    if (!snap.boardMounted) {
      throw new Error('Lost board mount while sailing');
    }

    const dist = distanceToZone(snap, zone);

    if (snap.surfboard.speedState === 'seated') {
      if (!holdOutside && dist <= zone.radius + 0.5) {
        return dist;
      }
      await ensurePaddling(page);
      continue;
    }

    if (options.paddlingOnly) {
      if (snap.surfboard.speedState === 'riding') {
        await ensurePaddling(page);
      }
    } else {
      await ensureRiding(page);
    }

    if (arriveWithin !== undefined && dist <= arriveWithin) {
      return dist;
    }
    if (holdOutside && dist <= zone.radius + 2.5) {
      return dist;
    }
    if (!holdOutside && arriveWithin === undefined && dist <= zone.radius + 0.25) {
      return dist;
    }

    const pos = snap.surfboard.position;
    if (dist > 20) {
      await clickWorld(page, zone.center.x, zone.center.y);
    } else if (dist > zone.radius + (holdOutside ? 4 : 2.5)) {
      await clickWorld(page, zone.center.x, zone.center.y);
    } else {
      const aheadX = pos.x + Math.cos(zone.rotationRadians) * 5;
      const aheadY = pos.y + Math.sin(zone.rotationRadians) * 5;
      await clickWorld(page, aheadX, aheadY);
    }

    await page.waitForTimeout(STEER_POLL_MS);
  }

  throw new Error(`Timed out steering toward ${zone.id}`);
}

async function waitForBail(page: Page, timeoutMs = 20_000): Promise<void> {
  const snap = await getSnapshot(page);
  if (snap.surfboard.speedState !== 'seated') {
    await page.waitForFunction(
      () => window.__surfTest!.getSnapshot().surfboard.speedState === 'seated',
      undefined,
      { timeout: timeoutMs },
    );
  }
  await page.evaluate(() => window.__surfTest!.advanceTicks(1));
  await waitForChat(page, /Bailed/i, timeoutMs);
}

async function freezeFrame(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.__surfTest!.pause();
    window.__surfTest!.renderFrame();
  });
}

async function unfreezeFrame(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.__surfTest!.resume();
  });
}

async function captureStep(
  page: Page,
  locator: Locator,
  snapshotName: string,
  enabled: boolean,
): Promise<void> {
  if (!enabled) {
    return;
  }
  await freezeFrame(page);
  await expect(locator).toHaveScreenshot(`playthrough/${snapshotName}`, {
    maxDiffPixelRatio: PLAYTHROUGH_SNAPSHOT_RATIO,
  });
  await unfreezeFrame(page);
}

async function mountAndSailToward(page: Page, target: TrickZone): Promise<void> {
  await clickWorld(page, CORAL_PARK.boardDockX, CORAL_PARK.boardDockY);
  await waitForMounted(page);
  await setSpeedState(page, 'paddling');
  await clickWorld(page, target.center.x, target.center.y);
  await waitForSpeedState(page, 'paddling');
  await setSpeedState(page, 'riding');
  await waitForSpeedState(page, 'riding');
  await steerTowardZone(page, target, {
    timeoutMs: 240_000,
    arriveWithin: target.radius + 10,
  });
}

async function landTrickOnZone(page: Page, zone: TrickZone): Promise<void> {
  const before = (await getSnapshot(page)).progression.session.tricksLanded;
  await approachZoneForEntry(page, zone);

  await withPausedSimulation(page, async () => {
    await clearTrickPrepare(page);
    await setSpeedState(page, 'riding');

    for (let i = 0; i < 120; i += 1) {
      const snap = await getSnapshot(page);
      const pos = snap.surfboard.position;
      const dist = Math.hypot(pos.x - zone.center.x, pos.y - zone.center.y);

      if (dist > 10) {
        await clickWorld(page, zone.center.x, zone.center.y);
      } else if (dist > zone.radius) {
        await clickWorld(page, zone.center.x, zone.center.y);
      } else {
        const aheadX = pos.x + Math.cos(zone.rotationRadians) * 4;
        const aheadY = pos.y + Math.sin(zone.rotationRadians) * 4;
        await clickWorld(page, aheadX, aheadY);
      }

      if (dist < 7 && dist > zone.radius * 0.6 && !snap.trickPrepare) {
        await prepareTrick(page, zone.prepareSlot);
      }

      await advanceTicks(page, 1);

      const after = await getSnapshot(page);
      if (after.progression.session.tricksLanded > before) {
        return;
      }
    }
  });

  const afterRide = await getSnapshot(page);
  if (afterRide.progression.session.tricksLanded <= before) {
    throw new Error(`Failed to land ${zone.type} at ${zone.id}`);
  }
  await page.evaluate(() => window.__surfTest!.advanceTicks(1));
}

async function bailWithWrongPrepare(page: Page, zone: TrickZone): Promise<void> {
  const wrongSlot = ((zone.prepareSlot + 1) % 3) as TrickPrepareSlot;
  const before = (await getSnapshot(page)).progression.session.tricksLanded;

  await approachZoneForEntry(page, zone);
  await primeAndRideIntoZone(page, zone, wrongSlot);

  await waitForBail(page);
  expect((await getSnapshot(page)).progression.session.tricksLanded).toBe(before);
  await recoverAfterBail(page, zone);
}

async function bailWithNoPrepare(page: Page, zone: TrickZone): Promise<void> {
  const before = (await getSnapshot(page)).progression.session.tricksLanded;

  await approachZoneForEntry(page, zone);
  await primeAndRideIntoZone(page, zone, null);

  await waitForBail(page);
  expect((await getSnapshot(page)).progression.session.tricksLanded).toBe(before);
  await recoverAfterBail(page, zone);
}

async function bailWithExpiredPrepare(page: Page, zone: TrickZone): Promise<void> {
  const before = (await getSnapshot(page)).progression.session.tricksLanded;

  await approachZoneForEntry(page, zone);
  await withPausedSimulation(page, async () => {
    await clearTrickPrepare(page);
    await setSpeedState(page, 'riding');
    await rideNearZoneForPrepare(page, zone);
    await prepareTrick(page, zone.prepareSlot);
    await advanceTicksHoldOutsideZone(page, zone, TRICK_EXPIRED_PREPARE_WAIT_TICKS);
    await rideIntoZoneTicksBody(page, zone, null, -1);
  });

  await waitForBail(page);
  expect((await getSnapshot(page)).progression.session.tricksLanded).toBe(before);
  await recoverAfterBail(page, zone);
}

export async function runCoralParkPlaytest(
  page: Page,
  options: PlaytestOptions = {},
): Promise<void> {
  const npc = CORAL_PARK.npcs[0];
  const screenshots = options.screenshots ?? false;
  const shotTarget = options.screenshotTarget ?? '#game-root';
  const shotLocator = page.locator(shotTarget);

  await openGame(page);
  await advanceTideForPlaytest(page);
  await captureStep(page, shotLocator, '01-spawn.png', screenshots);

  const snap = await getSnapshot(page);
  const dockRails = trickZonesNearDock(snap, 'rail');
  const firstRail = dockRails[0] ?? nearestTrickZone(snap, 'rail');

  await clickWorld(page, npc.x, npc.y);
  await waitForChat(page, /Kaulu/);
  await captureStep(page, shotLocator, '02-npc-dialogue.png', screenshots);

  await mountAndSailToward(page, firstRail);
  await captureStep(page, shotLocator, '03-riding-reef.png', screenshots);

  const railForWrongPrepare = await pickPlaytestZone(page, 'rail');
  await bailWithWrongPrepare(page, railForWrongPrepare);
  await captureStep(page, shotLocator, '04-bail-wrong-prepare.png', screenshots);

  const tunnelForNoPrepare = await pickPlaytestZone(page, 'tunnel');
  await bailWithNoPrepare(page, tunnelForNoPrepare);
  await captureStep(page, shotLocator, '05-bail-no-prepare.png', screenshots);

  const jumpForExpire = await pickPlaytestZone(page, 'jump');
  await bailWithExpiredPrepare(page, jumpForExpire);
  await captureStep(page, shotLocator, '06-bail-expired-prepare.png', screenshots);

  const railForLand = await pickPlaytestZone(page, 'rail', true);
  const tricksBeforeRail = (await getSnapshot(page)).progression.session.tricksLanded;
  await landTrickOnZone(page, railForLand);
  await waitForChat(page, /Agility XP|Coral Tokens|Sailing XP/);
  await captureStep(page, shotLocator, '07-rail-trick-landed.png', screenshots);
  expect((await getSnapshot(page)).progression.session.tricksLanded).toBeGreaterThan(
    tricksBeforeRail,
  );

  const tunnelTarget = await pickPlaytestZone(page, 'tunnel', true);
  const tricksBeforeTunnel = (await getSnapshot(page)).progression.session.tricksLanded;
  await landTrickOnZone(page, tunnelTarget);
  await captureStep(page, shotLocator, '08-tunnel-trick-landed.png', screenshots);
  expect((await getSnapshot(page)).progression.session.tricksLanded).toBeGreaterThan(
    tricksBeforeTunnel,
  );

  const jumpTarget = await pickPlaytestZone(page, 'jump', true);
  const tricksBeforeJump = (await getSnapshot(page)).progression.session.tricksLanded;
  await landTrickOnZone(page, jumpTarget);
  await captureStep(page, shotLocator, '09-jump-trick-landed.png', screenshots);

  expect((await getSnapshot(page)).progression.session.tricksLanded).toBeGreaterThan(
    tricksBeforeJump,
  );
  expect((await getSnapshot(page)).progression.session.tricksLanded).toBeGreaterThanOrEqual(3);
}

/** @deprecated Use runCoralParkPlaytest */
export async function runCoralParkPlaythrough(
  page: Page,
  options: PlaytestOptions = {},
): Promise<void> {
  await runCoralParkPlaytest(page, options);
}

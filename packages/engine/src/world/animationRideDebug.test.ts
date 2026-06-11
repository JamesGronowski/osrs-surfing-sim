import { describe, expect, it } from 'vitest';

import { GameSimulation } from '../game/simulation.js';
import { createAnimationTestSlice } from './animationTestArena.js';
import type { TrickZone } from './features.js';

const TRICK_PRIME_APPROACH_MARGIN = 4;
const TRICK_PRIME_MIN_OUTSIDE = 0.5;
const LATERAL_ALIGN_TOLERANCE = 0.6;
const TRICK_PRIME_TICKS_BEFORE_ENTRY = 1;
const PRIME_READY_OUTSIDE = 0.4;

function distanceToZone(pos: { x: number; y: number }, zone: TrickZone): number {
  return Math.hypot(pos.x - zone.center.x, pos.y - zone.center.y);
}

function lateralOffsetFromZone(pos: { x: number; y: number }, zone: TrickZone): number {
  const axisX = Math.cos(zone.rotationRadians);
  const axisY = Math.sin(zone.rotationRadians);
  const normalX = -axisY;
  const normalY = axisX;
  const dx = pos.x - zone.center.x;
  const dy = pos.y - zone.center.y;
  return Math.abs(dx * normalX + dy * normalY);
}

function stagingPointWest(zone: TrickZone): { x: number; y: number } {
  return {
    x: zone.center.x - (zone.radius + TRICK_PRIME_APPROACH_MARGIN),
    y: zone.center.y,
  };
}

function isInPrimeApproachBand(pos: { x: number; y: number }, zone: TrickZone): boolean {
  const dist = distanceToZone(pos, zone);
  return (
    dist <= zone.radius + TRICK_PRIME_APPROACH_MARGIN &&
    dist > zone.radius + TRICK_PRIME_MIN_OUTSIDE
  );
}

function isReadyToPrime(pos: { x: number; y: number }, zone: TrickZone): boolean {
  return distanceToZone(pos, zone) <= zone.radius + TRICK_PRIME_MIN_OUTSIDE + PRIME_READY_OUTSIDE;
}

function rideTo(sim: GameSimulation, x: number, y: number): void {
  for (let i = 0; i < 240; i += 1) {
    const snap = sim.getSnapshot();
    if (snap.trickAnimation) {
      sim.tick();
      continue;
    }
    if (snap.surfboard.speedState !== 'riding') {
      sim.setSpeedState('riding');
    }
    const pos = snap.surfboard.position;
    if (Math.hypot(pos.x - x, pos.y - y) <= 2) {
      return;
    }
    sim.clickOcean(x, y);
    sim.tick();
  }
  throw new Error(`rideTo failed (${x}, ${y})`);
}

function rideNearZoneForPrepare(sim: GameSimulation, zone: TrickZone, mapWidth: number): void {
  const staging = stagingPointWest(zone);
  const aimX = Math.min(mapWidth - 3, zone.center.x + 30);

  for (let i = 0; i < 120; i += 1) {
    const snap = sim.getSnapshot();
    if (snap.trickAnimation) {
      sim.tick();
      continue;
    }
    if (snap.surfboard.speedState !== 'riding') {
      sim.setSpeedState('riding');
    }
    const pos = snap.surfboard.position;
    if (
      isReadyToPrime(pos, zone) &&
      lateralOffsetFromZone(pos, zone) <= LATERAL_ALIGN_TOLERANCE
    ) {
      return;
    }

    if (lateralOffsetFromZone(pos, zone) > LATERAL_ALIGN_TOLERANCE && pos.x >= staging.x - 2) {
      const aheadX = Math.max(pos.x + 4, staging.x);
      sim.clickOcean(aheadX, zone.center.y);
    } else if (!isInPrimeApproachBand(pos, zone)) {
      const distToStaging = Math.hypot(pos.x - staging.x, pos.y - staging.y);
      if (distToStaging > 2) {
        sim.clickOcean(staging.x, staging.y);
      } else {
        sim.clickOcean(aimX, zone.center.y);
      }
    }

    sim.tick();
  }

  throw new Error(`Did not reach prime band for ${zone.id}`);
}

function rideTrickThroughZone(sim: GameSimulation, zone: TrickZone, mapWidth: number): void {
  const before = sim.getSnapshot().progression.session.tricksLanded;
  const aimX = Math.min(mapWidth - 3, zone.center.x + 30);

  rideNearZoneForPrepare(sim, zone, mapWidth);
  sim.prepareTrick(zone.prepareSlot);
  sim.setMovementFrozen(true);
  for (let i = 0; i < TRICK_PRIME_TICKS_BEFORE_ENTRY; i += 1) {
    sim.tick();
  }
  sim.setMovementFrozen(false);

  for (let i = 0; i < 80; i += 1) {
    const snap = sim.getSnapshot();
    if (snap.surfboard.speedState !== 'riding' && !snap.trickAnimation) {
      sim.setSpeedState('riding');
    }
    if (!snap.trickAnimation) {
      sim.clickOcean(aimX, zone.center.y);
    }
    sim.tick();

    const after = sim.getSnapshot();
    if (after.progression.session.tricksLanded > before && !after.trickAnimation) {
      return;
    }
  }

  const dialogue = sim.consumeDialogue().join(' | ');
  throw new Error(
    `Failed ${zone.id}: speed=${sim.getSnapshot().surfboard.speedState} pos=${JSON.stringify(sim.getSnapshot().surfboard.position)} dialogue=${dialogue}`,
  );
}

describe('animation ride debug', () => {
  it('matches e2e eastbound trick driver', () => {
    const arena = createAnimationTestSlice();
    const aligned = arena.trickZones.filter((zone) => zone.rotationRadians === 0);
    const sim = new GameSimulation({ arena });

    sim.clickWorld(arena.boardDockX, arena.boardDockY);
    for (let i = 0; i < 40; i += 1) {
      sim.tick();
      if (sim.getSnapshot().boardMounted) {
        break;
      }
    }
    sim.setSpeedState('riding');

    for (const zone of aligned) {
      rideTo(sim, zone.center.x - 9, zone.center.y);
      rideTrickThroughZone(sim, zone, arena.map.widthTiles);
      expect(sim.getSnapshot().surfboard.currentHeading).toBe(0);
      expect(sim.getSnapshot().surfboard.position.x).toBeGreaterThan(zone.center.x);
    }
  });
});

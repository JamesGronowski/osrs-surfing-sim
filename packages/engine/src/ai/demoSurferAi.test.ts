import { describe, expect, it } from 'vitest';

import { createTideState, isPointInTideSweep } from '../world/features.js';
import { createCoralParkSlice } from '../world/maps.js';
import { createSurfboard } from '../movement/surfboard.js';
import {
  computeDemoSurferAi,
  demoSurferSpawnOnReef,
  DEMO_SURFER_RING_DEPTH,
  DEMO_SURFER_SPIN_LEADING_FRACTION,
  reefRideClockwiseRadians,
  shouldStartTideSpin,
} from './demoSurferAi.js';
import { headingToDegrees } from '../movement/heading.js';
import {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
} from '../world/coralParkCoast.js';
import { getTile } from '../world/collision.js';

describe('demoSurferAi', () => {
  it('spawns on rideable reef tiles facing clockwise around the island', () => {
    const spawnAngle = -Math.PI / 4;
    const spawn = demoSurferSpawnOnReef(spawnAngle);
    const arena = createCoralParkSlice();

    expect(getTile(arena.map, Math.floor(spawn.x), Math.floor(spawn.y))).toBe('coral_rideable');
    expect(headingToDegrees(spawn.heading)).toBeCloseTo(
      (reefRideClockwiseRadians(spawnAngle) * 180) / Math.PI,
      0,
    );
  });

  it('paddles when submerged and slows near the approaching high-tide front', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const spawn = demoSurferSpawnOnReef(0);
    const submerged = { x: spawn.x, y: spawn.y };

    const submergedAi = computeDemoSurferAi({
      surfboard: {
        ...createSurfboard(submerged.x, submerged.y, spawn.heading),
        speedState: 'riding',
      },
      trickPrepare: null,
      trickZones: arena.trickZones,
      tide,
      map: arena.map,
    });
    expect(submergedAi.lieDown).toBe(true);
    expect(isPointInTideSweep(submerged.x, submerged.y, tide)).toBe(true);

    const dryAngle = tide.phaseRadians + tide.sweepRadians + tide.sweepRadians * 0.35;
    const inner = coralParkReefInnerRadius(dryAngle);
    const outer = coralParkReefOuterRadius(dryAngle);
    const radius = inner + (outer - inner) * DEMO_SURFER_RING_DEPTH;
    const ahead = {
      x: CORAL_PARK_ISLAND_CX + Math.cos(dryAngle) * radius,
      y: CORAL_PARK_ISLAND_CY + Math.sin(dryAngle) * radius,
    };

    const slowAi = computeDemoSurferAi({
      surfboard: {
        ...createSurfboard(ahead.x, ahead.y, spawn.heading),
        speedState: 'riding',
      },
      trickPrepare: null,
      trickZones: [],
      tide,
      map: arena.map,
    });
    expect(slowAi.lieDown).toBe(true);
    expect(isPointInTideSweep(ahead.x, ahead.y, tide)).toBe(false);

    const nearLeadingAngle =
      tide.phaseRadians - tide.sweepRadians * DEMO_SURFER_SPIN_LEADING_FRACTION * 0.45;
    const nearInner = coralParkReefInnerRadius(nearLeadingAngle);
    const nearOuter = coralParkReefOuterRadius(nearLeadingAngle);
    const nearRadius = nearInner + (nearOuter - nearInner) * DEMO_SURFER_RING_DEPTH;
    const nearLeading = {
      x: CORAL_PARK_ISLAND_CX + Math.cos(nearLeadingAngle) * nearRadius,
      y: CORAL_PARK_ISLAND_CY + Math.sin(nearLeadingAngle) * nearRadius,
    };

    const cautiousAi = computeDemoSurferAi({
      surfboard: {
        ...createSurfboard(nearLeading.x, nearLeading.y, spawn.heading),
        speedState: 'riding',
      },
      trickPrepare: null,
      trickZones: [],
      tide,
      map: arena.map,
    });
    expect(cautiousAi.lieDown).toBe(true);
    expect(
      shouldStartTideSpin(
        nearLeading,
        createSurfboard(nearLeading.x, nearLeading.y, spawn.heading),
        tide,
      ),
    ).toBe(true);
  });
});

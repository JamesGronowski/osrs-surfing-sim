import { describe, expect, it } from 'vitest';

import {
  createTideState,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  tickTide,
} from '../world/features.js';
import { createCoralParkSlice } from '../world/maps.js';
import { createSurfboard } from '../movement/surfboard.js';
import {
  computeDemoSurferAi,
  demoSurferSpawnOnReef,
  DEMO_SURFER_INNER_RING_DEPTH,
  DEMO_SURFER_RING_DEPTH,
  DEMO_SURFER_SPIN_LEADING_FRACTION,
  isDryZoneFrontHalf,
  reefRideClockwiseRadians,
  shouldStartTideSpin,
  targetRingDepth,
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

  it('paddles when submerged or near tide edges and rides through the dry reef middle', () => {
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
    expect(submergedAi.input.lieDown).toBe(true);
    expect(isPointInTideSweep(submerged.x, submerged.y, tide)).toBe(true);

    const dryAngle = tide.phaseRadians + tide.sweepRadians + tide.sweepRadians * 0.35;
    const inner = coralParkReefInnerRadius(dryAngle);
    const outer = coralParkReefOuterRadius(dryAngle);
    const radius = inner + (outer - inner) * DEMO_SURFER_RING_DEPTH;
    const ahead = {
      x: CORAL_PARK_ISLAND_CX + Math.cos(dryAngle) * radius,
      y: CORAL_PARK_ISLAND_CY + Math.sin(dryAngle) * radius,
    };

    const midDryAi = computeDemoSurferAi({
      surfboard: {
        ...createSurfboard(ahead.x, ahead.y, spawn.heading),
        speedState: 'riding',
      },
      trickPrepare: null,
      trickZones: [],
      tide,
      map: arena.map,
    });
    expect(midDryAi.input.standUp).toBe(true);
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
    expect(cautiousAi.input.lieDown).toBe(true);
    expect(
      shouldStartTideSpin(
        nearLeading,
        createSurfboard(nearLeading.x, nearLeading.y, spawn.heading),
        tide,
      ),
    ).toBe(true);
  });

  it('rides tighter on the inside reef when the white wash is closing in', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const nearLeadingAngle =
      tide.phaseRadians - tide.sweepRadians * DEMO_SURFER_SPIN_LEADING_FRACTION * 0.45;

    expect(targetRingDepth(nearLeadingAngle, tide)).toBeLessThan(DEMO_SURFER_RING_DEPTH);
    expect(targetRingDepth(nearLeadingAngle, tide)).toBeGreaterThanOrEqual(
      DEMO_SURFER_INNER_RING_DEPTH,
    );

    const dryAngle = tide.phaseRadians + tide.sweepRadians + tide.sweepRadians * 0.35;
    expect(targetRingDepth(dryAngle, tide)).toBe(DEMO_SURFER_RING_DEPTH);
  });

  it('homes toward nearby tricks in the front half of the dry zone', () => {
    const arena = createCoralParkSlice();
    let tide = createTideState(arena.tide!);
    let exposedZone = arena.trickZones.find((zone) => !isTrickZoneSubmerged(zone, tide));
    let zoneAngle = 0;

    for (let i = 0; i < 400 && exposedZone; i += 1) {
      zoneAngle = Math.atan2(
        exposedZone.center.y - CORAL_PARK_ISLAND_CY,
        exposedZone.center.x - CORAL_PARK_ISLAND_CX,
      );
      if (isDryZoneFrontHalf(zoneAngle, tide)) {
        break;
      }
      tide = tickTide(tide);
      exposedZone = arena.trickZones.find((zone) => !isTrickZoneSubmerged(zone, tide));
    }

    expect(exposedZone).toBeDefined();
    expect(isDryZoneFrontHalf(zoneAngle, tide)).toBe(true);

    const approachAngle = zoneAngle - 0.22;
    const inner = coralParkReefInnerRadius(approachAngle);
    const outer = coralParkReefOuterRadius(approachAngle);
    const radius = inner + (outer - inner) * DEMO_SURFER_RING_DEPTH;
    const approach = {
      x: CORAL_PARK_ISLAND_CX + Math.cos(approachAngle) * radius,
      y: CORAL_PARK_ISLAND_CY + Math.sin(approachAngle) * radius,
    };
    const spawn = demoSurferSpawnOnReef(approachAngle);

    const ai = computeDemoSurferAi({
      surfboard: {
        ...createSurfboard(approach.x, approach.y, spawn.heading),
        speedState: 'riding',
      },
      trickPrepare: null,
      trickZones: arena.trickZones,
      tide,
      map: arena.map,
    });

    expect(ai.input.standUp).toBe(true);
    expect(
      Math.hypot(approach.x - exposedZone!.center.x, approach.y - exposedZone!.center.y),
    ).toBeLessThan(30);
  });
});

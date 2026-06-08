import { describe, expect, it } from 'vitest';

import { getTile } from './collision.js';
import {
  clockwiseAngleDelta,
  createTideState,
  findTrickZoneAt,
  isApproachHeadingValid,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  tideTrailingEdgeRadians,
  type TrickZone,
} from './features.js';
import { createCoralParkSlice } from './maps.js';
import {
  createTrickZoneAtAngle,
  createTrickZoneTideSyncState,
  syncTrickZonesWithTide,
} from './trickZonePlacement.js';

const tide = createTideState({
  centerX: 24,
  centerY: 11,
  innerRadius: 5.5,
  outerRadius: 8.5,
  sweepRadians: Math.PI / 2,
  advancePerTick: 0.02,
});

describe('trick approach', () => {
  it('validates rider heading against feature rotation', () => {
    const zone: TrickZone = {
      id: 'test',
      type: 'rail',
      prepareSlot: 0,
      center: { x: 0, y: 0 },
      radius: 2,
      rotationRadians: 0,
      tricked: false,
    };
    expect(isApproachHeadingValid(zone, 0)).toBe(true);
    expect(isApproachHeadingValid(zone, 8)).toBe(false);
    expect(isApproachHeadingValid(zone, 1)).toBe(true);
  });
});

describe('ring tide', () => {
  it('covers reef points in the sweep arc', () => {
    expect(isPointInTideSweep(30, 11, tide)).toBe(true);
    expect(isPointInTideSweep(18, 11, tide)).toBe(false);
  });

  it('submerges trick zones under the tide', () => {
    const zone: TrickZone = {
      id: 'east',
      type: 'rail',
      prepareSlot: 0,
      center: { x: 30, y: 11 },
      radius: 1,
      rotationRadians: -Math.PI / 2,
      tricked: false,
    };
    expect(isTrickZoneSubmerged(zone, tide)).toBe(true);
    expect(findTrickZoneAt([zone], { x: 30, y: 11 }, tide)).toBeNull();
    expect(findTrickZoneAt([zone], { x: 30, y: 11 }, null)).toBe(zone);
  });

  it('reports trailing edge past the submerged arc', () => {
    expect(tideTrailingEdgeRadians(tide)).toBeCloseTo(Math.PI / 2);
    expect(clockwiseAngleDelta(0, Math.PI / 4)).toBeCloseTo(Math.PI / 4);
  });
});

describe('syncTrickZonesWithTide', () => {
  it('removes submerged zones and refills the dry reef arc', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const submerged = arena.trickZones.find((zone) => isTrickZoneSubmerged(zone, tideState));
    expect(submerged).toBeDefined();

    const syncState = createTrickZoneTideSyncState(tideState);
    const afterSubmerge = syncTrickZonesWithTide(
      arena.trickZones,
      tideState,
      arena.map,
      syncState,
      arena.trickZones.length,
    );
    expect(afterSubmerge.some((zone) => zone.id === submerged!.id)).toBe(false);
    expect(afterSubmerge.length).toBe(arena.trickZones.length);

    let currentTide = tideState;
    let zones = afterSubmerge;
    for (let i = 0; i < 200; i += 1) {
      currentTide = {
        ...currentTide,
        phaseRadians: currentTide.phaseRadians + currentTide.advancePerTick,
      };
      zones = syncTrickZonesWithTide(
        zones,
        currentTide,
        arena.map,
        syncState,
        arena.trickZones.length,
      );
    }

    expect(zones.length).toBe(arena.trickZones.length);
    for (const zone of zones) {
      expect(isTrickZoneSubmerged(zone, currentTide)).toBe(false);
      expect(getTile(arena.map, Math.floor(zone.center.x), Math.floor(zone.center.y))).toBe(
        'coral_rideable',
      );
    }
  });
});

describe('createTrickZoneAtAngle', () => {
  it('places a feature on exposed reef at the given angle', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const spawnAngle = tideTrailingEdgeRadians(tideState) + 0.35;

    const zone = createTrickZoneAtAngle(
      arena.map,
      spawnAngle,
      tideState,
      'test-spawn',
      arena.trickZones,
      () => 0.5,
    );

    expect(zone).not.toBeNull();
    expect(zone!.tricked).toBe(false);
    expect(isTrickZoneSubmerged(zone!, tideState)).toBe(false);
  });
});

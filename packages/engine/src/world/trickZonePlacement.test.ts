import { describe, expect, it } from 'vitest';

import { getTile } from './collision.js';
import { createTideState, isTrickZoneSubmerged, tideTrailingEdgeRadians } from './features.js';
import { CORAL_PARK_TRICK_ZONE_COUNT, createCoralParkSlice } from './maps.js';
import {
  createTrickZoneAtAngle,
  createTrickZoneTideSyncState,
  pickRandomTrickType,
  syncTrickZonesWithTide,
  TRICK_TYPE_TO_PREPARE_SLOT,
} from './trickZonePlacement.js';

describe('syncTrickZonesWithTide', () => {
  it('maintains target count after tide cycles', () => {
    const arena = createCoralParkSlice();
    let tide = createTideState(arena.tide!);
    let zones = arena.trickZones.map((zone) => ({ ...zone }));
    const syncState = createTrickZoneTideSyncState(tide);

    for (let tick = 0; tick < 300; tick += 1) {
      tide = { ...tide, phaseRadians: tide.phaseRadians + tide.advancePerTick };
      zones = syncTrickZonesWithTide(
        zones,
        tide,
        arena.map,
        syncState,
        CORAL_PARK_TRICK_ZONE_COUNT,
      );
    }

    expect(zones).toHaveLength(CORAL_PARK_TRICK_ZONE_COUNT);
    for (const zone of zones) {
      expect(isTrickZoneSubmerged(zone, tide)).toBe(false);
      expect(getTile(arena.map, Math.floor(zone.center.x), Math.floor(zone.center.y))).toBe(
        'coral_rideable',
      );
    }
  });
});

describe('createTrickZoneAtAngle', () => {
  it('spawns on dry reef at the low-tide line', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const spawnAngle = tideTrailingEdgeRadians(tide) + 0.2;

    const zone = createTrickZoneAtAngle(arena.map, spawnAngle, tide, 'spawn-1', [], () => 0.25);

    expect(zone).not.toBeNull();
    expect(zone!.prepareSlot).toBe(TRICK_TYPE_TO_PREPARE_SLOT[zone!.type]);
    expect(isTrickZoneSubmerged(zone!, tide)).toBe(false);
  });
});

describe('pickRandomTrickType', () => {
  it('returns a valid trick type', () => {
    expect(pickRandomTrickType(() => 0)).toBe('rail');
    expect(pickRandomTrickType(() => 0.99)).toBe('wall_ride');
  });
});

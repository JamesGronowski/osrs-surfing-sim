import { describe, expect, it } from 'vitest';

import {
  createTideState,
  highTideRerollPhaseForAngle,
  highTideEntryPhaseForAngle,
  isTrickZoneSubmerged,
  tideTrailingEdgeRadians,
} from './features.js';
import { CORAL_PARK_TRICK_ZONE_COUNT, createCoralParkSlice } from './maps.js';
import {
  createTrickZoneAtAngle,
  createTrickZoneTideSyncState,
  pickRandomTrickType,
  randomTrickRotationJitterRadians,
  REEF_RING_DEPTH_MAX,
  REEF_RING_DEPTH_MIN,
  syncTrickZonesWithTide,
  TRICK_TYPE_TO_PREPARE_SLOT,
  trickSlotAngle,
  zonePolarAngle,
  zonePolarRadius,
} from './trickZonePlacement.js';

describe('syncTrickZonesWithTide', () => {
  it('keeps zones before high-tide center', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const zone = arena.trickZones[0];
    const zoneAngle = zonePolarAngle(zone, tide);
    const beforeCenter = {
      ...tide,
      phaseRadians: highTideEntryPhaseForAngle(zoneAngle, tide) + 0.01,
    };

    const syncState = createTrickZoneTideSyncState();
    const afterSync = syncTrickZonesWithTide(
      arena.trickZones,
      beforeCenter,
      arena.map,
      syncState,
      CORAL_PARK_TRICK_ZONE_COUNT,
    );

    expect(afterSync.some((entry) => entry.id === zone.id)).toBe(true);
    expect(afterSync.length).toBeGreaterThanOrEqual(arena.trickZones.length);
    expect(afterSync.length).toBeLessThanOrEqual(CORAL_PARK_TRICK_ZONE_COUNT);
  });

  it('cycles features through high-tide center over many ticks', () => {
    const arena = createCoralParkSlice();
    let tide = createTideState(arena.tide!);
    let zones = arena.trickZones.map((zone) => ({ ...zone, center: { ...zone.center } }));
    const syncState = createTrickZoneTideSyncState();

    for (let tick = 0; tick < 400; tick += 1) {
      tide = { ...tide, phaseRadians: tide.phaseRadians + tide.advancePerTick };
      zones = syncTrickZonesWithTide(
        zones,
        tide,
        arena.map,
        syncState,
        CORAL_PARK_TRICK_ZONE_COUNT,
      );
    }

    expect(zones.length).toBeGreaterThanOrEqual(CORAL_PARK_TRICK_ZONE_COUNT - 2);
    expect(zones.length).toBeLessThanOrEqual(CORAL_PARK_TRICK_ZONE_COUNT);

    const submergedCount = zones.filter((zone) => isTrickZoneSubmerged(zone, tide)).length;
    const exposedCount = zones.length - submergedCount;
    expect(exposedCount).toBeGreaterThan(0);
    expect(submergedCount).toBeGreaterThan(0);
  });

  it('pre-seeds at slot angles when high-tide reroll point passes', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const slot = 0;
    const slotAngle = trickSlotAngle(slot, CORAL_PARK_TRICK_ZONE_COUNT);
    const atReroll = {
      ...tide,
      phaseRadians: highTideRerollPhaseForAngle(slotAngle, tide),
    };

    const spawned = createTrickZoneAtAngle(
      arena.map,
      slotAngle,
      atReroll,
      'preseed-test',
      [],
      0.62,
      () => 0.5,
      false,
      true,
    );

    expect(spawned).not.toBeNull();
    expect(isTrickZoneSubmerged(spawned!, atReroll)).toBe(true);
  });

  it('places active zones near evenly spaced slot angles', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const syncState = createTrickZoneTideSyncState();
    const zones = syncTrickZonesWithTide(
      arena.trickZones,
      tide,
      arena.map,
      syncState,
      CORAL_PARK_TRICK_ZONE_COUNT,
    );
    const slotTolerance = ((Math.PI * 2) / CORAL_PARK_TRICK_ZONE_COUNT) * 0.35;

    for (const zone of zones) {
      const zoneAngle = zonePolarAngle(zone, tide);
      const nearestSlot = Math.round(
        ((zoneAngle - 0.22 + Math.PI * 2) % (Math.PI * 2)) /
          ((Math.PI * 2) / CORAL_PARK_TRICK_ZONE_COUNT),
      );
      const slotAngle = trickSlotAngle(
        nearestSlot % CORAL_PARK_TRICK_ZONE_COUNT,
        CORAL_PARK_TRICK_ZONE_COUNT,
      );
      let diff = Math.abs(zoneAngle - slotAngle);
      if (diff > Math.PI) {
        diff = Math.PI * 2 - diff;
      }
      expect(diff).toBeLessThanOrEqual(slotTolerance);
    }
  });
});

describe('randomTrickRotationJitterRadians', () => {
  it('maps random 0–1 to ±5 degrees', () => {
    expect(randomTrickRotationJitterRadians(() => 0)).toBeCloseTo((-5 * Math.PI) / 180);
    expect(randomTrickRotationJitterRadians(() => 1)).toBeCloseTo((5 * Math.PI) / 180);
    expect(randomTrickRotationJitterRadians(() => 0.5)).toBeCloseTo(0);
  });
});

describe('createTrickZoneAtAngle', () => {
  it('spawns on dry reef with requested ring depth', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const spawnAngle = tideTrailingEdgeRadians(tide) + 0.35;

    const zone = createTrickZoneAtAngle(
      arena.map,
      spawnAngle,
      tide,
      'spawn-1',
      [],
      0.88,
      () => 0.25,
      false,
    );

    expect(zone).not.toBeNull();
    expect(zone!.prepareSlot).toBe(TRICK_TYPE_TO_PREPARE_SLOT[zone!.type]);
    expect(isTrickZoneSubmerged(zone!, tide)).toBe(false);
    expect(zonePolarRadius(zone!, tide)).toBeGreaterThan(30);
  });

  it('uses different ring depths across consecutive spawns', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const spawnAngle = tideTrailingEdgeRadians(tide) + 0.35;
    const depths = [0.3, 0.55, 0.8];
    let randomIndex = 0;
    const random = () => {
      const value = depths[randomIndex % depths.length];
      randomIndex += 1;
      return value;
    };

    const first = createTrickZoneAtAngle(
      arena.map,
      spawnAngle,
      tide,
      'depth-1',
      [],
      REEF_RING_DEPTH_MIN + depths[0] * (REEF_RING_DEPTH_MAX - REEF_RING_DEPTH_MIN),
      random,
      false,
    );
    const second = createTrickZoneAtAngle(
      arena.map,
      spawnAngle + 0.5,
      tide,
      'depth-2',
      first ? [first] : [],
      REEF_RING_DEPTH_MIN + depths[1] * (REEF_RING_DEPTH_MAX - REEF_RING_DEPTH_MIN),
      random,
      false,
    );

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(zonePolarRadius(first!, tide)).not.toBeCloseTo(zonePolarRadius(second!, tide), 0);
  });
});

describe('pickRandomTrickType', () => {
  it('returns a valid trick type', () => {
    expect(pickRandomTrickType(() => 0)).toBe('rail');
    expect(pickRandomTrickType(() => 0.99)).toBe('wall_ride');
  });
});

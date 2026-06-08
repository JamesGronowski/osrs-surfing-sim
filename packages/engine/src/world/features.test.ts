import { describe, expect, it } from 'vitest';

import { getTile } from './collision.js';
import {
  createTideState,
  findTrickZoneAt,
  isApproachHeadingValid,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  tideTrailingEdgeRadians,
  TRICK_SUBMERGE_FADE_TICKS,
  TRICK_SUBMERGED_ALPHA,
  trickZoneVisualAlpha,
  type TrickZone,
} from './features.js';
import { createCoralParkSlice } from './maps.js';
import {
  createTrickZoneAtAngle,
  createTrickZoneTideSyncState,
  SUBMERGED_CONFIRM_TICKS,
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

describe('trickZoneVisualAlpha', () => {
  it('eases alpha while submerged but gameplay uses the binary tide check', () => {
    const zone: TrickZone = {
      id: 'fade',
      type: 'rail',
      prepareSlot: 0,
      center: { x: 0, y: 0 },
      radius: 2,
      rotationRadians: 0,
      tricked: false,
      submergedRenderTicks: TRICK_SUBMERGE_FADE_TICKS / 2,
    };
    const alpha = trickZoneVisualAlpha(zone);
    expect(alpha).toBeGreaterThan(TRICK_SUBMERGED_ALPHA);
    expect(alpha).toBeLessThan(1);
    expect(trickZoneVisualAlpha({ ...zone, submergedRenderTicks: TRICK_SUBMERGE_FADE_TICKS })).toBe(
      TRICK_SUBMERGED_ALPHA,
    );
  });
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
  });
});

describe('syncTrickZonesWithTide', () => {
  it('retains submerged zones for gameplay surf-over and rendering', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const submerged = arena.trickZones.find((zone) => isTrickZoneSubmerged(zone, tideState));
    expect(submerged).toBeDefined();

    const syncState = createTrickZoneTideSyncState();
    const zones = syncTrickZonesWithTide(
      arena.trickZones,
      tideState,
      arena.map,
      syncState,
      arena.trickZones.length,
    );

    expect(zones.some((zone) => zone.id === submerged!.id)).toBe(true);
    expect(zones.length).toBe(arena.trickZones.length);
  });

  it('does not fade in zones that were never submerged', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const exposed = arena.trickZones.filter((zone) => !isTrickZoneSubmerged(zone, tideState));
    expect(exposed.length).toBeGreaterThan(0);

    const syncState = createTrickZoneTideSyncState();
    const zones = syncTrickZonesWithTide(exposed, tideState, arena.map, syncState, exposed.length);

    for (const zone of zones) {
      expect(zone.emergedRenderTicks).toBeUndefined();
      expect(trickZoneVisualAlpha(zone)).toBe(1);
    }
  });

  it('fades in after confirmed submersion then stays opaque while exposed', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const submerged = arena.trickZones.find((zone) => isTrickZoneSubmerged(zone, tideState));
    expect(submerged).toBeDefined();

    const syncState = createTrickZoneTideSyncState();
    for (let i = 0; i < SUBMERGED_CONFIRM_TICKS; i += 1) {
      syncTrickZonesWithTide([submerged!], tideState, arena.map, syncState, 1);
    }

    const dryTide = {
      ...tideState,
      phaseRadians: tideState.phaseRadians + tideState.sweepRadians + 1,
    };
    let zones = syncTrickZonesWithTide([submerged!], dryTide, arena.map, syncState, 1);
    expect(zones[0].emergedRenderTicks).toBe(1);
    expect(trickZoneVisualAlpha(zones[0])).toBeGreaterThan(TRICK_SUBMERGED_ALPHA);

    for (let tick = 0; tick < TRICK_SUBMERGE_FADE_TICKS; tick += 1) {
      zones = syncTrickZonesWithTide(zones, dryTide, arena.map, syncState, 1);
    }

    expect(zones[0].emergedRenderTicks).toBeUndefined();
    expect(trickZoneVisualAlpha(zones[0])).toBe(1);

    zones = syncTrickZonesWithTide(zones, dryTide, arena.map, syncState, 1);
    expect(trickZoneVisualAlpha(zones[0])).toBe(1);
  });

  it('keeps exposed reef features active after tide cycles', () => {
    const arena = createCoralParkSlice();
    let tideState = createTideState(arena.tide!);
    let zones = arena.trickZones.map((zone) => ({ ...zone }));
    const syncState = createTrickZoneTideSyncState();

    for (let i = 0; i < 200; i += 1) {
      tideState = {
        ...tideState,
        phaseRadians: tideState.phaseRadians + tideState.advancePerTick,
      };
      zones = syncTrickZonesWithTide(
        zones,
        tideState,
        arena.map,
        syncState,
        arena.trickZones.length,
      );
    }

    expect(zones.length).toBeGreaterThan(0);
    const exposed = zones.filter((zone) => !isTrickZoneSubmerged(zone, tideState));
    expect(exposed.length).toBeGreaterThan(0);
    for (const zone of exposed) {
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
      [],
      0.62,
      () => 0.5,
      false,
    );

    expect(zone).not.toBeNull();
    expect(zone!.tricked).toBe(false);
    expect(isTrickZoneSubmerged(zone!, tideState)).toBe(false);
  });
});

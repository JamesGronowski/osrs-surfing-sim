import { describe, expect, it } from 'vitest';

import { getTile } from './collision.js';
import {
  advanceTrickZoneTideVisuals,
  createTideState,
  findTrickZoneAt,
  highTideEntryPhaseForAngle,
  highTideRerollPhaseForAngle,
  isApproachHeadingValid,
  isInTideEmergeWindow,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  lowTidePhaseForAngle,
  tideTrailingEdgeRadians,
  TRICK_TIDE_ANIMATION_TICKS,
  trickZoneVisualAlpha,
  type TrickZone,
} from './features.js';
import { CORAL_PARK_TRICK_ZONE_COUNT, createCoralParkSlice } from './maps.js';
import {
  createTrickZoneAtAngle,
  createTrickZoneTideSyncState,
  syncTrickZonesWithTide,
  trickSlotAngle,
  zonePolarAngle,
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
  it('submerges and emerges over two ticks when disabled or enabled', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const zone = arena.trickZones[0];
    const zoneAngle = zonePolarAngle(zone, tideState);
    const entryPhase = highTideEntryPhaseForAngle(zoneAngle, tideState);
    const lowTidePhase = lowTidePhaseForAngle(zoneAngle);

    const exposedTide = { ...tideState, phaseRadians: lowTidePhase + 0.05 };
    expect(trickZoneVisualAlpha(zone, exposedTide)).toBe(1);

    const submergedTide = { ...tideState, phaseRadians: entryPhase + 0.01 };
    expect(isTrickZoneSubmerged(zone, submergedTide)).toBe(true);
    expect(trickZoneVisualAlpha(zone, submergedTide, 0)).toBe(1);

    let fading = advanceTrickZoneTideVisuals([zone], submergedTide)[0];
    expect(trickZoneVisualAlpha(fading, submergedTide, 0)).toBe(1);
    expect(trickZoneVisualAlpha(fading, submergedTide, 1)).toBe(0.5);

    fading = advanceTrickZoneTideVisuals([fading], submergedTide)[0];
    expect(trickZoneVisualAlpha(fading, submergedTide, 0)).toBe(0.5);
    expect(trickZoneVisualAlpha(fading, submergedTide, 1)).toBe(0);

    fading = advanceTrickZoneTideVisuals([fading], submergedTide)[0];
    expect(trickZoneVisualAlpha(fading, submergedTide, 1)).toBe(0);

    const replacement: TrickZone = { ...zone, spawnedAtHighTide: true };
    const midSubmergedTide = { ...tideState, phaseRadians: entryPhase + 0.2 };
    expect(trickZoneVisualAlpha(replacement, midSubmergedTide)).toBe(0);

    const emergeTide = {
      ...tideState,
      phaseRadians: lowTidePhase - tideState.advancePerTick * (TRICK_TIDE_ANIMATION_TICKS - 0.5),
    };
    expect(isInTideEmergeWindow(zoneAngle, emergeTide)).toBe(true);

    let rising = advanceTrickZoneTideVisuals([replacement], emergeTide)[0];
    rising = advanceTrickZoneTideVisuals([rising], emergeTide)[0];
    expect(trickZoneVisualAlpha(rising, emergeTide, 0.5)).toBeGreaterThan(0);
    expect(trickZoneVisualAlpha(rising, emergeTide, 0.5)).toBeLessThan(1);

    expect(trickZoneVisualAlpha(replacement, exposedTide)).toBe(1);
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
  it('retains zones before reroll and purges past it', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const zone = arena.trickZones[0];
    const zoneAngle = zonePolarAngle(zone, tideState);
    const syncState = createTrickZoneTideSyncState();

    const beforeReroll = {
      ...tideState,
      phaseRadians: highTideEntryPhaseForAngle(zoneAngle, tideState) + 0.01,
    };
    const kept = syncTrickZonesWithTide([zone], beforeReroll, arena.map, syncState, 1);
    expect(kept.some((entry) => entry.id === zone.id)).toBe(true);

    const pastReroll = {
      ...tideState,
      phaseRadians: highTideRerollPhaseForAngle(zoneAngle, tideState),
    };
    const purged = syncTrickZonesWithTide([zone], pastReroll, arena.map, syncState, 1);
    expect(purged.some((entry) => entry.id === zone.id)).toBe(false);
  });

  it('does not re-roll replacements while tide remains past reroll point', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const slotAngle = trickSlotAngle(0, CORAL_PARK_TRICK_ZONE_COUNT);
    const syncState = createTrickZoneTideSyncState();
    const atReroll = {
      ...tideState,
      phaseRadians: highTideRerollPhaseForAngle(slotAngle, tideState),
    };

    let zones = syncTrickZonesWithTide(
      [],
      atReroll,
      arena.map,
      syncState,
      CORAL_PARK_TRICK_ZONE_COUNT,
    );
    expect(zones.length).toBeGreaterThanOrEqual(1);
    const replacement = zones[0];
    const { id, type, center } = replacement;

    for (let tick = 0; tick < 8; tick += 1) {
      const stillSubmerged = {
        ...atReroll,
        phaseRadians: atReroll.phaseRadians + tideState.advancePerTick * (tick + 1),
      };
      zones = syncTrickZonesWithTide(
        zones,
        stillSubmerged,
        arena.map,
        syncState,
        CORAL_PARK_TRICK_ZONE_COUNT,
      );
      const match = zones.find((zone) => zone.id === id);
      expect(match).toBeDefined();
      expect(match!.type).toBe(type);
      expect(match!.center.x).toBe(center.x);
      expect(match!.center.y).toBe(center.y);
    }
  });

  it('spawns replacements at reroll and exposes them at low tide', () => {
    const arena = createCoralParkSlice();
    const tideState = createTideState(arena.tide!);
    const slotAngle = trickSlotAngle(0, CORAL_PARK_TRICK_ZONE_COUNT);
    const syncState = createTrickZoneTideSyncState();

    const atReroll = {
      ...tideState,
      phaseRadians: highTideRerollPhaseForAngle(slotAngle, tideState),
    };
    const spawned = syncTrickZonesWithTide(
      [],
      atReroll,
      arena.map,
      syncState,
      CORAL_PARK_TRICK_ZONE_COUNT,
    );
    expect(spawned.length).toBeGreaterThanOrEqual(1);
    const replacement = spawned[0];
    expect(trickZoneVisualAlpha(replacement, atReroll)).toBe(0);

    const atLowTide = {
      ...tideState,
      phaseRadians: lowTidePhaseForAngle(slotAngle) + 0.05,
    };
    expect(trickZoneVisualAlpha(replacement, atLowTide)).toBe(1);
    expect(isTrickZoneSubmerged(replacement, atLowTide)).toBe(false);
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
      zones = advanceTrickZoneTideVisuals(zones, tideState);
    }

    expect(zones.length).toBeGreaterThan(0);
    const exposed = zones.filter((zone) => !isTrickZoneSubmerged(zone, tideState));
    expect(exposed.length).toBeGreaterThan(0);
    for (const zone of exposed) {
      expect(getTile(arena.map, Math.floor(zone.center.x), Math.floor(zone.center.y))).toBe(
        'coral_rideable',
      );
      expect(trickZoneVisualAlpha(zone, tideState)).toBe(1);
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

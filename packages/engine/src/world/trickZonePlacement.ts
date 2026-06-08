import type { TrickPrepareSlot } from '../constants/tricks.js';
import { getTile, type WorldMap } from './collision.js';
import {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
} from './coralParkCoast.js';
import {
  isPointInTideSweep,
  isTrickZoneSubmerged,
  TRICK_SUBMERGE_FADE_TICKS,
  type TideState,
  type TrickFeatureType,
  type TrickZone,
} from './features.js';

export const CORAL_PARK_TRICK_ZONE_RADIUS = 4;
export const MIN_TRICK_CENTER_GAP = 12;

/** Tide travel while submerged before a feature is removed (radians). */
export const SUBMERGED_PURGE_ARC = 0.42;

/** Consecutive submerged ticks before emerge-fade can start (boundary debounce). */
export const SUBMERGED_CONFIRM_TICKS = 2;

export const TRICK_FEATURE_TYPES: TrickFeatureType[] = [
  'rail',
  'tunnel',
  'jump',
  'brain_coral',
  'wall_ride',
];

export const TRICK_TYPE_TO_PREPARE_SLOT: Record<TrickFeatureType, TrickPrepareSlot> = {
  rail: 0,
  tunnel: 1,
  jump: 2,
  brain_coral: 0,
  wall_ride: 1,
};

/** Matches initial buildTrickZones offset in maps.ts. */
export const TRICK_SLOT_OFFSET = 0.22;

/** Radial depth along the reef ring (0 = inner edge, 1 = outer edge). */
export const REEF_RING_DEPTH_MIN = 0.22;
export const REEF_RING_DEPTH_MAX = 0.92;

export const RING_DEPTH_SPAWN_ATTEMPTS = 5;

const COUNTER_RIDE_CHANCE = 0.2;
const TAU = Math.PI * 2;

export interface TrickZoneTideSyncState {
  nextZoneId: number;
  submergedTicks: Map<string, number>;
  emergedTicks: Map<string, number>;
  /** Zone was confirmed submerged last tick — gates emerge fade-in. */
  wasSubmerged: Map<string, boolean>;
}

/** Clockwise reef ride tangent at a given polar angle. */
export function clockwiseTangent(angle: number): number {
  return angle - Math.PI / 2;
}

export function createTrickZoneTideSyncState(): TrickZoneTideSyncState {
  return {
    nextZoneId: 1000,
    submergedTicks: new Map(),
    emergedTicks: new Map(),
    wasSubmerged: new Map(),
  };
}

export function trickSlotAngle(slot: number, targetCount: number): number {
  return normalizeSpawnAngle(TRICK_SLOT_OFFSET + slot * (TAU / targetCount));
}

export function randomRingDepth(random: () => number = Math.random): number {
  return REEF_RING_DEPTH_MIN + random() * (REEF_RING_DEPTH_MAX - REEF_RING_DEPTH_MIN);
}

export function zonePolarAngle(zone: TrickZone, tide: TideState): number {
  return Math.atan2(zone.center.y - tide.centerY, zone.center.x - tide.centerX);
}

export function zonePolarRadius(zone: TrickZone, tide: TideState): number {
  return Math.hypot(zone.center.x - tide.centerX, zone.center.y - tide.centerY);
}

export function reefCenterAtAngle(
  map: WorldMap,
  positionAngle: number,
  ringT: number,
): { x: number; y: number } | null {
  const inner = coralParkReefInnerRadius(positionAngle);
  const outer = coralParkReefOuterRadius(positionAngle);
  for (let t = ringT; t >= 0.18; t -= 0.04) {
    const radius = inner + (outer - inner) * t;
    const x = CORAL_PARK_ISLAND_CX + Math.cos(positionAngle) * radius;
    const y = CORAL_PARK_ISLAND_CY + Math.sin(positionAngle) * radius;
    const tile = getTile(map, Math.floor(x), Math.floor(y));
    if (tile === 'coral_rideable') {
      return { x, y };
    }
  }
  return null;
}

export function isFarEnoughFromZones(
  center: { x: number; y: number },
  zones: TrickZone[],
): boolean {
  for (const zone of zones) {
    const gap =
      Math.hypot(center.x - zone.center.x, center.y - zone.center.y) -
      CORAL_PARK_TRICK_ZONE_RADIUS * 2;
    if (gap < MIN_TRICK_CENTER_GAP) {
      return false;
    }
  }
  return true;
}

export function pickRandomTrickType(random: () => number = Math.random): TrickFeatureType {
  return TRICK_FEATURE_TYPES[Math.floor(random() * TRICK_FEATURE_TYPES.length)];
}

/** Spawn a trick feature on the reef ring at the given polar angle and radial depth. */
export function createTrickZoneAtAngle(
  map: WorldMap,
  positionAngle: number,
  tide: TideState,
  id: string,
  existingZones: TrickZone[],
  ringDepth: number,
  random: () => number = Math.random,
  enforceGap = true,
  allowSubmerged = false,
): TrickZone | null {
  const center = reefCenterAtAngle(map, positionAngle, ringDepth);
  if (!center || (enforceGap && !isFarEnoughFromZones(center, existingZones))) {
    return null;
  }
  if (!allowSubmerged && isPointInTideSweep(center.x, center.y, tide)) {
    return null;
  }

  const type = pickRandomTrickType(random);
  const counterRide = random() < COUNTER_RIDE_CHANCE;
  const rotationRadians = counterRide
    ? positionAngle + Math.PI / 2
    : clockwiseTangent(positionAngle);

  return {
    id,
    type,
    prepareSlot: TRICK_TYPE_TO_PREPARE_SLOT[type],
    center,
    radius: CORAL_PARK_TRICK_ZONE_RADIUS,
    rotationRadians,
    tricked: false,
  };
}

function spawnTrickZoneAtSlot(
  map: WorldMap,
  slotAngle: number,
  tide: TideState,
  id: string,
  existingZones: TrickZone[],
  random: () => number,
  allowSubmerged: boolean,
): TrickZone | null {
  for (let attempt = 0; attempt < RING_DEPTH_SPAWN_ATTEMPTS; attempt += 1) {
    const spawned = createTrickZoneAtAngle(
      map,
      slotAngle,
      tide,
      id,
      existingZones,
      randomRingDepth(random),
      random,
      true,
      allowSubmerged,
    );
    if (spawned) {
      return spawned;
    }
  }
  return null;
}

/**
 * Keep submerged features visible-but-disabled, purge after a short submerged arc,
 * and pre-seed replacements at fixed slot angles around the reef.
 */
export function syncTrickZonesWithTide(
  zones: TrickZone[],
  tide: TideState,
  map: WorldMap,
  state: TrickZoneTideSyncState,
  targetCount: number,
  random: () => number = Math.random,
): TrickZone[] {
  const slotTolerance = (TAU / targetCount) * 0.35;
  const active: TrickZone[] = [];

  for (const zone of zones) {
    const submerged = isTrickZoneSubmerged(zone, tide);
    if (!submerged) {
      state.submergedTicks.delete(zone.id);

      const shouldEmergeFade =
        state.wasSubmerged.get(zone.id) === true || state.emergedTicks.has(zone.id);
      state.wasSubmerged.delete(zone.id);

      if (!shouldEmergeFade) {
        state.emergedTicks.delete(zone.id);
        active.push({
          ...zone,
          emergedRenderTicks: undefined,
          submergedRenderTicks: undefined,
        });
        continue;
      }

      const emerged = (state.emergedTicks.get(zone.id) ?? 0) + 1;
      if (emerged <= TRICK_SUBMERGE_FADE_TICKS) {
        state.emergedTicks.set(zone.id, emerged);
        active.push({ ...zone, emergedRenderTicks: emerged, submergedRenderTicks: undefined });
      } else {
        state.emergedTicks.delete(zone.id);
        active.push({ ...zone, emergedRenderTicks: undefined, submergedRenderTicks: undefined });
      }
      continue;
    }

    state.emergedTicks.delete(zone.id);
    const ticks = (state.submergedTicks.get(zone.id) ?? 0) + 1;
    state.submergedTicks.set(zone.id, ticks);
    if (ticks >= SUBMERGED_CONFIRM_TICKS) {
      state.wasSubmerged.set(zone.id, true);
    }

    const submergedArc = ticks * tide.advancePerTick;
    if (submergedArc >= SUBMERGED_PURGE_ARC) {
      state.submergedTicks.delete(zone.id);
      state.wasSubmerged.delete(zone.id);
      continue;
    }

    const renderTicks = Math.max(
      zone.submergedRenderTicks ?? 0,
      Math.min(TRICK_SUBMERGE_FADE_TICKS, ticks),
    );
    active.push({
      ...zone,
      submergedRenderTicks: renderTicks,
      emergedRenderTicks: undefined,
    });
  }

  for (let slot = 0; slot < targetCount; slot += 1) {
    if (active.length >= targetCount) {
      break;
    }

    if (isSlotOccupied(active, tide, slot, targetCount, slotTolerance)) {
      continue;
    }

    const slotAngle = trickSlotAngle(slot, targetCount);
    const spawned = spawnTrickZoneAtSlot(
      map,
      slotAngle,
      tide,
      `feature-${state.nextZoneId}`,
      active,
      random,
      true,
    );

    if (!spawned) {
      continue;
    }

    state.nextZoneId += 1;
    if (isTrickZoneSubmerged(spawned, tide)) {
      state.submergedTicks.set(spawned.id, SUBMERGED_CONFIRM_TICKS);
      state.wasSubmerged.set(spawned.id, true);
      active.push({
        ...spawned,
        submergedRenderTicks: TRICK_SUBMERGE_FADE_TICKS,
        emergedRenderTicks: undefined,
      });
    } else {
      active.push(spawned);
    }
  }

  return active;
}

function isSlotOccupied(
  zones: TrickZone[],
  tide: TideState,
  slot: number,
  targetCount: number,
  tolerance: number,
): boolean {
  const slotAngle = trickSlotAngle(slot, targetCount);
  return zones.some((zone) => {
    const zoneAngle = zonePolarAngle(zone, tide);
    return angleNear(zoneAngle, slotAngle, tolerance);
  });
}

function angleNear(a: number, b: number, tolerance: number): boolean {
  let diff = Math.abs(normalizeSpawnAngle(a - b));
  if (diff > Math.PI) {
    diff = TAU - diff;
  }
  return diff <= tolerance;
}

function normalizeSpawnAngle(radians: number): number {
  const wrapped = radians % TAU;
  return wrapped < 0 ? wrapped + TAU : wrapped;
}

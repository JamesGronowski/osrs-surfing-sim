import type { TrickPrepareSlot } from '../constants/tricks.js';
import { getTile, type WorldMap } from './collision.js';
import {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
} from './coralParkCoast.js';
import {
  isPastHighTideReroll,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  type TideState,
  type TrickFeatureType,
  type TrickZone,
} from './features.js';

export const CORAL_PARK_TRICK_ZONE_RADIUS = 4;
export const MIN_TRICK_CENTER_GAP = 12;

export const TRICK_FEATURE_TYPES: TrickFeatureType[] = [
  'rail',
  'tunnel',
  'jump',
  'brain_coral',
  'wall_ride',
];

/** Low = grind, Medium = tunnel/wall ride, High = jump. */
export const TRICK_TYPE_TO_PREPARE_SLOT: Record<TrickFeatureType, TrickPrepareSlot> = {
  rail: 0,
  brain_coral: 0,
  tunnel: 1,
  wall_ride: 1,
  jump: 2,
};

/** Matches initial buildTrickZones offset in maps.ts. */
export const TRICK_SLOT_OFFSET = 0.22;

/** Radial depth along the reef ring (0 = inner edge, 1 = outer edge). */
export const REEF_RING_DEPTH_MIN = 0.22;
export const REEF_RING_DEPTH_MAX = 0.92;

export const RING_DEPTH_SPAWN_ATTEMPTS = 5;

const COUNTER_RIDE_CHANCE = 0.2;
const TAU = Math.PI * 2;

export const TRICK_ROTATION_JITTER_DEG_MIN = -5;
export const TRICK_ROTATION_JITTER_DEG_MAX = 5;

export function randomTrickRotationJitterRadians(random: () => number = Math.random): number {
  const span = TRICK_ROTATION_JITTER_DEG_MAX - TRICK_ROTATION_JITTER_DEG_MIN;
  const degrees = TRICK_ROTATION_JITTER_DEG_MIN + random() * span;
  return (degrees * Math.PI) / 180;
}

export interface TrickZoneTideSyncState {
  nextZoneId: number;
}

/** Clockwise reef ride tangent at a given polar angle. */
export function clockwiseTangent(angle: number): number {
  return angle - Math.PI / 2;
}

export function createTrickZoneTideSyncState(): TrickZoneTideSyncState {
  return {
    nextZoneId: 1000,
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
    rotationJitterRadians: randomTrickRotationJitterRadians(random),
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
 * Purge features at the high-tide reroll point (just before center), then spawn
 * replacements that fade in underwater until low tide exposes them fully opaque.
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
    const zoneAngle = zonePolarAngle(zone, tide);

    if (!isTrickZoneSubmerged(zone, tide)) {
      active.push(zone.spawnedAtHighTide ? { ...zone, spawnedAtHighTide: undefined } : zone);
      continue;
    }

    if (isPastHighTideReroll(zoneAngle, tide) && !zone.spawnedAtHighTide) {
      continue;
    }

    active.push(zone);
  }

  for (let slot = 0; slot < targetCount; slot += 1) {
    if (active.length >= targetCount) {
      break;
    }

    if (isSlotOccupied(active, tide, slot, targetCount, slotTolerance)) {
      continue;
    }

    const slotAngle = trickSlotAngle(slot, targetCount);
    if (!isPastHighTideReroll(slotAngle, tide)) {
      continue;
    }

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
    active.push({ ...spawned, spawnedAtHighTide: true });
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

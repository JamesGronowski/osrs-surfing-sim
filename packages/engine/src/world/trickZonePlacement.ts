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
  tideTrailingEdgeRadians,
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

export const TRICK_TYPE_TO_PREPARE_SLOT: Record<TrickFeatureType, TrickPrepareSlot> = {
  rail: 0,
  tunnel: 1,
  jump: 2,
  brain_coral: 0,
  wall_ride: 1,
};

/** Radial depth along the reef ring (0 = inner edge, 1 = outer edge). */
const REEF_RING_POSITIONS = [0.32, 0.62, 0.88];
const COUNTER_RIDE_CHANCE = 0.2;
const TAU = Math.PI * 2;
/** Small clockwise offset past the trailing edge so spawns sit on dry reef. */
const SPAWN_DRY_OFFSET = 0.08;

export interface TrickZoneTideSyncState {
  /** Previous tick trailing-edge angle, used to detect slot crossings. */
  lastTrailingEdge: number;
  nextZoneId: number;
}

/** Clockwise reef ride tangent at a given polar angle. */
export function clockwiseTangent(angle: number): number {
  return angle - Math.PI / 2;
}

export function createTrickZoneTideSyncState(tide: TideState | null): TrickZoneTideSyncState {
  return {
    lastTrailingEdge: tide ? tideTrailingEdgeRadians(tide) : 0,
    nextZoneId: 1000,
  };
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

/** Spawn a single trick feature on exposed reef at the given polar angle. */
export function createTrickZoneAtAngle(
  map: WorldMap,
  positionAngle: number,
  tide: TideState,
  id: string,
  existingZones: TrickZone[],
  random: () => number = Math.random,
  enforceGap = true,
): TrickZone | null {
  for (const ringT of REEF_RING_POSITIONS) {
    const center = reefCenterAtAngle(map, positionAngle, ringT);
    if (!center || (enforceGap && !isFarEnoughFromZones(center, existingZones))) {
      continue;
    }
    if (isPointInTideSweep(center.x, center.y, tide)) {
      continue;
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

  return null;
}

/**
 * Remove features submerged by the swell and spawn replacements evenly along
 * the currently exposed (dry) reef arc.
 */
export function syncTrickZonesWithTide(
  zones: TrickZone[],
  tide: TideState,
  map: WorldMap,
  state: TrickZoneTideSyncState,
  targetCount: number,
  random: () => number = Math.random,
): TrickZone[] {
  let active = zones.filter((zone) => !isTrickZoneSubmerged(zone, tide));

  const trailingEdge = tideTrailingEdgeRadians(tide);
  const dryStart = normalizeSpawnAngle(trailingEdge + SPAWN_DRY_OFFSET);
  const drySpan = TAU - tide.sweepRadians;
  const spacing = drySpan / targetCount;
  const slotTolerance = spacing * 0.35;

  for (let slot = 0; slot < targetCount && active.length < targetCount; slot += 1) {
    const slotAngle = normalizeSpawnAngle(dryStart + spacing * (slot + 0.5));
    active = trySpawnAtSlot(active, map, tide, slotAngle, slotTolerance, state, random);
  }

  state.lastTrailingEdge = trailingEdge;
  return active;
}

function hasZoneNearAngle(
  zones: TrickZone[],
  tide: TideState,
  angle: number,
  tolerance: number,
): boolean {
  return zones.some((zone) => angleNear(zonePolarAngle(zone, tide), angle, tolerance));
}

function zonePolarAngle(zone: TrickZone, tide: TideState): number {
  return Math.atan2(zone.center.y - tide.centerY, zone.center.x - tide.centerX);
}

function angleNear(a: number, b: number, tolerance: number): boolean {
  let diff = Math.abs(normalizeSpawnAngle(a - b));
  if (diff > Math.PI) {
    diff = TAU - diff;
  }
  return diff <= tolerance;
}

function trySpawnAtSlot(
  active: TrickZone[],
  map: WorldMap,
  tide: TideState,
  slotAngle: number,
  slotTolerance: number,
  state: TrickZoneTideSyncState,
  random: () => number,
): TrickZone[] {
  if (hasZoneNearAngle(active, tide, slotAngle, slotTolerance)) {
    return active;
  }

  const spawnAngle = normalizeSpawnAngle(slotAngle);
  const spawned = createTrickZoneAtAngle(
    map,
    spawnAngle,
    tide,
    `feature-${state.nextZoneId}`,
    active,
    random,
    false,
  );

  if (!spawned) {
    return active;
  }

  state.nextZoneId += 1;
  return [...active, spawned];
}

function normalizeSpawnAngle(radians: number): number {
  const wrapped = radians % TAU;
  return wrapped < 0 ? wrapped + TAU : wrapped;
}

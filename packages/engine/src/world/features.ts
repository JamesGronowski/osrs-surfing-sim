import {
  TRICK_PREPARE_MAX_TICKS,
  TRICK_PREPARE_MIN_TICKS,
  type TrickPrepareSlot,
} from '../constants/tricks.js';
import { headingToDegrees, type HeadingIndex } from '../movement/heading.js';
import type { WorldPos } from './coords.js';

/** Max angle between rider heading and feature approach direction. */
export const TRICK_APPROACH_TOLERANCE_DEG = 70;

export type TrickFeatureType = 'rail' | 'tunnel' | 'brain_coral' | 'wall_ride' | 'jump';

export interface TrickZone {
  id: string;
  type: TrickFeatureType;
  /** Which prepare button (0–2) must be primed for this feature. */
  prepareSlot: TrickPrepareSlot;
  center: WorldPos;
  radius: number;
  /** World radians — ride toward +local Y through the feature (OSRS 0=east, clockwise). */
  rotationRadians: number;
  tricked: boolean;
}

export interface TrickPrepareState {
  slot: TrickPrepareSlot;
  /** Ticks elapsed since the prepare button was pressed. */
  ticksSincePrepare: number;
}

export interface TideConfig {
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  /** Angular width of the submerged reef section (radians). */
  sweepRadians: number;
  advancePerTick?: number;
  /** When set, reef depth follows an organic coastline at each angle. */
  innerRadiusAtAngle?: (angle: number) => number;
  outerRadiusAtAngle?: (angle: number) => number;
}

export interface TideState {
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  sweepRadians: number;
  /** Leading edge of the tide sweep, advances clockwise around the island. */
  phaseRadians: number;
  advancePerTick: number;
  innerRadiusAtAngle?: (angle: number) => number;
  outerRadiusAtAngle?: (angle: number) => number;
}

const TAU = Math.PI * 2;
const DEFAULT_TIDE_ADVANCE = 0.05;

export function createTideState(config: TideConfig): TideState {
  return {
    centerX: config.centerX,
    centerY: config.centerY,
    innerRadius: config.innerRadius,
    outerRadius: config.outerRadius,
    sweepRadians: config.sweepRadians,
    phaseRadians: 0,
    advancePerTick: config.advancePerTick ?? DEFAULT_TIDE_ADVANCE,
    innerRadiusAtAngle: config.innerRadiusAtAngle,
    outerRadiusAtAngle: config.outerRadiusAtAngle,
  };
}

export function tickTide(tide: TideState): TideState {
  return {
    ...tide,
    phaseRadians: normalizeAngle(tide.phaseRadians + tide.advancePerTick),
  };
}

export function normalizeAngle(radians: number): number {
  const wrapped = radians % TAU;
  return wrapped < 0 ? wrapped + TAU : wrapped;
}

export function isAngleInSweep(angle: number, phaseRadians: number, sweepRadians: number): boolean {
  const start = normalizeAngle(phaseRadians);
  const end = normalizeAngle(phaseRadians + sweepRadians);
  const a = normalizeAngle(angle);

  if (start <= end) {
    return a >= start && a <= end;
  }
  return a >= start || a <= end;
}

/** True when a reef point sits inside the rotating tide band around the island. */
export function isPointInTideSweep(worldX: number, worldY: number, tide: TideState): boolean {
  const dx = worldX - tide.centerX;
  const dy = worldY - tide.centerY;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const innerR = tide.innerRadiusAtAngle?.(angle) ?? tide.innerRadius;
  const outerR = tide.outerRadiusAtAngle?.(angle) ?? tide.outerRadius;
  if (dist < innerR - 0.3 || dist > outerR + 0.4) {
    return false;
  }
  return isAngleInSweep(angle, tide.phaseRadians, tide.sweepRadians);
}

export function isTrickZoneSubmerged(zone: TrickZone, tide: TideState): boolean {
  return isPointInTideSweep(zone.center.x, zone.center.y, tide);
}

/** Trailing edge of the submerged band — where dry reef is returning (low tide line). */
export function tideTrailingEdgeRadians(tide: TideState): number {
  return normalizeAngle(tide.phaseRadians + tide.sweepRadians);
}

/** Clockwise angular distance from `from` to `to` (both normalized). */
export function clockwiseAngleDelta(from: number, to: number): number {
  return normalizeAngle(to - from);
}

export function isApproachHeadingValid(zone: TrickZone, riderHeading: HeadingIndex): boolean {
  const riderRad = (headingToDegrees(riderHeading) * Math.PI) / 180;
  let diff = Math.abs(normalizeAngle(riderRad - zone.rotationRadians));
  if (diff > Math.PI) {
    diff = TAU - diff;
  }
  const tolerance = (TRICK_APPROACH_TOLERANCE_DEG * Math.PI) / 180;
  return diff <= tolerance;
}

export function findTrickZoneAt(
  zones: TrickZone[],
  pos: WorldPos,
  tide: TideState | null,
): TrickZone | null {
  let best: TrickZone | null = null;
  let bestDist = Infinity;

  for (const zone of zones) {
    if (zone.tricked) {
      continue;
    }
    if (tide && isTrickZoneSubmerged(zone, tide)) {
      continue;
    }
    const dx = pos.x - zone.center.x;
    const dy = pos.y - zone.center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= zone.radius && dist < bestDist) {
      best = zone;
      bestDist = dist;
    }
  }
  return best;
}

export function isTrickPrepareTimingValid(prepare: TrickPrepareState): boolean {
  return (
    prepare.ticksSincePrepare >= TRICK_PREPARE_MIN_TICKS &&
    prepare.ticksSincePrepare <= TRICK_PREPARE_MAX_TICKS
  );
}

export function advanceTrickPrepare(prepare: TrickPrepareState | null): TrickPrepareState | null {
  if (!prepare) {
    return null;
  }
  const ticksSincePrepare = prepare.ticksSincePrepare + 1;
  if (ticksSincePrepare > TRICK_PREPARE_MAX_TICKS) {
    return null;
  }
  return { ...prepare, ticksSincePrepare };
}

export function markZoneTricked(zones: TrickZone[], zoneId: string): TrickZone[] {
  return zones.map((zone) => (zone.id === zoneId ? { ...zone, tricked: true } : zone));
}

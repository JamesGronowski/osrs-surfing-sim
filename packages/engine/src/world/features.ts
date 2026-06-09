import {
  TRICK_PREPARE_MAX_TICKS,
  TRICK_PREPARE_MIN_TICKS,
  type TrickPrepareSlot,
} from '../constants/tricks.js';
import { headingToDegrees, type HeadingIndex } from '../movement/heading.js';
import type { WorldPos } from './coords.js';
import { isPointInTrickZoneHitbox } from './trickHitbox.js';

/** Max angle between rider heading and feature approach direction. */
export const TRICK_APPROACH_TOLERANCE_DEG = 70;

export type TrickFeatureType = 'rail' | 'tunnel' | 'brain_coral' | 'wall_ride' | 'jump';

/** Fade-out completes and reroll happens this far along entry→center (just before midpoint). */
export const HIGH_TIDE_REROLL_PROGRESS = 0.92;

/** Sim ticks for submerge/emerge visuals (2 × 600ms = 1200ms). */
export const TRICK_TIDE_ANIMATION_TICKS = 2;

export interface TrickZone {
  id: string;
  type: TrickFeatureType;
  /** Which prepare button (0–2) must be primed for this feature. */
  prepareSlot: TrickPrepareSlot;
  center: WorldPos;
  radius: number;
  /** World radians — ride toward +local Y through the feature (OSRS 0=east, clockwise). */
  rotationRadians: number;
  /** Visual-only yaw offset in radians (±5° at spawn). */
  rotationJitterRadians?: number;
  tricked: boolean;
  /** Spawned at high-tide center — kept submerged until low tide, not re-rolled each tick. */
  spawnedAtHighTide?: boolean;
  /** Submerge animation progress (0…TRICK_TIDE_ANIMATION_TICKS), advanced each sim tick. */
  submergedRenderTicks?: number;
  /** Emerge animation progress (0…TRICK_TIDE_ANIMATION_TICKS), advanced each sim tick. */
  emergedRenderTicks?: number;
}

/** Clockwise angular distance from `from` to `to`. */
export function phaseDistanceClockwise(from: number, to: number): number {
  const f = normalizeAngle(from);
  const t = normalizeAngle(to);
  if (f <= t) {
    return t - f;
  }
  return TAU - f + t;
}

/** True when tide phase is within the emerge animation window before low tide. */
export function isInTideEmergeWindow(zoneAngle: number, tide: TideState): boolean {
  const lowTide = lowTidePhaseForAngle(zoneAngle);
  const dist = phaseDistanceClockwise(tide.phaseRadians, lowTide);
  return dist <= tide.advancePerTick * TRICK_TIDE_ANIMATION_TICKS + 1e-9;
}

export function trickZoneVisualAlpha(
  zone: TrickZone,
  tide?: TideState | null,
  tickBlend = 0,
): number {
  if (!tide || !isTrickZoneSubmerged(zone, tide)) {
    return 1;
  }

  const zoneAngle = Math.atan2(zone.center.y - tide.centerY, zone.center.x - tide.centerX);

  if (zone.spawnedAtHighTide) {
    if (!isInTideEmergeWindow(zoneAngle, tide)) {
      return 0;
    }
    const ticks = (zone.emergedRenderTicks ?? 0) + tickBlend;
    return Math.min(1, ticks / TRICK_TIDE_ANIMATION_TICKS);
  }

  const ticks = (zone.submergedRenderTicks ?? 0) + tickBlend;
  return Math.max(0, 1 - Math.min(1, ticks / TRICK_TIDE_ANIMATION_TICKS));
}

/** 0 = surfaced, 1 = fully sunk — inverse of visual alpha while submerged. */
export function trickZoneVisualSubmergeProgress(
  zone: TrickZone,
  tide?: TideState | null,
  tickBlend = 0,
): number {
  if (!tide || !isTrickZoneSubmerged(zone, tide)) {
    return 0;
  }
  return 1 - trickZoneVisualAlpha(zone, tide, tickBlend);
}

/** Advance per-tick submerge/emerge counters after tide sync. */
export function advanceTrickZoneTideVisuals(zones: TrickZone[], tide: TideState): TrickZone[] {
  return zones.map((zone) => {
    if (!isTrickZoneSubmerged(zone, tide)) {
      if (zone.submergedRenderTicks === undefined && zone.emergedRenderTicks === undefined) {
        return zone;
      }
      return {
        ...zone,
        submergedRenderTicks: undefined,
        emergedRenderTicks: undefined,
      };
    }

    const zoneAngle = Math.atan2(zone.center.y - tide.centerY, zone.center.x - tide.centerX);

    if (zone.spawnedAtHighTide) {
      if (!isInTideEmergeWindow(zoneAngle, tide)) {
        if (zone.emergedRenderTicks === undefined) {
          return zone;
        }
        return { ...zone, emergedRenderTicks: undefined };
      }

      const emerged = zone.emergedRenderTicks;
      if (emerged === undefined) {
        return { ...zone, emergedRenderTicks: 0, submergedRenderTicks: undefined };
      }
      if (emerged >= TRICK_TIDE_ANIMATION_TICKS) {
        return zone;
      }
      return { ...zone, emergedRenderTicks: emerged + 1 };
    }

    const submerged = zone.submergedRenderTicks;
    if (submerged === undefined) {
      return { ...zone, submergedRenderTicks: 0, emergedRenderTicks: undefined };
    }
    if (submerged >= TRICK_TIDE_ANIMATION_TICKS) {
      return zone;
    }
    return { ...zone, submergedRenderTicks: submerged + 1, emergedRenderTicks: undefined };
  });
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

/** Center of the high-tide submerged arc. */
export function tideCenterRadians(tide: TideState): number {
  return normalizeAngle(tide.phaseRadians + tide.sweepRadians / 2);
}

/** Tide phase when the high-tide center sits over a reef polar angle. */
export function highTideCenterPhaseForAngle(angle: number, tide: TideState): number {
  return normalizeAngle(angle - tide.sweepRadians / 2);
}

/** Tide phase when the submerged band trailing edge reaches an angle. */
export function highTideEntryPhaseForAngle(angle: number, tide: TideState): number {
  return normalizeAngle(angle - tide.sweepRadians);
}

/** Tide phase when the submerged band leading edge passes an angle (low tide). */
export function lowTidePhaseForAngle(angle: number): number {
  return normalizeAngle(angle);
}

/** Tide phase just before high-tide center when fade-out completes and reroll happens. */
export function highTideRerollPhaseForAngle(angle: number, tide: TideState): number {
  return phaseAtProgress(
    highTideEntryPhaseForAngle(angle, tide),
    highTideCenterPhaseForAngle(angle, tide),
    HIGH_TIDE_REROLL_PROGRESS,
  );
}

/** True when tide phase is at or past the reroll point but before low tide for an angle. */
export function isPastHighTideReroll(angle: number, tide: TideState): boolean {
  const reroll = highTideRerollPhaseForAngle(angle, tide);
  const lowTide = lowTidePhaseForAngle(angle);
  return phaseInProgressRange(tide.phaseRadians, reroll, lowTide);
}

/** @deprecated Use isPastHighTideReroll */
export function isPastHighTideCenter(angle: number, tide: TideState): boolean {
  return isPastHighTideReroll(angle, tide);
}

export function phaseAtProgress(start: number, end: number, t: number): number {
  const s = normalizeAngle(start);
  const e = normalizeAngle(end);
  if (s <= e) {
    return normalizeAngle(s + (e - s) * t);
  }
  const span = TAU - s + e;
  return normalizeAngle(s + span * t);
}

export function phaseInProgressRange(phase: number, start: number, end: number): boolean {
  const p = normalizeAngle(phase);
  const s = normalizeAngle(start);
  const e = normalizeAngle(end);
  if (s <= e) {
    return p >= s && p <= e;
  }
  return p >= s || p <= e;
}

export function progressInPhaseRange(phase: number, start: number, end: number): number {
  const p = normalizeAngle(phase);
  const s = normalizeAngle(start);
  const e = normalizeAngle(end);
  if (s <= e) {
    if (p <= s) {
      return 0;
    }
    if (p >= e) {
      return 1;
    }
    return (p - s) / (e - s);
  }
  const span = TAU - s + e;
  if (p >= s) {
    return Math.min(1, (p - s) / span);
  }
  if (p <= e) {
    return Math.min(1, (TAU - s + p) / span);
  }
  return 0;
}

/** Clockwise angular distance from `from` to `to` (both normalized). */
export function clockwiseAngleDelta(from: number, to: number): number {
  return normalizeAngle(to - from);
}

function approachHeadingDelta(riderRad: number, targetRad: number): number {
  let diff = Math.abs(normalizeAngle(riderRad - targetRad));
  if (diff > Math.PI) {
    diff = TAU - diff;
  }
  return diff;
}

export function isApproachHeadingValid(zone: TrickZone, riderHeading: HeadingIndex): boolean {
  const riderRad = (headingToDegrees(riderHeading) * Math.PI) / 180;
  const tolerance = (TRICK_APPROACH_TOLERANCE_DEG * Math.PI) / 180;
  const targets =
    zone.type === 'jump'
      ? [zone.rotationRadians, zone.rotationRadians + Math.PI]
      : [zone.rotationRadians];

  return targets.some((target) => approachHeadingDelta(riderRad, target) <= tolerance);
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
    if (isPointInTrickZoneHitbox(zone, pos) && dist < bestDist) {
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

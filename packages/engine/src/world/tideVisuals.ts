import { isAngleInSweep, isPointInTideSweep, normalizeAngle, type TideState } from './features.js';

const TAU = Math.PI * 2;

/** Board / rider height on exposed reef at low tide (world Y). */
export const TIDE_REEF_RIDE_SURFACE_Y = 0.12;

/** Reef ride surface drop at peak high tide (world Y). */
export const TIDE_REEF_SINK_Y = 2.6;

/** Water surface rise at peak high tide above y=0 (world Y). */
export const TIDE_WATER_RISE_Y = 4.4;

/** Crest height of the massive wave (white wash + water body). */
export const TIDE_LEADING_WASH_HEIGHT = TIDE_WATER_RISE_Y * 1.12;

/** Leading-edge inundation (no breaker) — fraction of band width. */
const TIDE_WAVE_RISE_SPAN = 0.3;

/** Trailing-edge cliff (meets white breaker) — short fraction of band width. */
const TIDE_WAVE_FALL_SPAN = 0.1;

function tideWaveSmoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Water surface height along the tide band (0 = leading edge, 1 = trailing). */
export function tideWaveSurfaceAtProgress(progress: number): number {
  const crest = TIDE_LEADING_WASH_HEIGHT;

  if (progress <= TIDE_WAVE_RISE_SPAN) {
    return crest * tideWaveSmoothstep(progress / TIDE_WAVE_RISE_SPAN);
  }

  const fallStart = 1 - TIDE_WAVE_FALL_SPAN;
  if (progress <= fallStart) {
    return crest;
  }

  const fallT = (progress - fallStart) / TIDE_WAVE_FALL_SPAN;
  return crest * (1 - fallT);
}

/** 0–1 flood level matching the wave surface (drives reef sink visuals). */
export function tideWaveFloodFactorAtProgress(progress: number): number {
  const crest = TIDE_LEADING_WASH_HEIGHT;
  if (crest <= 0) {
    return 0;
  }
  return tideWaveSurfaceAtProgress(progress) / crest;
}

/** Water surface height at a polar angle on the reef ring. */
export function tideWaveSurfaceAtAngle(angle: number, tide: TideState): number {
  const progress = tideBandProgressAtAngle(angle, tide);
  if (progress === null) {
    return 0;
  }
  return tideWaveSurfaceAtProgress(progress);
}

/** Water surface height at a world point on the reef ring. */
export function tideWaveSurfaceY(worldX: number, worldY: number, tide: TideState): number {
  const dx = worldX - tide.centerX;
  const dy = worldY - tide.centerY;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const innerR = tide.innerRadiusAtAngle?.(angle) ?? tide.innerRadius;
  const outerR = tide.outerRadiusAtAngle?.(angle) ?? tide.outerRadius;
  if (dist < innerR - 0.5 || dist > outerR + 0.5) {
    return 0;
  }
  return tideWaveSurfaceAtAngle(angle, tide);
}

/** Progress through the submerged band: 0 at leading edge, 1 at trailing edge. */
export function tideBandProgressAtAngle(angle: number, tide: TideState): number | null {
  if (!isAngleInSweep(angle, tide.phaseRadians, tide.sweepRadians)) {
    return null;
  }

  const start = normalizeAngle(tide.phaseRadians);
  const a = normalizeAngle(angle);
  const end = normalizeAngle(start + tide.sweepRadians);

  if (start <= end) {
    return (a - start) / tide.sweepRadians;
  }

  if (a >= start) {
    return (a - start) / tide.sweepRadians;
  }
  return (TAU - start + a) / tide.sweepRadians;
}

/** 0 = low tide, 1 = peak high tide — smooth within the submerged band. */
export function tideVisualDepthAtAngle(angle: number, tide: TideState): number {
  const progress = tideBandProgressAtAngle(angle, tide);
  if (progress === null) {
    return 0;
  }
  return Math.sin(Math.PI * progress);
}

/** Visual tide depth for a reef-ring point (0 outside band or reef ring). */
export function tideVisualDepthAtPoint(worldX: number, worldY: number, tide: TideState): number {
  const dx = worldX - tide.centerX;
  const dy = worldY - tide.centerY;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const innerR = tide.innerRadiusAtAngle?.(angle) ?? tide.innerRadius;
  const outerR = tide.outerRadiusAtAngle?.(angle) ?? tide.outerRadius;
  if (dist < innerR - 0.5 || dist > outerR + 0.5) {
    return 0;
  }
  return tideVisualDepthAtAngle(angle, tide);
}

/** Reef tile centre Y offset from low-tide overlay centre (negative = sunk). */
export function tideReefYOffset(worldX: number, worldY: number, tide: TideState | null): number {
  if (!tide) {
    return 0;
  }
  return -tideVisualDepthAtPoint(worldX, worldY, tide) * TIDE_REEF_SINK_Y;
}

/** Local water surface height (world Y). */
export function tideWaterSurfaceY(worldX: number, worldY: number, tide: TideState | null): number {
  if (!tide) {
    return 0;
  }
  return tideWaveSurfaceY(worldX, worldY, tide);
}

/** Ride height for surfboards — reef at low tide, on the wave face at high tide. */
export function tideRideSurfaceY(worldX: number, worldY: number, tide: TideState | null): number {
  if (!tide) {
    return TIDE_REEF_RIDE_SURFACE_Y;
  }
  const waveY = tideWaveSurfaceY(worldX, worldY, tide);
  if (waveY <= 0) {
    return TIDE_REEF_RIDE_SURFACE_Y;
  }
  const depth = tideVisualDepthAtPoint(worldX, worldY, tide);
  const reefY = TIDE_REEF_RIDE_SURFACE_Y - depth * TIDE_REEF_SINK_Y;
  const rideBlend = Math.min(1, depth + waveY / TIDE_LEADING_WASH_HEIGHT);
  return reefY + rideBlend * (waveY - reefY);
}

/** True when a point is inside the gameplay tide band on the reef ring. */
export function isPointOnReefTideBand(worldX: number, worldY: number, tide: TideState): boolean {
  return isPointInTideSweep(worldX, worldY, tide);
}

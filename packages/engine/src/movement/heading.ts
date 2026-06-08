import { DEGREES_PER_HEADING, HEADING_COUNT } from '../constants/movement.js';

/** OSRS-style 16-direction heading index (0 = east, increasing clockwise). */
export type HeadingIndex = number;

export function normalizeDegrees(degrees: number): number {
  const normalized = degrees % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function headingToDegrees(heading: HeadingIndex): number {
  return normalizeDegrees(heading * DEGREES_PER_HEADING);
}

export function degreesToHeading(degrees: number): HeadingIndex {
  const normalized = normalizeDegrees(degrees);
  return Math.round(normalized / DEGREES_PER_HEADING) % HEADING_COUNT;
}

export function snapAngleToHeading(angleRadians: number): HeadingIndex {
  const degrees = normalizeDegrees((angleRadians * 180) / Math.PI);
  return degreesToHeading(degrees);
}

export function headingToUnitVector(heading: HeadingIndex): { x: number; y: number } {
  const radians = (headingToDegrees(heading) * Math.PI) / 180;
  return {
    x: Math.cos(radians),
    y: Math.sin(radians),
  };
}

export function shortestHeadingDelta(from: HeadingIndex, to: HeadingIndex): number {
  let delta = (to - from) % HEADING_COUNT;
  if (delta > HEADING_COUNT / 2) {
    delta -= HEADING_COUNT;
  }
  if (delta < -HEADING_COUNT / 2) {
    delta += HEADING_COUNT;
  }
  return delta;
}

export function rotateHeadingToward(
  current: HeadingIndex,
  target: HeadingIndex,
  maxDegrees: number,
): HeadingIndex {
  const deltaSteps = shortestHeadingDelta(current, target);
  if (deltaSteps === 0) {
    return current;
  }

  const maxSteps = Math.max(1, Math.round(maxDegrees / DEGREES_PER_HEADING));
  const step = Math.sign(deltaSteps) * Math.min(Math.abs(deltaSteps), maxSteps);
  return (current + step + HEADING_COUNT) % HEADING_COUNT;
}

export function angleFromTo(fromX: number, fromY: number, toX: number, toY: number): number {
  return Math.atan2(toY - fromY, toX - fromX);
}

/** Smooth heading for rendering between simulation ticks (fractional index allowed). */
export function interpolateHeadingIndex(
  from: HeadingIndex,
  to: HeadingIndex,
  blend: number,
): number {
  const t = Math.min(1, Math.max(0, blend));
  const fromDeg = headingToDegrees(from);
  const toDeg = headingToDegrees(to);
  let delta = toDeg - fromDeg;
  if (delta > 180) {
    delta -= 360;
  }
  if (delta < -180) {
    delta += 360;
  }
  return (fromDeg + delta * t) / DEGREES_PER_HEADING;
}

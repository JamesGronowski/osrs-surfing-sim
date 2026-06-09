import { snapAngleToHeading, type HeadingIndex } from '../movement/heading.js';
import type { SurfboardInput, SurfboardState } from '../movement/surfboard.js';
import {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
} from '../world/coralParkCoast.js';
import type { WorldMap } from '../world/collision.js';
import {
  clockwiseAngleDelta,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  tideTrailingEdgeRadians,
  type TideState,
  type TrickPrepareState,
  type TrickZone,
} from '../world/features.js';
/** Mid-reef radial depth for staying on the rideable ring. */
export const DEMO_SURFER_RING_DEPTH = 0.55;

/** Slow down when this far ahead of the dry-reef trailing edge (fraction of sweep). */
export const DEMO_SURFER_SLOW_AHEAD_FRACTION = 0.28;

/** Speed up when this close to the submerged leading edge (fraction of sweep). */
export const DEMO_SURFER_FAST_LEADING_FRACTION = 0.18;

/** How far clockwise to scan for the next trick feature (fraction of sweep). */
export const DEMO_SURFER_ZONE_LOOKAHEAD_FRACTION = 0.55;

/** Start homing toward a feature within this many tiles. */
export const DEMO_SURFER_ZONE_HOMING_DISTANCE = 18;

/** Prime a trick when within this many tiles of the feature centre. */
export const DEMO_SURFER_ZONE_PRIME_DISTANCE = 12;

/** Polar angle step (radians) when scouting the next point along the reef loop. */
export const DEMO_SURFER_AHEAD_ANGLE_STEP = 0.18;

export interface DemoSurferAiInput extends SurfboardInput {
  prepareSlot?: TrickPrepareState['slot'];
}

export interface DemoSurferAiContext {
  surfboard: SurfboardState;
  trickPrepare: TrickPrepareState | null;
  trickZones: TrickZone[];
  tide: TideState | null;
  map: WorldMap;
}

function polarFromIsland(x: number, y: number): { angle: number; radius: number } {
  const dx = x - CORAL_PARK_ISLAND_CX;
  const dy = y - CORAL_PARK_ISLAND_CY;
  return {
    angle: Math.atan2(dy, dx),
    radius: Math.hypot(dx, dy),
  };
}

/** Clockwise orbit around the island matches increasing polar angle (y grows south). */
export function reefRideClockwiseRadians(angle: number): number {
  return angle + Math.PI / 2;
}

function idealReefPoint(angle: number): { x: number; y: number } {
  const inner = coralParkReefInnerRadius(angle);
  const outer = coralParkReefOuterRadius(angle);
  const radius = inner + (outer - inner) * DEMO_SURFER_RING_DEPTH;
  return {
    x: CORAL_PARK_ISLAND_CX + Math.cos(angle) * radius,
    y: CORAL_PARK_ISLAND_CY + Math.sin(angle) * radius,
  };
}

function courseHeading(
  position: { x: number; y: number },
  steerX: number,
  steerY: number,
): HeadingIndex {
  const { angle, radius } = polarFromIsland(position.x, position.y);
  const ideal = idealReefPoint(angle);
  const tangent = reefRideClockwiseRadians(angle);

  const radialError =
    radius - Math.hypot(ideal.x - CORAL_PARK_ISLAND_CX, ideal.y - CORAL_PARK_ISLAND_CY);
  const radialCorrection = Math.max(-0.35, Math.min(0.35, radialError * 0.08));

  const blendX =
    Math.cos(tangent) * 0.82 + Math.cos(angle) * radialCorrection + (steerX - position.x) * 0.06;
  const blendY =
    Math.sin(tangent) * 0.82 + Math.sin(angle) * radialCorrection + (steerY - position.y) * 0.06;

  return snapAngleToHeading(Math.atan2(blendY, blendX));
}

function dryZoneMargins(
  angle: number,
  tide: TideState,
): { fromTrailing: number; toLeading: number } {
  const trailing = tideTrailingEdgeRadians(tide);
  const leading = tide.phaseRadians;
  return {
    fromTrailing: clockwiseAngleDelta(trailing, angle),
    toLeading: clockwiseAngleDelta(angle, leading),
  };
}

function chooseSpeedState(
  position: { x: number; y: number },
  tide: TideState | null,
  approachingZone: TrickZone | null,
): SurfboardInput {
  if (!tide) {
    return approachingZone ? { standUp: true } : { standUp: true };
  }

  const { angle } = polarFromIsland(position.x, position.y);
  const submerged = isPointInTideSweep(position.x, position.y, tide);
  const { fromTrailing, toLeading } = dryZoneMargins(angle, tide);
  const slowThreshold = tide.sweepRadians * DEMO_SURFER_SLOW_AHEAD_FRACTION;
  const fastThreshold = tide.sweepRadians * DEMO_SURFER_FAST_LEADING_FRACTION;

  if (approachingZone) {
    return { standUp: true };
  }

  if (submerged || toLeading < fastThreshold) {
    return { standUp: true };
  }

  if (fromTrailing > slowThreshold) {
    return { lieDown: true };
  }

  return { standUp: true };
}

function nextExposedZone(
  position: { x: number; y: number },
  trickZones: TrickZone[],
  tide: TideState | null,
): TrickZone | null {
  if (!tide) {
    return null;
  }

  const riderAngle = polarFromIsland(position.x, position.y).angle;
  const lookahead = tide.sweepRadians * DEMO_SURFER_ZONE_LOOKAHEAD_FRACTION;
  let best: TrickZone | null = null;
  let bestAhead = Infinity;

  for (const zone of trickZones) {
    if (zone.tricked) {
      continue;
    }
    if (isTrickZoneSubmerged(zone, tide)) {
      continue;
    }

    const zoneAngle = Math.atan2(zone.center.y - tide.centerY, zone.center.x - tide.centerX);
    const ahead = clockwiseAngleDelta(riderAngle, zoneAngle);
    if (ahead <= 0.05 || ahead > lookahead) {
      continue;
    }

    const dist = Math.hypot(position.x - zone.center.x, position.y - zone.center.y);
    const score = ahead + dist * 0.02;
    if (score < bestAhead) {
      bestAhead = score;
      best = zone;
    }
  }

  return best;
}

function steerTowardZone(
  position: { x: number; y: number },
  zone: TrickZone,
): { steerX: number; steerY: number } {
  const dist = Math.hypot(position.x - zone.center.x, position.y - zone.center.y);

  if (dist > 20) {
    return { steerX: zone.center.x, steerY: zone.center.y };
  }
  if (dist > zone.radius + 2.5) {
    return { steerX: zone.center.x, steerY: zone.center.y };
  }

  const aheadX = position.x + Math.cos(zone.rotationRadians) * 5;
  const aheadY = position.y + Math.sin(zone.rotationRadians) * 5;
  return { steerX: aheadX, steerY: aheadY };
}

function shouldPrimeTrick(
  position: { x: number; y: number },
  zone: TrickZone,
  trickPrepare: TrickPrepareState | null,
): TrickPrepareState['slot'] | undefined {
  if (trickPrepare) {
    return undefined;
  }

  const dist = Math.hypot(position.x - zone.center.x, position.y - zone.center.y);
  if (dist < DEMO_SURFER_ZONE_PRIME_DISTANCE && dist > zone.radius * 0.45) {
    return zone.prepareSlot;
  }

  return undefined;
}

export function computeDemoSurferAi(context: DemoSurferAiContext): DemoSurferAiInput {
  const { surfboard, trickPrepare, trickZones, tide } = context;
  const position = surfboard.position;

  if (surfboard.speedState === 'seated') {
    return {
      startPaddle: true,
      standUp: true,
      setIntendedHeading: surfboard.currentHeading,
    };
  }

  const targetZone = nextExposedZone(position, trickZones, tide);
  let steerX = position.x;
  let steerY = position.y;

  if (targetZone) {
    const dist = Math.hypot(position.x - targetZone.center.x, position.y - targetZone.center.y);
    if (dist <= DEMO_SURFER_ZONE_HOMING_DISTANCE) {
      const steer = steerTowardZone(position, targetZone);
      steerX = steer.steerX;
      steerY = steer.steerY;
    } else {
      const ideal = idealReefPoint(
        polarFromIsland(position.x, position.y).angle + DEMO_SURFER_AHEAD_ANGLE_STEP * 0.65,
      );
      steerX = ideal.x;
      steerY = ideal.y;
    }
  } else {
    const aheadAngle = polarFromIsland(position.x, position.y).angle + DEMO_SURFER_AHEAD_ANGLE_STEP;
    const ideal = idealReefPoint(aheadAngle);
    steerX = ideal.x;
    steerY = ideal.y;
  }

  const speed = chooseSpeedState(position, tide, targetZone);
  const input: DemoSurferAiInput = {
    ...speed,
    setIntendedHeading: courseHeading(position, steerX, steerY),
  };

  if (targetZone) {
    const primeSlot = shouldPrimeTrick(position, targetZone, trickPrepare);
    if (primeSlot !== undefined) {
      input.prepareSlot = primeSlot;
    }
  }

  return input;
}

export function demoSurferSpawnOnReef(angle: number): {
  x: number;
  y: number;
  heading: HeadingIndex;
} {
  const point = idealReefPoint(angle);
  return {
    x: point.x,
    y: point.y,
    heading: snapAngleToHeading(reefRideClockwiseRadians(angle)),
  };
}

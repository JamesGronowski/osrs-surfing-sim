import { HEADING_COUNT } from '../constants/movement.js';
import { snapAngleToHeading, type HeadingIndex } from '../movement/heading.js';
import type { SurfboardInput, SurfboardState } from '../movement/surfboard.js';
import {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
  coralParkSandRadius,
} from '../world/coralParkCoast.js';
import { isWorldPointSailingTarget, type WorldMap } from '../world/collision.js';
import type { WorldPos } from '../world/coords.js';
import {
  clockwiseAngleDelta,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  tideTrailingEdgeRadians,
  type TideState,
  type TrickPrepareState,
  type TrickZone,
} from '../world/features.js';
import { trickZoneHitboxReach } from '../world/trickHitbox.js';

const TAU = Math.PI * 2;

/** Mid-reef radial depth for staying on the rideable ring. */
export const DEMO_SURFER_RING_DEPTH = 0.55;

/** Tighter inside line when the white wash is closing in. */
export const DEMO_SURFER_INNER_RING_DEPTH = 0.28;

/** Past this fraction of the dry arc, Nalu prioritises nearby tricks. */
export const DEMO_SURFER_DRY_ZONE_FRONT_HALF = 0.5;

/** Slow down when this close to the dry-reef trailing edge (fraction of sweep). */
export const DEMO_SURFER_TRAILING_EDGE_CAUTION_FRACTION = 0.22;

/** Skip trick targeting when this close to a tide edge (fraction of sweep). */
export const DEMO_SURFER_TRICK_EDGE_CAUTION_FRACTION = 0.22;

/** Allow a trick just behind the rider when selecting the closest feature. */
export const DEMO_SURFER_TRICK_BEHIND_RADIANS = 0.12;

/** Start paddling when within this fraction of the sweep from the high-tide leading edge. */
export const DEMO_SURFER_CAUTION_LEADING_FRACTION = 0.4;

/** Trigger a tight spin when the high-tide leading edge is this close (fraction of sweep). */
export const DEMO_SURFER_SPIN_LEADING_FRACTION = 0.22;

/** Ticks spent carving a clockwise spin while the swell passes. */
export const DEMO_SURFER_TIDE_SPIN_TICKS = 8;

/** Heading steps advanced per spin tick (16 steps = full rotation). */
export const DEMO_SURFER_TIDE_SPIN_HEADING_STEP = 2;

/** Faster board rotation during a tide spin. */
export const DEMO_SURFER_TIDE_SPIN_TURN_RATE = 45;

/** Extra leading-edge buffer for tide advance over this many ticks. */
export const DEMO_SURFER_TIDE_LOOKAHEAD_TICKS = 4;

/** Reef lookahead steps when checking whether ride speed would enter high tide. */
export const DEMO_SURFER_PATH_LOOKAHEAD_STEPS = 2;

/** Prime a trick when within this many tiles of the feature centre. */
export const DEMO_SURFER_ZONE_PRIME_DISTANCE = 12;

/** Polar angle step (radians) when scouting the next point along the reef loop. */
export const DEMO_SURFER_AHEAD_ANGLE_STEP = 0.18;

/** Explorer wander tuning. */
export const EXPLORER_TARGET_REACHED_DISTANCE = 4;
export const EXPLORER_RIDE_DISTANCE = 18;
export const EXPLORER_LOUNGE_CHANCE = 0.3;
export const EXPLORER_LOUNGE_MIN_TICKS = 25;
export const EXPLORER_LOUNGE_SPAN_TICKS = 30;
/** Chance to lie down and let the swell roll over instead of spinning away. */
export const EXPLORER_SWELL_LOUNGE_CHANCE = 0.5;
export const EXPLORER_SWELL_LOUNGE_TICKS = 70;
const EXPLORER_WANDER_ATTEMPTS = 8;
/** Straight-line sample spacing when checking a wander path for land. */
const EXPLORER_PATH_SAMPLE_TILES = 4;
/** Ticks without movement before abandoning the current wander target. */
const EXPLORER_STUCK_TICK_LIMIT = 10;

export type DemoSurferBehavior =
  | { kind: 'loop'; ringDepth: number; doesTricks: boolean }
  | {
      kind: 'sector';
      centerRadians: number;
      halfWidthRadians: number;
      ringDepth: number;
      doesTricks: boolean;
    }
  | { kind: 'explorer' };

export const DEFAULT_DEMO_SURFER_BEHAVIOR: DemoSurferBehavior = {
  kind: 'loop',
  ringDepth: DEMO_SURFER_RING_DEPTH,
  doesTricks: true,
};

/** Per-surfer AI memory carried between ticks. */
export interface DemoSurferAiState {
  /** +1 rides clockwise, −1 counter-clockwise (sector patrols flip at edges). */
  direction: 1 | -1;
  wanderTarget: WorldPos | null;
  loungeTicksRemaining: number;
  lastPosition: WorldPos | null;
  stuckTicks: number;
  rngState: number;
}

export function createDemoSurferAiState(seed: number): DemoSurferAiState {
  return {
    direction: 1,
    wanderTarget: null,
    loungeTicksRemaining: 0,
    lastPosition: null,
    stuckTicks: 0,
    rngState: seed >>> 0 || 1,
  };
}

/** xorshift32 over the state's seed → [0, 1); deterministic per surfer. */
function nextRandom(aiState: DemoSurferAiState): number {
  let x = aiState.rngState;
  x ^= (x << 13) >>> 0;
  x ^= x >>> 17;
  x ^= (x << 5) >>> 0;
  aiState.rngState = x >>> 0;
  return aiState.rngState / 0x100000000;
}

function signedAngleDelta(from: number, to: number): number {
  let delta = (to - from) % TAU;
  if (delta > Math.PI) {
    delta -= TAU;
  }
  if (delta < -Math.PI) {
    delta += TAU;
  }
  return delta;
}

export interface DemoSurferAiInput extends SurfboardInput {
  prepareSlot?: TrickPrepareState['slot'];
}

export interface DemoSurferAiContext {
  surfboard: SurfboardState;
  trickPrepare: TrickPrepareState | null;
  trickZones: TrickZone[];
  tide: TideState | null;
  map: WorldMap;
  behavior?: DemoSurferBehavior;
  aiState?: DemoSurferAiState;
}

export interface DemoSurferAiResult {
  input: DemoSurferAiInput;
  aiState: DemoSurferAiState;
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

function dryArcRadians(tide: TideState): number {
  return TAU - tide.sweepRadians;
}

/** True when Nalu is in the front half of the dry reef (closer to the approaching swell). */
export function isDryZoneFrontHalf(angle: number, tide: TideState): boolean {
  const { fromTrailing } = dryZoneMargins(angle, tide);
  return fromTrailing > dryArcRadians(tide) * DEMO_SURFER_DRY_ZONE_FRONT_HALF;
}

/** True when Nalu should slow down for tide safety at the dry-reef edges. */
export function isNearTideEdge(angle: number, tide: TideState): boolean {
  const { fromTrailing, toLeading } = dryZoneMargins(angle, tide);
  const trailingCaution = tide.sweepRadians * DEMO_SURFER_TRAILING_EDGE_CAUTION_FRACTION;
  const leadingCaution =
    tide.sweepRadians * DEMO_SURFER_CAUTION_LEADING_FRACTION + tideLeadingBuffer(tide);
  return fromTrailing < trailingCaution || toLeading < leadingCaution;
}

function isNearTideEdgeForTricks(angle: number, tide: TideState): boolean {
  const { fromTrailing, toLeading } = dryZoneMargins(angle, tide);
  const trailingCaution = tide.sweepRadians * DEMO_SURFER_TRICK_EDGE_CAUTION_FRACTION;
  const leadingCaution =
    tide.sweepRadians * DEMO_SURFER_TRICK_EDGE_CAUTION_FRACTION + tideLeadingBuffer(tide);
  return fromTrailing < trailingCaution || toLeading < leadingCaution;
}

export function targetRingDepth(
  angle: number,
  tide: TideState,
  baseDepth = DEMO_SURFER_RING_DEPTH,
): number {
  const toLeading = effectiveToLeading(angle, tide);
  const cautionThreshold =
    tide.sweepRadians * DEMO_SURFER_CAUTION_LEADING_FRACTION + tideLeadingBuffer(tide);
  const spinThreshold =
    tide.sweepRadians * DEMO_SURFER_SPIN_LEADING_FRACTION + tideLeadingBuffer(tide);

  if (toLeading >= cautionThreshold) {
    return baseDepth;
  }

  const innerDepth = Math.min(baseDepth, DEMO_SURFER_INNER_RING_DEPTH);
  const pressure =
    1 - (toLeading - spinThreshold) / Math.max(cautionThreshold - spinThreshold, 0.01);
  const clampedPressure = Math.min(1, Math.max(0, pressure));
  return baseDepth + (innerDepth - baseDepth) * clampedPressure;
}

function reefPointAtDepth(angle: number, depth: number): { x: number; y: number } {
  const inner = coralParkReefInnerRadius(angle);
  const outer = coralParkReefOuterRadius(angle);
  const radius = inner + (outer - inner) * depth;
  return {
    x: CORAL_PARK_ISLAND_CX + Math.cos(angle) * radius,
    y: CORAL_PARK_ISLAND_CY + Math.sin(angle) * radius,
  };
}

function idealReefPoint(
  angle: number,
  tide: TideState | null = null,
  baseDepth = DEMO_SURFER_RING_DEPTH,
): { x: number; y: number } {
  const depth = tide ? targetRingDepth(angle, tide, baseDepth) : baseDepth;
  return reefPointAtDepth(angle, depth);
}

function courseHeading(
  position: { x: number; y: number },
  steerX: number,
  steerY: number,
  tide: TideState | null,
  baseDepth = DEMO_SURFER_RING_DEPTH,
  direction: 1 | -1 = 1,
): HeadingIndex {
  const { angle, radius } = polarFromIsland(position.x, position.y);
  const ideal = idealReefPoint(angle, tide, baseDepth);
  const idealRadius = Math.hypot(ideal.x - CORAL_PARK_ISLAND_CX, ideal.y - CORAL_PARK_ISLAND_CY);
  const tangent = reefRideClockwiseRadians(angle) + (direction === 1 ? 0 : Math.PI);

  const washClose =
    tide !== null &&
    effectiveToLeading(angle, tide) <
      tide.sweepRadians * DEMO_SURFER_CAUTION_LEADING_FRACTION + tideLeadingBuffer(tide);
  const radialGain = washClose ? 0.2 : 0.08;
  const radialError = radius - idealRadius;
  const radialCorrection = Math.max(-0.45, Math.min(0.45, radialError * radialGain));

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

function tideLeadingBuffer(tide: TideState): number {
  return tide.advancePerTick * DEMO_SURFER_TIDE_LOOKAHEAD_TICKS;
}

function effectiveToLeading(angle: number, tide: TideState): number {
  return dryZoneMargins(angle, tide).toLeading;
}

/** True when Nalu should carve a clockwise spin to let the swell pass. */
export function shouldStartTideSpin(
  position: { x: number; y: number },
  surfboard: SurfboardState,
  tide: TideState,
  ringDepth = DEMO_SURFER_RING_DEPTH,
): boolean {
  if (isPointInTideSweep(position.x, position.y, tide)) {
    return false;
  }

  const { angle } = polarFromIsland(position.x, position.y);
  const toLeading = effectiveToLeading(angle, tide);
  const spinThreshold =
    tide.sweepRadians * DEMO_SURFER_SPIN_LEADING_FRACTION + tideLeadingBuffer(tide);
  const pathRisk = pathAheadEntersHighTide(position, tide, surfboard.speedState, ringDepth);
  return toLeading < spinThreshold || pathRisk;
}

export function tideSpinTargetHeading(currentHeading: HeadingIndex): HeadingIndex {
  return (currentHeading + DEMO_SURFER_TIDE_SPIN_HEADING_STEP + HEADING_COUNT) % HEADING_COUNT;
}

function pathAheadEntersHighTide(
  position: { x: number; y: number },
  tide: TideState,
  speedState: SurfboardState['speedState'],
  ringDepth = DEMO_SURFER_RING_DEPTH,
): boolean {
  if (speedState !== 'riding') {
    return false;
  }

  const { angle, radius } = polarFromIsland(position.x, position.y);
  const cautionThreshold =
    tide.sweepRadians * DEMO_SURFER_CAUTION_LEADING_FRACTION + tideLeadingBuffer(tide);

  if (effectiveToLeading(angle, tide) > cautionThreshold * 1.15) {
    return false;
  }

  const tilesPerTick = 2.5;
  const angleStep = tilesPerTick / Math.max(radius, 1);

  for (let step = 1; step <= DEMO_SURFER_PATH_LOOKAHEAD_STEPS; step += 1) {
    const futureAngle = angle + angleStep * step;
    const future = idealReefPoint(futureAngle, null, ringDepth);
    if (isPointInTideSweep(future.x, future.y, tide)) {
      return true;
    }
    if (effectiveToLeading(futureAngle, tide) < cautionThreshold) {
      return true;
    }
  }

  return false;
}

function chooseSpeedState(
  position: { x: number; y: number },
  tide: TideState | null,
  pursuingTrick: boolean,
): SurfboardInput {
  if (!tide) {
    return { standUp: true };
  }

  const { angle } = polarFromIsland(position.x, position.y);
  const submerged = isPointInTideSweep(position.x, position.y, tide);
  if (submerged) {
    return { lieDown: true };
  }

  if (pursuingTrick) {
    return { standUp: true };
  }

  if (isNearTideEdge(angle, tide)) {
    return { lieDown: true };
  }

  return { standUp: true };
}

function selectTrickZone(
  position: { x: number; y: number },
  trickZones: TrickZone[],
  tide: TideState | null,
  sector: { centerRadians: number; halfWidthRadians: number } | null = null,
): TrickZone | null {
  if (!tide) {
    return null;
  }

  const riderAngle = polarFromIsland(position.x, position.y).angle;
  const nearEdge = isNearTideEdgeForTricks(riderAngle, tide);

  const dryArc = dryArcRadians(tide);
  let best: TrickZone | null = null;
  let bestDist = Infinity;

  for (const zone of trickZones) {
    if (zone.tricked) {
      continue;
    }
    if (isTrickZoneSubmerged(zone, tide)) {
      continue;
    }

    const zoneAngle = Math.atan2(zone.center.y - tide.centerY, zone.center.x - tide.centerX);
    if (
      sector &&
      Math.abs(signedAngleDelta(sector.centerRadians, zoneAngle)) > sector.halfWidthRadians
    ) {
      continue;
    }
    const ahead = clockwiseAngleDelta(riderAngle, zoneAngle);
    const justBehind =
      clockwiseAngleDelta(zoneAngle, riderAngle) <= DEMO_SURFER_TRICK_BEHIND_RADIANS;
    if (!justBehind && ahead > dryArc) {
      continue;
    }

    const dist = Math.hypot(position.x - zone.center.x, position.y - zone.center.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = zone;
    }
  }

  if (nearEdge && best !== null && bestDist > DEMO_SURFER_ZONE_PRIME_DISTANCE + 4) {
    return null;
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
  if (dist > trickZoneHitboxReach(zone) + 2.5) {
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
  inFrontHalf: boolean,
): TrickPrepareState['slot'] | undefined {
  if (trickPrepare) {
    return undefined;
  }

  const dist = Math.hypot(position.x - zone.center.x, position.y - zone.center.y);
  const primeDistance = inFrontHalf
    ? DEMO_SURFER_ZONE_PRIME_DISTANCE + 4
    : DEMO_SURFER_ZONE_PRIME_DISTANCE;
  const minDist = trickZoneHitboxReach(zone) * (inFrontHalf ? 0.35 : 0.45);
  if (dist < primeDistance && dist > minDist) {
    return zone.prepareSlot;
  }

  return undefined;
}

/** True when the straight line between two water points stays off the island. */
function isWanderPathClear(map: WorldMap, from: WorldPos, to: WorldPos): boolean {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.ceil(distance / EXPLORER_PATH_SAMPLE_TILES));
  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;
    if (!isWorldPointSailingTarget(map, x, y)) {
      return false;
    }
  }
  return true;
}

function pickWanderTarget(map: WorldMap, from: WorldPos, aiState: DemoSurferAiState): WorldPos {
  for (let attempt = 0; attempt < EXPLORER_WANDER_ATTEMPTS; attempt += 1) {
    const angle = nextRandom(aiState) * TAU - Math.PI;
    const minRadius = coralParkSandRadius(angle) + 2;
    const maxRadius = coralParkReefOuterRadius(angle) + 10;
    const radius = minRadius + nextRandom(aiState) * (maxRadius - minRadius);
    const x = CORAL_PARK_ISLAND_CX + Math.cos(angle) * radius;
    const y = CORAL_PARK_ISLAND_CY + Math.sin(angle) * radius;
    if (isWorldPointSailingTarget(map, x, y) && isWanderPathClear(map, from, { x, y })) {
      return { x, y };
    }
  }
  return idealReefPoint(polarFromIsland(from.x, from.y).angle + 0.6);
}

/** Roll whether the explorer lounges through an approaching swell instead of spinning. */
export function rollExplorerSwellLounge(aiState: DemoSurferAiState): {
  aiState: DemoSurferAiState;
  lounge: boolean;
} {
  const next = { ...aiState };
  if (nextRandom(next) < EXPLORER_SWELL_LOUNGE_CHANCE) {
    next.loungeTicksRemaining = EXPLORER_SWELL_LOUNGE_TICKS;
    next.wanderTarget = null;
    return { aiState: next, lounge: true };
  }
  return { aiState: next, lounge: false };
}

/** Roams the whole park; sometimes lies down to lounge — even in the swell. */
function computeExplorerAi(
  context: DemoSurferAiContext,
  aiState: DemoSurferAiState,
): DemoSurferAiInput {
  const { surfboard, map } = context;
  const position = surfboard.position;

  if (aiState.loungeTicksRemaining > 0) {
    aiState.loungeTicksRemaining -= 1;
    // Sit still and bob on the water (lieDown would keep paddling forward).
    return { stop: true, setIntendedHeading: surfboard.currentHeading };
  }

  const last = aiState.lastPosition;
  const moved = !last || Math.hypot(position.x - last.x, position.y - last.y) > 0.01;
  aiState.lastPosition = { ...position };
  aiState.stuckTicks = moved ? 0 : aiState.stuckTicks + 1;
  if (aiState.stuckTicks > EXPLORER_STUCK_TICK_LIMIT) {
    aiState.wanderTarget = null;
    aiState.stuckTicks = 0;
  }

  const target = aiState.wanderTarget;
  const targetDistance = target
    ? Math.hypot(target.x - position.x, target.y - position.y)
    : Infinity;

  if (!target || targetDistance < EXPLORER_TARGET_REACHED_DISTANCE) {
    if (nextRandom(aiState) < EXPLORER_LOUNGE_CHANCE) {
      aiState.loungeTicksRemaining =
        EXPLORER_LOUNGE_MIN_TICKS + Math.floor(nextRandom(aiState) * EXPLORER_LOUNGE_SPAN_TICKS);
      aiState.wanderTarget = null;
      return { stop: true, setIntendedHeading: surfboard.currentHeading };
    }
    aiState.wanderTarget = pickWanderTarget(map, position, aiState);
  }

  const destination = aiState.wanderTarget as WorldPos;
  const heading = snapAngleToHeading(
    Math.atan2(destination.y - position.y, destination.x - position.x),
  );
  const speed: SurfboardInput =
    targetDistance > EXPLORER_RIDE_DISTANCE ? { standUp: true } : { lieDown: true };
  return { ...speed, setIntendedHeading: heading };
}

function computeReefRiderAi(
  context: DemoSurferAiContext,
  behavior: Exclude<DemoSurferBehavior, { kind: 'explorer' }>,
  aiState: DemoSurferAiState,
): DemoSurferAiInput {
  const { surfboard, trickPrepare, trickZones, tide } = context;
  const position = surfboard.position;
  const riderAngle = polarFromIsland(position.x, position.y).angle;

  if (behavior.kind === 'sector') {
    const delta = signedAngleDelta(behavior.centerRadians, riderAngle);
    if (delta > behavior.halfWidthRadians) {
      aiState.direction = -1;
    } else if (delta < -behavior.halfWidthRadians) {
      aiState.direction = 1;
    }
  }
  const direction = behavior.kind === 'sector' ? aiState.direction : 1;

  const inFrontHalf = tide !== null && isDryZoneFrontHalf(riderAngle, tide);
  const sector =
    behavior.kind === 'sector'
      ? { centerRadians: behavior.centerRadians, halfWidthRadians: behavior.halfWidthRadians }
      : null;
  // Trick targeting assumes a clockwise approach; skip while patrolling back.
  const targetZone =
    behavior.doesTricks && direction === 1
      ? selectTrickZone(position, trickZones, tide, sector)
      : null;
  let steerX = position.x;
  let steerY = position.y;

  if (targetZone) {
    const steer = steerTowardZone(position, targetZone);
    steerX = steer.steerX;
    steerY = steer.steerY;
  } else {
    const aheadAngle = riderAngle + direction * DEMO_SURFER_AHEAD_ANGLE_STEP;
    const ideal = idealReefPoint(aheadAngle, tide, behavior.ringDepth);
    steerX = ideal.x;
    steerY = ideal.y;
  }

  const pursuingTrick = targetZone !== null;

  const speed = chooseSpeedState(position, tide, pursuingTrick);
  const input: DemoSurferAiInput = {
    ...speed,
    setIntendedHeading: courseHeading(
      position,
      steerX,
      steerY,
      tide,
      behavior.ringDepth,
      direction,
    ),
  };

  if (targetZone) {
    const primeSlot = shouldPrimeTrick(position, targetZone, trickPrepare, inFrontHalf);
    if (primeSlot !== undefined) {
      input.prepareSlot = primeSlot;
    }
  }

  return input;
}

export function computeDemoSurferAi(context: DemoSurferAiContext): DemoSurferAiResult {
  const behavior = context.behavior ?? DEFAULT_DEMO_SURFER_BEHAVIOR;
  const aiState = { ...(context.aiState ?? createDemoSurferAiState(1)) };
  const { surfboard } = context;

  const lounging = behavior.kind === 'explorer' && aiState.loungeTicksRemaining > 0;
  if (surfboard.speedState === 'seated' && !lounging) {
    return {
      input: {
        startPaddle: true,
        standUp: true,
        setIntendedHeading: surfboard.currentHeading,
      },
      aiState,
    };
  }

  const input =
    behavior.kind === 'explorer'
      ? computeExplorerAi(context, aiState)
      : computeReefRiderAi(context, behavior, aiState);
  return { input, aiState };
}

export function demoSurferSpawnOnReef(
  angle: number,
  ringDepth = DEMO_SURFER_RING_DEPTH,
): {
  x: number;
  y: number;
  heading: HeadingIndex;
} {
  const point = idealReefPoint(angle, null, ringDepth);
  return {
    x: point.x,
    y: point.y,
    heading: snapAngleToHeading(reefRideClockwiseRadians(angle)),
  };
}

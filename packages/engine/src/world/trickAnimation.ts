import {
  headingToUnitVector,
  interpolateHeadingIndex,
  snapAngleToHeading,
  type HeadingIndex,
} from '../movement/heading.js';
import type { WorldPos } from './coords.js';
import { isWorldPointSailingTarget, type WorldMap } from './collision.js';
import type { TrickFeatureType, TrickZone } from './features.js';

export const TRICK_ANIMATION_TICKS = 2;

/** Share of the trick timeline spent easing onto the locked centreline (0–1). */
export const TRICK_ANIMATION_ALIGN_PROGRESS = 0.28;

/** Travel distance along the feature ride line as a multiple of zone radius. */
export const TRICK_ANIMATION_TRAVEL_FACTOR: Record<TrickFeatureType, number> = {
  rail: 1.85,
  jump: 1.65,
  tunnel: 1.75,
  wall_ride: 1.55,
  brain_coral: 1.2,
};

/** Half-width of the locked ride path from feature centre (fraction of full travel). */
const LOCKED_PATH_HALF_SPAN_FACTOR = 0.46;

export interface TrickAnimationState {
  zoneId: string;
  type: TrickFeatureType;
  zoneRadius: number;
  entry: WorldPos;
  entryHeading: HeadingIndex;
  start: WorldPos;
  end: WorldPos;
  endHeading: HeadingIndex;
  ticksElapsed: number;
  ticksTotal: number;
}

export interface TrickAnimationSnapshot {
  type: TrickFeatureType;
  zoneRadius: number;
  entry: WorldPos;
  start: WorldPos;
  end: WorldPos;
  ticksElapsed: number;
  ticksTotal: number;
}

/** World ride axis matching each feature mesh orientation (+X or +Z local after child offsets). */
export function trickFeatureRideUnitVector(zone: TrickZone): { x: number; y: number } {
  const r = zone.rotationRadians;
  const cos = Math.cos(r);
  const sin = Math.sin(r);

  switch (zone.type) {
    case 'jump':
      return { x: -cos, y: -sin };
    case 'tunnel':
      return { x: cos, y: sin };
    case 'rail':
    case 'wall_ride':
    case 'brain_coral':
    default:
      return { x: cos, y: sin };
  }
}

function dot(ax: number, ay: number, bx: number, by: number): number {
  return ax * bx + ay * by;
}

/** Ride direction through the feature — sign picks the entry→exit side. */
export function signedFeatureRideVector(
  zone: TrickZone,
  entryPosition: WorldPos,
  startHeading: HeadingIndex,
): { x: number; y: number } {
  const axis = trickFeatureRideUnitVector(zone);
  const offset = {
    x: entryPosition.x - zone.center.x,
    y: entryPosition.y - zone.center.y,
  };
  const along = dot(offset.x, offset.y, axis.x, axis.y);

  if (Math.abs(along) >= zone.radius * 0.08) {
    return along < 0 ? axis : { x: -axis.x, y: -axis.y };
  }

  const travel = headingToUnitVector(startHeading);
  const travelDot = dot(travel.x, travel.y, axis.x, axis.y);
  if (Math.abs(travelDot) >= 0.05) {
    return travelDot >= 0 ? axis : { x: -axis.x, y: -axis.y };
  }

  return axis;
}

export function snapToFeatureCenterline(
  zone: TrickZone,
  position: WorldPos,
  rideVector: { x: number; y: number },
): WorldPos {
  const offset = {
    x: position.x - zone.center.x,
    y: position.y - zone.center.y,
  };
  const along = dot(offset.x, offset.y, rideVector.x, rideVector.y);
  return {
    x: zone.center.x + rideVector.x * along,
    y: zone.center.y + rideVector.y * along,
  };
}

export function headingFromRideVector(rideVector: { x: number; y: number }): HeadingIndex {
  return snapAngleToHeading(Math.atan2(rideVector.y, rideVector.x));
}

function lerpPosition(from: WorldPos, to: WorldPos, t: number): WorldPos {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

export function trickAnimationProgress(state: TrickAnimationState | null): number {
  if (!state) {
    return 0;
  }
  return Math.min(1, state.ticksElapsed / state.ticksTotal);
}

export function toTrickAnimationSnapshot(
  state: TrickAnimationState | null,
): TrickAnimationSnapshot | null {
  if (!state) {
    return null;
  }
  return {
    type: state.type,
    zoneRadius: state.zoneRadius,
    entry: { ...state.entry },
    start: { ...state.start },
    end: { ...state.end },
    ticksElapsed: state.ticksElapsed,
    ticksTotal: state.ticksTotal,
  };
}

export function trickAnimationPositionAtProgress(
  animation: Pick<TrickAnimationSnapshot, 'entry' | 'start' | 'end'>,
  progress: number,
): WorldPos {
  const t = Math.min(1, Math.max(0, progress));
  if (t <= TRICK_ANIMATION_ALIGN_PROGRESS) {
    const alignT = t / TRICK_ANIMATION_ALIGN_PROGRESS;
    return lerpPosition(animation.entry, animation.start, alignT);
  }
  const rideT = (t - TRICK_ANIMATION_ALIGN_PROGRESS) / (1 - TRICK_ANIMATION_ALIGN_PROGRESS);
  return lerpPosition(animation.start, animation.end, rideT);
}

export function resolveLockedTrickPath(
  map: WorldMap,
  zone: TrickZone,
  entryPosition: WorldPos,
  rideVector: { x: number; y: number },
): { start: WorldPos; end: WorldPos } {
  const span = zone.radius * TRICK_ANIMATION_TRAVEL_FACTOR[zone.type];
  const halfSpan = span * LOCKED_PATH_HALF_SPAN_FACTOR;
  const entryAlong = -halfSpan;
  const exitAlong = halfSpan;

  const snapped = snapToFeatureCenterline(zone, entryPosition, rideVector);
  const rawAlong = dot(
    snapped.x - zone.center.x,
    snapped.y - zone.center.y,
    rideVector.x,
    rideVector.y,
  );
  const startAlong = Math.max(entryAlong, Math.min(rawAlong, exitAlong));

  const start = {
    x: zone.center.x + rideVector.x * startAlong,
    y: zone.center.y + rideVector.y * startAlong,
  };

  for (let step = 4; step >= 1; step -= 1) {
    const scale = step / 4;
    const along = startAlong + (exitAlong - startAlong) * scale;
    const x = zone.center.x + rideVector.x * along;
    const y = zone.center.y + rideVector.y * along;
    if (isWorldPointSailingTarget(map, x, y)) {
      return { start, end: { x, y } };
    }
  }

  return { start, end: { ...start } };
}

export function createTrickAnimationState(
  map: WorldMap,
  zone: TrickZone,
  entryPosition: WorldPos,
  startHeading: HeadingIndex,
): TrickAnimationState {
  const rideVector = signedFeatureRideVector(zone, entryPosition, startHeading);
  const rideHeading = headingFromRideVector(rideVector);
  const { start, end } = resolveLockedTrickPath(map, zone, entryPosition, rideVector);

  return {
    zoneId: zone.id,
    type: zone.type,
    zoneRadius: zone.radius,
    entry: { ...entryPosition },
    entryHeading: startHeading,
    start,
    end,
    endHeading: rideHeading,
    ticksElapsed: 0,
    ticksTotal: TRICK_ANIMATION_TICKS,
  };
}

function trickAnimationHeadingAtProgress(
  state: TrickAnimationState,
  progress: number,
): HeadingIndex {
  const t = Math.min(1, Math.max(0, progress));
  if (t <= TRICK_ANIMATION_ALIGN_PROGRESS) {
    const alignT = t / TRICK_ANIMATION_ALIGN_PROGRESS;
    return interpolateHeadingIndex(state.entryHeading, state.endHeading, alignT);
  }
  return state.endHeading;
}

export interface TrickAnimationTickResult {
  state: TrickAnimationState | null;
  position: WorldPos;
  heading: HeadingIndex;
}

export function tickTrickAnimation(state: TrickAnimationState): TrickAnimationTickResult {
  const nextElapsed = state.ticksElapsed + 1;
  const progress = Math.min(1, nextElapsed / state.ticksTotal);
  const position = trickAnimationPositionAtProgress(state, progress);
  const heading = trickAnimationHeadingAtProgress(state, progress);

  if (nextElapsed >= state.ticksTotal) {
    return {
      state: null,
      position: { ...state.end },
      heading: state.endHeading,
    };
  }

  return {
    state: { ...state, ticksElapsed: nextElapsed },
    position,
    heading,
  };
}

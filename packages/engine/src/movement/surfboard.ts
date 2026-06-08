import { DEFAULT_SURFBOARD_STATS, SPEED_STAT_TO_TILES_PER_TICK } from '../constants/movement.js';
import { getTile, isTileSurfable, type WorldMap } from '../world/collision.js';
import type { WorldPos } from '../world/coords.js';
import {
  headingToUnitVector,
  rotateHeadingToward,
  snapAngleToHeading,
  type HeadingIndex,
} from './heading.js';

export type SpeedState = 'seated' | 'paddling' | 'riding';

export interface SurfboardStats {
  turnRateDegPerTick: number;
  speedPaddle: number;
  speedRide: number;
}

export interface SurfboardState {
  position: WorldPos;
  currentHeading: HeadingIndex;
  intendedHeading: HeadingIndex;
  speedState: SpeedState;
  isRotating: boolean;
}

export interface SurfboardInput {
  setIntendedHeading?: HeadingIndex;
  startPaddle?: boolean;
  standUp?: boolean;
  lieDown?: boolean;
  stop?: boolean;
}

export interface TickResult {
  state: SurfboardState;
  moved: boolean;
  collided: boolean;
  headingChanged: boolean;
}

export function createSurfboard(
  startX: number,
  startY: number,
  startHeading: HeadingIndex = 0,
): SurfboardState {
  return {
    position: { x: startX, y: startY },
    currentHeading: startHeading,
    intendedHeading: startHeading,
    speedState: 'seated',
    isRotating: false,
  };
}

export function headingFromClick(
  boardX: number,
  boardY: number,
  clickX: number,
  clickY: number,
): HeadingIndex {
  const angle = Math.atan2(clickY - boardY, clickX - boardX);
  return snapAngleToHeading(angle);
}

function getForwardSpeed(state: SurfboardState, stats: SurfboardStats): number {
  if (state.speedState === 'paddling') {
    return stats.speedPaddle / SPEED_STAT_TO_TILES_PER_TICK;
  }
  if (state.speedState === 'riding') {
    return stats.speedRide / SPEED_STAT_TO_TILES_PER_TICK;
  }
  return 0;
}

function applyInput(state: SurfboardState, input: SurfboardInput): SurfboardState {
  const next = { ...state };

  if (input.setIntendedHeading !== undefined) {
    next.intendedHeading = input.setIntendedHeading;
    next.isRotating = next.intendedHeading !== next.currentHeading;
  }
  if (input.startPaddle) {
    next.speedState = 'paddling';
  }
  if (input.standUp && next.speedState !== 'seated') {
    next.speedState = 'riding';
  }
  if (input.lieDown && next.speedState === 'riding') {
    next.speedState = 'paddling';
  }
  if (input.stop) {
    next.speedState = 'seated';
  }

  return next;
}

function wouldCollide(map: WorldMap, x: number, y: number): boolean {
  const tile = getTile(map, Math.floor(x), Math.floor(y));
  if (tile === null) {
    return true;
  }
  return !isTileSurfable(tile);
}

export function tickSurfboard(
  state: SurfboardState,
  map: WorldMap,
  input: SurfboardInput = {},
  stats: SurfboardStats = DEFAULT_SURFBOARD_STATS,
): TickResult {
  const next = applyInput(state, input);
  let moved = false;
  let collided = false;
  let headingChanged = false;

  const previousHeading = next.currentHeading;
  if (next.isRotating) {
    next.currentHeading = rotateHeadingToward(
      next.currentHeading,
      next.intendedHeading,
      stats.turnRateDegPerTick,
    );
    next.isRotating = next.currentHeading !== next.intendedHeading;
    headingChanged = next.currentHeading !== previousHeading;
  }

  const speed = getForwardSpeed(next, stats);
  if (speed > 0) {
    const vector = headingToUnitVector(next.currentHeading);
    const targetX = next.position.x + vector.x * speed;
    const targetY = next.position.y + vector.y * speed;

    if (wouldCollide(map, targetX, targetY)) {
      collided = true;
    } else {
      next.position = { x: targetX, y: targetY };
      moved = true;
    }
  }

  return {
    state: next,
    moved,
    collided,
    headingChanged,
  };
}

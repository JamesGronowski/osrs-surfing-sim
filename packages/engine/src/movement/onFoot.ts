import { getTile, isTileLandWalkable, type WorldMap } from '../world/collision.js';
import type { WorldPos } from '../world/coords.js';
import { snapAngleToHeading, type HeadingIndex } from './heading.js';
import { findTilePath, tileCenter, type TileCoord } from './pathfinder.js';

/** OSRS run speed: one tile per 600ms game tick. */
export const RUN_TILES_PER_TICK = 1;

/** OSRS walk speed: one tile every two ticks. */
export const WALK_TILES_PER_TICK = 1;
export const WALK_TICK_INTERVAL = 2;

export interface OnFootWalkState {
  path: TileCoord[];
  pathIndex: number;
  running: boolean;
  walkTickCounter: number;
  targetTx: number;
  targetTy: number;
}

export function createOnFootWalkState(
  path: TileCoord[],
  targetTx: number,
  targetTy: number,
  running = true,
): OnFootWalkState {
  return {
    path,
    pathIndex: path.length > 1 ? 1 : 0,
    running,
    walkTickCounter: 0,
    targetTx,
    targetTy,
  };
}

export function isWorldPointOnFootNavigable(
  map: WorldMap,
  worldX: number,
  worldY: number,
): boolean {
  const tile = getTile(map, Math.floor(worldX), Math.floor(worldY));
  if (tile === null) {
    return false;
  }
  return isTileLandWalkable(tile);
}

export function planWalkPath(
  map: WorldMap,
  position: WorldPos,
  worldX: number,
  worldY: number,
): OnFootWalkState | null {
  const destTx = Math.floor(worldX);
  const destTy = Math.floor(worldY);

  if (!isWorldPointOnFootNavigable(map, worldX, worldY)) {
    return null;
  }

  const startTx = Math.floor(position.x);
  const startTy = Math.floor(position.y);
  const path = findTilePath(map, startTx, startTy, destTx, destTy);

  if (!path) {
    return null;
  }

  return createOnFootWalkState(path, destTx, destTy);
}

export interface OnFootTickResult {
  position: WorldPos;
  heading: HeadingIndex;
  walk: OnFootWalkState | null;
  moved: boolean;
}

export function tickOnFootPath(
  position: WorldPos,
  heading: HeadingIndex,
  walk: OnFootWalkState,
): OnFootTickResult {
  if (walk.pathIndex >= walk.path.length) {
    return { position, heading, walk: null, moved: false };
  }

  if (!walk.running) {
    walk.walkTickCounter += 1;
    if (walk.walkTickCounter % WALK_TICK_INTERVAL !== 0) {
      return { position, heading, walk, moved: false };
    }
  }

  const nextTile = walk.path[walk.pathIndex];
  const nextPos = tileCenter(nextTile.tx, nextTile.ty);
  const nextHeading = snapAngleToHeading(
    Math.atan2(nextPos.y - position.y, nextPos.x - position.x),
  );

  const nextWalk: OnFootWalkState = {
    ...walk,
    pathIndex: walk.pathIndex + 1,
  };

  const finished = nextWalk.pathIndex >= nextWalk.path.length;

  return {
    position: nextPos,
    heading: nextHeading,
    walk: finished ? null : nextWalk,
    moved: true,
  };
}

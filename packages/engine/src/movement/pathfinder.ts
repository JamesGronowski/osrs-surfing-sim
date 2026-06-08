import { getTile, isTileLandWalkable, type WorldMap } from '../world/collision.js';

export interface TileCoord {
  tx: number;
  ty: number;
}

const ORTHOGONAL: TileCoord[] = [
  { tx: 1, ty: 0 },
  { tx: -1, ty: 0 },
  { tx: 0, ty: 1 },
  { tx: 0, ty: -1 },
];

const DIAGONAL: TileCoord[] = [
  { tx: 1, ty: 1 },
  { tx: 1, ty: -1 },
  { tx: -1, ty: 1 },
  { tx: -1, ty: -1 },
];

function isFootTileWalkable(map: WorldMap, tx: number, ty: number): boolean {
  const tile = getTile(map, tx, ty);
  if (tile === null) {
    return false;
  }
  return isTileLandWalkable(tile);
}

/** OSRS diagonal rule: both adjacent cardinals must be walkable. */
function canStep(
  map: WorldMap,
  fromTx: number,
  fromTy: number,
  toTx: number,
  toTy: number,
): boolean {
  if (!isFootTileWalkable(map, toTx, toTy)) {
    return false;
  }

  const dx = toTx - fromTx;
  const dy = toTy - fromTy;
  if (dx === 0 || dy === 0) {
    return true;
  }

  return (
    isFootTileWalkable(map, fromTx + dx, fromTy) && isFootTileWalkable(map, fromTx, fromTy + dy)
  );
}

function coordKey(tx: number, ty: number): string {
  return `${tx},${ty}`;
}

/**
 * BFS tile pathfinder matching RSMod / OSRS click-to-walk behaviour.
 * Returns tiles from start through destination (inclusive).
 */
export function findTilePath(
  map: WorldMap,
  startTx: number,
  startTy: number,
  destTx: number,
  destTy: number,
): TileCoord[] | null {
  if (!isFootTileWalkable(map, destTx, destTy)) {
    return null;
  }

  if (startTx === destTx && startTy === destTy) {
    return [{ tx: startTx, ty: startTy }];
  }

  const queue: TileCoord[] = [{ tx: startTx, ty: startTy }];
  const cameFrom = new Map<string, TileCoord | null>();
  cameFrom.set(coordKey(startTx, startTy), null);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.tx === destTx && current.ty === destTy) {
      const path: TileCoord[] = [];
      let node: TileCoord | null = current;
      while (node) {
        path.push(node);
        node = cameFrom.get(coordKey(node.tx, node.ty)) ?? null;
      }
      path.reverse();
      return path;
    }

    const neighbors = [...ORTHOGONAL, ...DIAGONAL];
    for (const step of neighbors) {
      const nextTx = current.tx + step.tx;
      const nextTy = current.ty + step.ty;
      const key = coordKey(nextTx, nextTy);

      if (cameFrom.has(key)) {
        continue;
      }
      if (!canStep(map, current.tx, current.ty, nextTx, nextTy)) {
        continue;
      }

      cameFrom.set(key, current);
      queue.push({ tx: nextTx, ty: nextTy });
    }
  }

  return null;
}

export function tileCenter(tx: number, ty: number): { x: number; y: number } {
  return { x: tx + 0.5, y: ty + 0.5 };
}

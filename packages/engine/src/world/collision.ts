import { quarterKey } from './coords.js';

export type TileType =
  | 'deep_water'
  | 'shallow'
  | 'sand'
  | 'grass'
  | 'coral_solid'
  | 'coral_rideable'
  | 'tide_zone';

export interface WorldMap {
  widthTiles: number;
  heightTiles: number;
  tiles: TileType[][];
  blockedQuarters: Set<string>;
}

export function isTileWalkable(tile: TileType): boolean {
  return tile !== 'coral_solid';
}

export function isTileLandWalkable(tile: TileType): boolean {
  return tile === 'grass' || tile === 'sand';
}

export function isTileOcean(tile: TileType): boolean {
  return tile === 'deep_water' || tile === 'shallow' || tile === 'tide_zone';
}

export function isTileSurfable(tile: TileType): boolean {
  return (
    tile === 'sand' ||
    tile === 'deep_water' ||
    tile === 'shallow' ||
    tile === 'coral_rideable' ||
    tile === 'tide_zone'
  );
}

export function createWorldMap(widthTiles: number, heightTiles: number, fill: TileType): WorldMap {
  const tiles: TileType[][] = Array.from({ length: heightTiles }, () =>
    Array.from({ length: widthTiles }, () => fill),
  );

  return {
    widthTiles,
    heightTiles,
    tiles,
    blockedQuarters: new Set(),
  };
}

export function setTile(map: WorldMap, tx: number, ty: number, tile: TileType): void {
  if (ty < 0 || ty >= map.heightTiles || tx < 0 || tx >= map.widthTiles) {
    return;
  }
  map.tiles[ty][tx] = tile;
}

export function getTile(map: WorldMap, tx: number, ty: number): TileType | null {
  if (ty < 0 || ty >= map.heightTiles || tx < 0 || tx >= map.widthTiles) {
    return null;
  }
  return map.tiles[ty][tx];
}

export function isQuarterBlocked(map: WorldMap, qx: number, qy: number): boolean {
  if (map.blockedQuarters.has(quarterKey(qx, qy))) {
    return true;
  }

  const tx = Math.floor(qx / 4);
  const ty = Math.floor(qy / 4);
  const tile = getTile(map, tx, ty);
  if (tile === null) {
    return true;
  }
  return !isTileWalkable(tile);
}

export function isWorldPointNavigable(map: WorldMap, worldX: number, worldY: number): boolean {
  const tx = Math.floor(worldX);
  const ty = Math.floor(worldY);
  const tile = getTile(map, tx, ty);
  if (tile === null) {
    return false;
  }
  return isTileOcean(tile);
}

/** Tiles the player can click to set a sailing heading (includes reef). */
export function isWorldPointSailingTarget(map: WorldMap, worldX: number, worldY: number): boolean {
  const tile = getTile(map, Math.floor(worldX), Math.floor(worldY));
  if (tile === null) {
    return false;
  }
  return isTileSurfable(tile) && tile !== 'grass';
}

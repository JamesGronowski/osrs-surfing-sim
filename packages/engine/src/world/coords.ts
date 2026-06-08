import { QUARTERS_PER_TILE } from '../constants/movement.js';

export interface QuarterTilePos {
  qx: number;
  qy: number;
}

export interface WorldPos {
  x: number;
  y: number;
}

export function quarterToWorld(pos: QuarterTilePos): WorldPos {
  return {
    x: pos.qx / QUARTERS_PER_TILE,
    y: pos.qy / QUARTERS_PER_TILE,
  };
}

export function worldToQuarter(pos: WorldPos): QuarterTilePos {
  return {
    qx: Math.round(pos.x * QUARTERS_PER_TILE),
    qy: Math.round(pos.y * QUARTERS_PER_TILE),
  };
}

export function tileToQuarter(tx: number, ty: number): QuarterTilePos {
  return {
    qx: tx * QUARTERS_PER_TILE,
    qy: ty * QUARTERS_PER_TILE,
  };
}

export function quarterKey(qx: number, qy: number): string {
  return `${qx},${qy}`;
}

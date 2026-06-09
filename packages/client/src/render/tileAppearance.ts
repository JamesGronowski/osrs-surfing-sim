import {
  TIDE_LEADING_WASH_HEIGHT,
  tideWaveSurfaceY,
  type TideState,
  type TileType,
} from '@osrs-surfing/engine';

import { TILE_PALETTE } from './tilePalette.js';

export type RenderTileVariant =
  | 'deep_water'
  | 'shallow'
  | 'sand'
  | 'grass'
  | 'reef_exposed'
  | 'reef_submerged'
  | 'coral_solid'
  | 'tide_zone';

export function resolveRenderTileVariant(
  tile: TileType,
  worldX: number,
  worldY: number,
  tide: TideState | null,
): RenderTileVariant {
  if (tile === 'coral_rideable' && tide !== null) {
    const flood =
      TIDE_LEADING_WASH_HEIGHT > 0
        ? tideWaveSurfaceY(worldX, worldY, tide) / TIDE_LEADING_WASH_HEIGHT
        : 0;
    return flood > 0.35 ? 'reef_submerged' : 'reef_exposed';
  }
  return tile;
}

export function renderVariantColor(variant: RenderTileVariant): number {
  switch (variant) {
    case 'deep_water':
      return TILE_PALETTE.deepWater;
    case 'shallow':
      return TILE_PALETTE.shallow;
    case 'reef_exposed':
      return TILE_PALETTE.reefExposed;
    case 'reef_submerged':
      return TILE_PALETTE.reefSubmerged;
    case 'sand':
      return TILE_PALETTE.sand;
    case 'grass':
      return TILE_PALETTE.grass;
    case 'coral_solid':
      return TILE_PALETTE.coralSolid;
    case 'tide_zone':
      return TILE_PALETTE.tideZone;
    default:
      return TILE_PALETTE.deepWater;
  }
}

import type { TileType } from '@osrs-surfing/engine';

import { TILE_PALETTE } from './tilePalette.js';

/** Flat colours for minimap fallback and tests. */
export const TILE_COLORS: Record<TileType, number> = {
  deep_water: TILE_PALETTE.deepWater,
  shallow: TILE_PALETTE.shallow,
  sand: TILE_PALETTE.sand,
  grass: TILE_PALETTE.grass,
  coral_solid: TILE_PALETTE.coralSolid,
  coral_rideable: TILE_PALETTE.reefExposed,
  tide_zone: TILE_PALETTE.tideZone,
};

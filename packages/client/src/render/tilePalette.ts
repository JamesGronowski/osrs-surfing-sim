/** OSRS-inspired tropical ocean and reef palette. */
export const REEF_CORAL_PINK = 0xf4a7b9;
export const REEF_CORAL_ROSE = 0xd48098;

export const TILE_PALETTE = {
  deepWater: 0x286890,
  shallow: 0x3a88a8,
  /** Exposed reef — water with a soft pink coral lift near the surface. */
  reefExposed: 0x4a88a0,
  /** Submerged reef — nearly identical to open water with a whisper of pink. */
  reefSubmerged: 0x307090,
  sand: 0xc9b07a,
  grass: 0x4d8a3c,
  coralSolid: 0x6a4a58,
  tideZone: 0x3488a8,
} as const;

export type TilePaletteKey = keyof typeof TILE_PALETTE;

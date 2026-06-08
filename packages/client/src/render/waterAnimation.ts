import { TILE_TEXTURE_SIZE } from './tileTextures.js';

/** Texture-space scroll speed — driven by real time, not game ticks. */
const WATER_SCROLL_X_PX_PER_SEC = 2.4;
const WATER_SCROLL_Y_PX_PER_SEC = 1.6;

export function waterTextureScroll(visualTimeMs: number): { scrollX: number; scrollY: number } {
  const seconds = visualTimeMs / 1000;
  return {
    scrollX: (seconds * WATER_SCROLL_X_PX_PER_SEC) % TILE_TEXTURE_SIZE,
    scrollY: (seconds * WATER_SCROLL_Y_PX_PER_SEC) % TILE_TEXTURE_SIZE,
  };
}

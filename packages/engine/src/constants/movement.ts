export const HEADING_COUNT = 16;
export const DEGREES_PER_HEADING = 360 / HEADING_COUNT;
export const QUARTERS_PER_TILE = 4;
export const TICK_MS = 600;

/** Degrees rotated per simulation tick toward intended heading (surfboard / raft). */
export const TURN_RATE_DEG_PER_TICK = 22.5;

/**
 * Surfboard speed stats are stored in half-tile steps per tick (stat ÷ 2 = tiles/tick).
 * OSRS sailing hull speeds are defined in tiles per tick — see
 * https://oldschool.runescape.wiki/w/Hull
 */
export const SPEED_STAT_TO_TILES_PER_TICK = 2;

/** Teak-tier pace while lying down / paddling out (tiles per tick). */
export const HULL_SPEED_PADDLE_TILES_PER_TICK = 2;

/** Camphor and ironwood hull base speed (tiles per tick). */
export const HULL_SPEED_CAMPHOR_TILES_PER_TICK = 2.5;

/** Rosewood hull base speed (tiles per tick). */
export const HULL_SPEED_ROSEWOOD_TILES_PER_TICK = 3;

export function tilesPerTickToSpeedStat(tilesPerTick: number): number {
  return tilesPerTick * SPEED_STAT_TO_TILES_PER_TICK;
}

export function speedStatToTilesPerTick(speedStat: number): number {
  return speedStat / SPEED_STAT_TO_TILES_PER_TICK;
}

/** Default board: camphor hull ride speed, teak-tier paddle speed. */
export const SPEED_PADDLE = tilesPerTickToSpeedStat(HULL_SPEED_PADDLE_TILES_PER_TICK);
export const SPEED_RIDE = tilesPerTickToSpeedStat(HULL_SPEED_CAMPHOR_TILES_PER_TICK);
export const SPEED_RIDE_ROSEWOOD = tilesPerTickToSpeedStat(HULL_SPEED_ROSEWOOD_TILES_PER_TICK);

export const DEFAULT_SURFBOARD_STATS = {
  turnRateDegPerTick: TURN_RATE_DEG_PER_TICK,
  speedPaddle: SPEED_PADDLE,
  speedRide: SPEED_RIDE,
} as const;

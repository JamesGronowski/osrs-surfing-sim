import {
  DEFAULT_SURFBOARD_STATS,
  SPEED_RIDE,
  SPEED_RIDE_IRONWOOD,
  SPEED_RIDE_ROSEWOOD,
} from '../constants/movement.js';
import type { SurfboardStats } from '../movement/surfboard.js';
import type { UnlockId } from './types.js';

export function surfboardStatsForUnlocks(unlocked: Set<UnlockId>): SurfboardStats {
  let speedRide = SPEED_RIDE;
  if (unlocked.has('rosewood_board')) {
    speedRide = SPEED_RIDE_ROSEWOOD;
  } else if (unlocked.has('surf_guru_board')) {
    speedRide = SPEED_RIDE_IRONWOOD;
  }

  return {
    turnRateDegPerTick: DEFAULT_SURFBOARD_STATS.turnRateDegPerTick,
    speedPaddle: DEFAULT_SURFBOARD_STATS.speedPaddle,
    speedRide,
  };
}

export function surfboardTierNameForUnlocks(unlocked: Set<UnlockId>): string {
  if (unlocked.has('rosewood_board')) {
    return 'Rosewood Board';
  }
  if (unlocked.has('surf_guru_board')) {
    return 'Ironwood Board';
  }
  return 'Camphor Board';
}

import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SURFBOARD_STATS,
  SPEED_RIDE,
  SPEED_RIDE_IRONWOOD,
  SPEED_RIDE_ROSEWOOD,
} from '../constants/movement.js';
import { surfboardStatsForUnlocks, surfboardTierNameForUnlocks } from './surfboardUnlocks.js';
import type { UnlockId } from './types.js';

describe('surfboardStatsForUnlocks', () => {
  it('uses starter camphor speed with no board upgrades', () => {
    const stats = surfboardStatsForUnlocks(new Set());
    expect(stats.speedRide).toBe(SPEED_RIDE);
    expect(stats.speedPaddle).toBe(DEFAULT_SURFBOARD_STATS.speedPaddle);
    expect(stats.turnRateDegPerTick).toBe(DEFAULT_SURFBOARD_STATS.turnRateDegPerTick);
  });

  it('applies ironwood ride speed when ironwood board is unlocked', () => {
    const stats = surfboardStatsForUnlocks(new Set<UnlockId>(['surf_guru_board']));
    expect(stats.speedRide).toBe(SPEED_RIDE_IRONWOOD);
  });

  it('applies rosewood ride speed when rosewood board is unlocked', () => {
    const stats = surfboardStatsForUnlocks(new Set<UnlockId>(['rosewood_board']));
    expect(stats.speedRide).toBe(SPEED_RIDE_ROSEWOOD);
  });

  it('prefers rosewood over ironwood when both are unlocked', () => {
    const stats = surfboardStatsForUnlocks(
      new Set<UnlockId>(['surf_guru_board', 'rosewood_board']),
    );
    expect(stats.speedRide).toBe(SPEED_RIDE_ROSEWOOD);
  });
});

describe('surfboardTierNameForUnlocks', () => {
  it('uses camphor by default', () => {
    expect(surfboardTierNameForUnlocks(new Set())).toBe('Camphor Board');
  });

  it('uses ironwood when ironwood board is unlocked', () => {
    expect(surfboardTierNameForUnlocks(new Set<UnlockId>(['surf_guru_board']))).toBe(
      'Ironwood Board',
    );
  });

  it('uses rosewood when rosewood board is unlocked', () => {
    expect(surfboardTierNameForUnlocks(new Set<UnlockId>(['rosewood_board']))).toBe(
      'Rosewood Board',
    );
  });

  it('prefers rosewood over ironwood when both are unlocked', () => {
    expect(
      surfboardTierNameForUnlocks(new Set<UnlockId>(['surf_guru_board', 'rosewood_board'])),
    ).toBe('Rosewood Board');
  });
});

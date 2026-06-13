import { describe, expect, it } from 'vitest';

import { levelForXp, skillXpProgress, xpForLevel } from './experience.js';

describe('experience', () => {
  it('matches OSRS wiki thresholds for sample levels', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(83);
    expect(xpForLevel(10)).toBe(1_154);
    expect(xpForLevel(50)).toBe(101_333);
    expect(xpForLevel(92)).toBe(6_517_253);
    expect(xpForLevel(99)).toBe(13_034_431);
  });

  it('inverts xp thresholds back to levels', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(82)).toBe(1);
    expect(levelForXp(83)).toBe(2);
    expect(levelForXp(1_153)).toBe(9);
    expect(levelForXp(1_154)).toBe(10);
    expect(levelForXp(13_034_431)).toBe(99);
    expect(levelForXp(200_000_000)).toBe(99);
  });

  it('reports progress within the current level', () => {
    const progress = skillXpProgress(1_200);
    expect(progress.level).toBe(10);
    expect(progress.xpIntoLevel).toBe(46);
    expect(progress.xpToNextLevel).toBe(204);
    expect(progress.percent).toBeCloseTo((46 / 204) * 100, 5);
  });
});

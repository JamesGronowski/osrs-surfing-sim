import { describe, expect, it } from 'vitest';

import {
  degreesToHeading,
  headingToDegrees,
  interpolateHeadingIndex,
  rotateHeadingToward,
  shortestHeadingDelta,
  snapAngleToHeading,
} from './heading.js';

describe('heading', () => {
  it('snaps angles to 16 directions', () => {
    expect(snapAngleToHeading(0)).toBe(0);
    expect(snapAngleToHeading(Math.PI / 2)).toBe(4);
    expect(snapAngleToHeading(Math.PI)).toBe(8);
  });

  it('converts degrees and heading indices', () => {
    expect(headingToDegrees(4)).toBe(90);
    expect(degreesToHeading(90)).toBe(4);
  });

  it('computes shortest delta clockwise or counter-clockwise', () => {
    expect(shortestHeadingDelta(0, 4)).toBe(4);
    expect(shortestHeadingDelta(0, 12)).toBe(-4);
    expect(shortestHeadingDelta(15, 1)).toBe(2);
  });

  it('rotates toward target by at most max degrees per tick', () => {
    expect(rotateHeadingToward(0, 8, 22.5)).toBe(1);
    expect(rotateHeadingToward(0, 8, 180)).toBe(8);
    expect(rotateHeadingToward(4, 4, 22.5)).toBe(4);
  });

  it('interpolates heading along the shortest arc', () => {
    expect(interpolateHeadingIndex(0, 8, 0)).toBe(0);
    expect(interpolateHeadingIndex(0, 8, 1)).toBe(8);
    expect(headingToDegrees(interpolateHeadingIndex(0, 8, 0.5))).toBe(90);
    expect(headingToDegrees(interpolateHeadingIndex(0, 4, 0.5))).toBeCloseTo(45, 5);
  });
});

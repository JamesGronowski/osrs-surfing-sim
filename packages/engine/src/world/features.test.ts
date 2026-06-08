import { describe, expect, it } from 'vitest';

import {
  createTideState,
  findTrickZoneAt,
  isApproachHeadingValid,
  isPointInTideSweep,
  isTrickZoneSubmerged,
  type TrickZone,
} from './features.js';

const tide = createTideState({
  centerX: 24,
  centerY: 11,
  innerRadius: 5.5,
  outerRadius: 8.5,
  sweepRadians: Math.PI / 2,
  advancePerTick: 0.02,
});

describe('trick approach', () => {
  it('validates rider heading against feature rotation', () => {
    const zone: TrickZone = {
      id: 'test',
      type: 'rail',
      prepareSlot: 0,
      center: { x: 0, y: 0 },
      radius: 2,
      rotationRadians: 0,
      tricked: false,
    };
    expect(isApproachHeadingValid(zone, 0)).toBe(true);
    expect(isApproachHeadingValid(zone, 8)).toBe(false);
    expect(isApproachHeadingValid(zone, 1)).toBe(true);
  });
});

describe('ring tide', () => {
  it('covers reef points in the sweep arc', () => {
    expect(isPointInTideSweep(30, 11, tide)).toBe(true);
    expect(isPointInTideSweep(18, 11, tide)).toBe(false);
  });

  it('submerges trick zones under the tide', () => {
    const zone: TrickZone = {
      id: 'east',
      type: 'rail',
      prepareSlot: 0,
      center: { x: 30, y: 11 },
      radius: 1,
      rotationRadians: -Math.PI / 2,
      tricked: false,
    };
    expect(isTrickZoneSubmerged(zone, tide)).toBe(true);
    expect(findTrickZoneAt([zone], { x: 30, y: 11 }, tide)).toBeNull();
    expect(findTrickZoneAt([zone], { x: 30, y: 11 }, null)).toBe(zone);
  });
});

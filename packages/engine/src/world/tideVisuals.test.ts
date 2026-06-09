import { describe, expect, it } from 'vitest';

import { createTideState, normalizeAngle } from './features.js';
import {
  tideBandProgressAtAngle,
  tideRideSurfaceY,
  tideVisualDepthAtAngle,
  tideVisualDepthAtPoint,
  tideWaveSurfaceAtProgress,
  TIDE_LEADING_WASH_HEIGHT,
  TIDE_REEF_RIDE_SURFACE_Y,
} from './tideVisuals.js';

const tide = createTideState({
  centerX: 24,
  centerY: 11,
  innerRadius: 5.5,
  outerRadius: 8.5,
  sweepRadians: Math.PI / 2,
  advancePerTick: 0.02,
});

describe('tideVisualDepth', () => {
  it('peaks at the centre of the submerged band', () => {
    const angle = 0.5;
    const phase = normalizeAngle(angle - tide.sweepRadians / 2);
    const submerged = { ...tide, phaseRadians: phase };

    expect(tideVisualDepthAtAngle(angle, submerged)).toBeCloseTo(1, 5);
    expect(tideBandProgressAtAngle(angle, submerged)).toBeCloseTo(0.5, 5);
  });

  it('is zero at the leading and trailing edges', () => {
    const angle = 1.2;
    const leading = { ...tide, phaseRadians: angle };
    const trailing = { ...tide, phaseRadians: normalizeAngle(angle - tide.sweepRadians) };

    expect(tideVisualDepthAtAngle(angle, leading)).toBeCloseTo(0, 5);
    expect(tideVisualDepthAtAngle(angle, trailing)).toBeCloseTo(0, 5);
  });

  it('holds the wave body at the wash crest through the band', () => {
    expect(tideWaveSurfaceAtProgress(0)).toBe(0);
    expect(tideWaveSurfaceAtProgress(0.5)).toBeCloseTo(TIDE_LEADING_WASH_HEIGHT, 5);
    expect(tideWaveSurfaceAtProgress(1)).toBeCloseTo(0, 5);
  });

  it('rises gradually at the leading edge and drops quickly at the breaker', () => {
    const earlyRise = tideWaveSurfaceAtProgress(0.1);
    const lateRise = tideWaveSurfaceAtProgress(0.25);
    const beforeCliff = tideWaveSurfaceAtProgress(0.85);
    const onCliff = tideWaveSurfaceAtProgress(0.96);

    expect(earlyRise).toBeGreaterThan(0);
    expect(earlyRise).toBeLessThan(lateRise);
    expect(lateRise).toBeLessThan(TIDE_LEADING_WASH_HEIGHT);
    expect(beforeCliff).toBeCloseTo(TIDE_LEADING_WASH_HEIGHT, 5);
    expect(onCliff).toBeLessThan(TIDE_LEADING_WASH_HEIGHT * 0.5);
  });

  it('raises the ride surface at peak tide', () => {
    const worldX = tide.centerX + 7;
    const worldY = tide.centerY;
    const angle = Math.atan2(worldY - tide.centerY, worldX - tide.centerX);
    const peak = { ...tide, phaseRadians: normalizeAngle(angle - tide.sweepRadians / 2) };

    expect(tideVisualDepthAtPoint(worldX, worldY, peak)).toBeGreaterThan(0.9);
    expect(tideRideSurfaceY(worldX, worldY, peak)).toBeGreaterThan(TIDE_REEF_RIDE_SURFACE_Y);
    expect(tideRideSurfaceY(worldX, worldY, null)).toBe(TIDE_REEF_RIDE_SURFACE_Y);
  });
});

import { describe, expect, it } from 'vitest';

import type { TrickZone } from './features.js';
import {
  isPointInTrickZoneHitbox,
  trickZoneHitboxExtents,
  tunnelTrickHitboxFactors,
} from './trickHitbox.js';

function railZone(rotationRadians = 0): TrickZone {
  return {
    id: 'rail',
    type: 'rail',
    prepareSlot: 0,
    center: { x: 10, y: 10 },
    radius: 4,
    rotationRadians,
    tricked: false,
  };
}

describe('trickZoneHitbox', () => {
  it('uses a tight oriented box for rails instead of the full zone circle', () => {
    const zone = railZone();
    const { halfAlongRide, halfLateral } = trickZoneHitboxExtents('rail', zone.radius);

    expect(halfAlongRide).toBeCloseTo(4.6);
    expect(halfLateral).toBeCloseTo(0.64);
    expect(isPointInTrickZoneHitbox(zone, { x: 10 + halfAlongRide - 0.1, y: 10 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 10 + halfAlongRide + 0.5, y: 10 })).toBe(false);
    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 + halfLateral - 0.05 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 + zone.radius })).toBe(false);
  });

  it('rotates the hitbox with the feature ride axis', () => {
    const zone = railZone(Math.PI / 2);
    const { halfAlongRide } = trickZoneHitboxExtents('rail', zone.radius);

    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 + halfAlongRide - 0.1 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 10 + halfAlongRide - 0.1, y: 10 })).toBe(false);
  });

  it('wraps the scaled tunnel half-torus in ride-oriented space', () => {
    const zone: TrickZone = {
      id: 'tunnel',
      type: 'tunnel',
      prepareSlot: 1,
      center: { x: 5, y: 5 },
      radius: 4,
      rotationRadians: 0,
      tricked: false,
    };
    const factors = tunnelTrickHitboxFactors();
    const { halfAlongRide, halfLateral } = trickZoneHitboxExtents('tunnel', zone.radius);

    expect(halfAlongRide).toBeCloseTo(zone.radius * factors.halfAlongRide);
    expect(halfLateral).toBeCloseTo(zone.radius * factors.halfLateral);
    expect(halfLateral).toBeGreaterThan(2.5);
    expect(isPointInTrickZoneHitbox(zone, { x: 5 + halfAlongRide - 0.1, y: 5 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 5, y: 5 + halfLateral - 0.1 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 5, y: 5 + halfLateral + 0.5 })).toBe(false);
  });

  it('clips jump hitbox at the waterline instead of submerged ramp bulk', () => {
    const zone: TrickZone = {
      id: 'jump',
      type: 'jump',
      prepareSlot: 2,
      center: { x: 0, y: 0 },
      radius: 4,
      rotationRadians: 0,
      tricked: false,
    };
    const { halfAlongRide } = trickZoneHitboxExtents('jump', zone.radius);

    expect(halfAlongRide).toBeCloseTo(3.6, 1);
    expect(halfAlongRide).toBeLessThan(4.8);
    expect(isPointInTrickZoneHitbox(zone, { x: 3.4, y: 0 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 4.8, y: 0 })).toBe(false);
  });
});

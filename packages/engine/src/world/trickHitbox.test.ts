import { describe, expect, it } from 'vitest';

import type { TrickZone } from './features.js';
import {
  isPointInTrickZoneHitbox,
  TRICK_HITBOX_HALF_ALONG_RIDE,
  TRICK_HITBOX_HALF_LATERAL,
  trickZoneHitboxExtents,
  tunnelTrickHitboxFactors,
  WALL_RIDE_HITBOX_PAD_TILES,
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
  it('uses a ride-oriented AABB for rails spanning the full bar', () => {
    const zone = railZone();
    const { halfAlongRide, halfLateral } = trickZoneHitboxExtents('rail', zone.radius);

    expect(halfAlongRide).toBeCloseTo(4.6);
    expect(halfLateral).toBeCloseTo(1.8);
    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 10 + halfAlongRide - 0.1, y: 10 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 + halfLateral - 0.1 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 + halfLateral + 0.2 })).toBe(false);
    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 + zone.radius })).toBe(false);
    // Midway between posts (±0.85×radius) on the ride axis.
    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 })).toBe(true);
    expect(
      isPointInTrickZoneHitbox(zone, {
        x: 10,
        y: 10 + halfLateral * 0.9,
      }),
    ).toBe(true);
    // Beyond bar ends is outside the AABB.
    expect(
      isPointInTrickZoneHitbox(zone, {
        x: 10 + halfAlongRide + 0.3,
        y: 10 + halfLateral * 0.5,
      }),
    ).toBe(false);
  });

  it('rotates the hitbox with the feature ride axis', () => {
    const zone = railZone(Math.PI / 2);
    const { halfAlongRide } = trickZoneHitboxExtents('rail', zone.radius);

    expect(isPointInTrickZoneHitbox(zone, { x: 10, y: 10 + halfAlongRide - 0.1 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 10 + halfAlongRide - 0.1, y: 10 })).toBe(false);
  });

  it('pads wall ride hitboxes for glancing slide-up approaches', () => {
    const zone: TrickZone = {
      id: 'wall',
      type: 'wall_ride',
      prepareSlot: 1,
      center: { x: 0, y: 0 },
      radius: 4,
      rotationRadians: 0,
      tricked: false,
    };
    const { halfAlongRide, halfLateral } = trickZoneHitboxExtents('wall_ride', zone.radius);
    const baseHalfAlong = zone.radius * TRICK_HITBOX_HALF_ALONG_RIDE.wall_ride;
    const baseHalfLateral = zone.radius * TRICK_HITBOX_HALF_LATERAL.wall_ride;

    expect(halfAlongRide).toBeCloseTo(baseHalfAlong + WALL_RIDE_HITBOX_PAD_TILES);
    expect(halfLateral).toBeCloseTo(baseHalfLateral + WALL_RIDE_HITBOX_PAD_TILES);
    expect(isPointInTrickZoneHitbox(zone, { x: baseHalfAlong + 0.4, y: 0 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: baseHalfAlong + 0.6, y: 0 })).toBe(false);
    expect(isPointInTrickZoneHitbox(zone, { x: 0, y: baseHalfLateral + 0.4 })).toBe(true);
    expect(isPointInTrickZoneHitbox(zone, { x: 0, y: baseHalfLateral + 0.6 })).toBe(false);
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

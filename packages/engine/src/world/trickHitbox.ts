import type { WorldPos } from './coords.js';
import type { TrickFeatureType, TrickZone } from './features.js';

/** Mirrors client jump ramp mesh factors (trickFeatureMeshes.ts). */
const JUMP_RAMP_RUN = 1;
const JUMP_RAMP_PEAK_HEIGHT = 0.55;
const JUMP_RAMP_LIP_BELOW_SURFACE = 0.12;
const JUMP_RAMP_WIDTH = 2.2;
/** Ride-axis slack beyond where the ramp top crosses the ride surface (y=0). */
const JUMP_HITBOX_PAST_WATER_ALONG = 0.08;
const JUMP_HITBOX_ABOVE_SURFACE_HEIGHT = 0.08;

function jumpHalfAlongRideFactor(): number {
  const waterCrossAlong =
    (JUMP_RAMP_RUN * JUMP_RAMP_PEAK_HEIGHT) / (JUMP_RAMP_PEAK_HEIGHT + JUMP_RAMP_LIP_BELOW_SURFACE);
  return waterCrossAlong + JUMP_HITBOX_PAST_WATER_ALONG;
}

/** Half-torus tunnel mesh (shared with client trickFeatureMeshes.ts). */
export const TUNNEL_TORUS_MAJOR_RADIUS_FACTOR = 0.6;
export const TUNNEL_TORUS_TUBE_RADIUS_FACTOR = 0.14;
export const TUNNEL_TORUS_LENGTH_SCALE = 3.25;
export const TUNNEL_TORUS_BASE_Y_FACTOR = TUNNEL_TORUS_TUBE_RADIUS_FACTOR;
export const TUNNEL_TORUS_CLEARANCE_ABOVE_ARCH = 0.06;
/** Padding around the oriented AABB that wraps the scaled half-torus. */
const TUNNEL_HITBOX_MARGIN = 0.04;

/** Extra reach beyond wall mesh bounds so glancing slide-ups still register (world tiles). */
export const WALL_RIDE_HITBOX_PAD_TILES = 0.5;

/**
 * Oriented hitbox half-extents as multiples of zone.radius.
 * Matches client mesh bounds in trickFeatureMeshes.ts (ride axis = local +X).
 */
export const TRICK_HITBOX_HALF_ALONG_RIDE: Record<Exclude<TrickFeatureType, 'tunnel'>, number> = {
  rail: 1.15,
  jump: jumpHalfAlongRideFactor(),
  brain_coral: 0.8,
  wall_ride: 0.675,
};

export const TRICK_HITBOX_HALF_LATERAL: Record<Exclude<TrickFeatureType, 'tunnel'>, number> = {
  rail: 0.45,
  jump: JUMP_RAMP_WIDTH / 2,
  brain_coral: 0.8,
  wall_ride: 0.17,
};

export const TRICK_HITBOX_HEIGHT: Record<Exclude<TrickFeatureType, 'tunnel'>, number> = {
  rail: 0.54,
  jump: JUMP_RAMP_PEAK_HEIGHT + JUMP_HITBOX_ABOVE_SURFACE_HEIGHT,
  brain_coral: 0.8,
  wall_ride: 1.09,
};

export const TRICK_HITBOX_CENTER_Y: Record<Exclude<TrickFeatureType, 'tunnel'>, number> = {
  rail: 0.27,
  jump: (JUMP_RAMP_PEAK_HEIGHT + JUMP_HITBOX_ABOVE_SURFACE_HEIGHT) / 2,
  brain_coral: 0.4,
  wall_ride: 0.55,
};

/** AABB of the scaled half-torus after the mesh group’s π/2 yaw (ride = +X). */
export function tunnelTrickHitboxFactors(): {
  halfAlongRide: number;
  halfLateral: number;
  height: number;
  centerY: number;
} {
  const major = TUNNEL_TORUS_MAJOR_RADIUS_FACTOR;
  const tube = TUNNEL_TORUS_TUBE_RADIUS_FACTOR;
  const length = TUNNEL_TORUS_LENGTH_SCALE;
  const baseY = TUNNEL_TORUS_BASE_Y_FACTOR;
  const margin = TUNNEL_HITBOX_MARGIN;
  const archTop = baseY + major + tube;

  return {
    halfAlongRide: tube * length + margin,
    halfLateral: major + tube + margin,
    height: archTop + margin,
    centerY: archTop / 2,
  };
}

export interface TrickHitboxExtents {
  halfAlongRide: number;
  halfLateral: number;
  height: number;
  centerY: number;
}

export function trickZoneHitboxExtents(type: TrickFeatureType, radius: number): TrickHitboxExtents {
  if (type === 'tunnel') {
    const factors = tunnelTrickHitboxFactors();
    return {
      halfAlongRide: radius * factors.halfAlongRide,
      halfLateral: radius * factors.halfLateral,
      height: radius * factors.height,
      centerY: radius * factors.centerY,
    };
  }

  const halfAlongRide = radius * TRICK_HITBOX_HALF_ALONG_RIDE[type];
  const halfLateral = radius * TRICK_HITBOX_HALF_LATERAL[type];

  if (type === 'wall_ride') {
    return {
      halfAlongRide: halfAlongRide + WALL_RIDE_HITBOX_PAD_TILES,
      halfLateral: halfLateral + WALL_RIDE_HITBOX_PAD_TILES,
      height: radius * TRICK_HITBOX_HEIGHT[type],
      centerY: radius * TRICK_HITBOX_CENTER_Y[type],
    };
  }

  return {
    halfAlongRide,
    halfLateral,
    height: radius * TRICK_HITBOX_HEIGHT[type],
    centerY: radius * TRICK_HITBOX_CENTER_Y[type],
  };
}

/** Conservative outer reach for distance-based steering and approach checks. */
export function trickZoneHitboxReach(zone: Pick<TrickZone, 'type' | 'radius'>): number {
  const extents = trickZoneHitboxExtents(zone.type, zone.radius);
  return Math.max(extents.halfAlongRide, extents.halfLateral);
}

export function trickZoneLocalOffset(
  zone: Pick<TrickZone, 'center' | 'rotationRadians'>,
  pos: WorldPos,
): { alongRide: number; lateral: number } {
  const dx = pos.x - zone.center.x;
  const dy = pos.y - zone.center.y;
  const cos = Math.cos(zone.rotationRadians);
  const sin = Math.sin(zone.rotationRadians);
  return {
    alongRide: dx * cos + dy * sin,
    lateral: -dx * sin + dy * cos,
  };
}

export function isPointInTrickZoneHitbox(zone: TrickZone, pos: WorldPos): boolean {
  const { halfAlongRide, halfLateral } = trickZoneHitboxExtents(zone.type, zone.radius);
  const local = trickZoneLocalOffset(zone, pos);
  return Math.abs(local.alongRide) <= halfAlongRide && Math.abs(local.lateral) <= halfLateral;
}

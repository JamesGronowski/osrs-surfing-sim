import { describe, expect, it } from 'vitest';

import {
  createTrickAnimationState,
  featureRideSide,
  signedFeatureRideVector,
  snapToFeatureCenterline,
  tickTrickAnimation,
  TRICK_ANIMATION_ALIGN_PROGRESS,
  TRICK_ANIMATION_TICKS,
  trickAnimationPositionAtProgress,
  trickFeatureRideUnitVector,
  trickFeatureWallNormal,
  toTrickAnimationSnapshot,
} from './trickAnimation.js';
import { createCoralParkSlice } from './maps.js';
import type { TrickZone } from './features.js';

describe('trick animation', () => {
  const arena = createCoralParkSlice();
  const zone: TrickZone = {
    id: 'test-rail',
    type: 'rail',
    prepareSlot: 0,
    center: { x: 30, y: 11 },
    radius: 4,
    rotationRadians: 0,
    tricked: false,
  };
  const start = { x: 28, y: 11 };

  it('travels along the locked feature centreline over two ticks', () => {
    const anim = createTrickAnimationState(arena.map, zone, start, 0);

    expect(anim.start.x).toBeCloseTo(28);
    expect(anim.start.y).toBeCloseTo(11);
    expect(anim.end.x).toBeGreaterThan(zone.center.x);
    expect(anim.end.y).toBeCloseTo(zone.center.y);

    const mid = tickTrickAnimation(anim);
    expect(mid.state?.ticksElapsed).toBe(1);
    expect(mid.position.x).toBeGreaterThan(anim.start.x);
    expect(mid.position.x).toBeLessThan(anim.end.x);

    const end = tickTrickAnimation(mid.state!);
    expect(end.state).toBeNull();
    expect(end.position.x).toBeCloseTo(anim.end.x);
    expect(end.heading).toBe(0);
  });

  it('eases from entry onto the centreline before riding the feature', () => {
    const offAxis = { x: 28, y: 12.8 };
    const anim = createTrickAnimationState(arena.map, zone, offAxis, 0);
    expect(anim.entry.y).toBeCloseTo(12.8);
    expect(anim.start.y).toBeCloseTo(zone.center.y);
    expect(anim.end.y).toBeCloseTo(zone.center.y);

    const midwayAlign = trickAnimationPositionAtProgress(
      anim,
      TRICK_ANIMATION_ALIGN_PROGRESS * 0.5,
    );
    expect(midwayAlign.y).toBeCloseTo(11.9, 0);
    expect(midwayAlign.x).toBeCloseTo(28);

    const atLockedStart = trickAnimationPositionAtProgress(anim, TRICK_ANIMATION_ALIGN_PROGRESS);
    expect(atLockedStart.x).toBeCloseTo(anim.start.x);
    expect(atLockedStart.y).toBeCloseTo(anim.start.y);
  });

  it('uses tunnel ride axis through the arch', () => {
    const tunnelZone: TrickZone = { ...zone, type: 'tunnel', prepareSlot: 1, rotationRadians: 0 };
    const ride = signedFeatureRideVector(tunnelZone, { x: 28, y: 11 }, 0);
    expect(ride.x).toBeCloseTo(1);
    expect(ride.y).toBeCloseTo(0);

    const snapped = snapToFeatureCenterline(tunnelZone, { x: 28, y: 12.4 }, ride);
    expect(snapped.x).toBeCloseTo(28);
    expect(snapped.y).toBeCloseTo(zone.center.y);

    const anim = createTrickAnimationState(arena.map, tunnelZone, { x: 28, y: 11 }, 0);
    expect(anim.end.x).toBeGreaterThan(anim.start.x);
  });

  it('exposes mesh ride axes for rendering', () => {
    const tunnelZone: TrickZone = { ...zone, type: 'tunnel', prepareSlot: 1, rotationRadians: 0 };
    const tunnelRide = trickFeatureRideUnitVector(tunnelZone);
    expect(tunnelRide.x).toBeCloseTo(1);
    expect(tunnelRide.y).toBeCloseTo(0);

    const jumpZone: TrickZone = { ...zone, type: 'jump', prepareSlot: 2, rotationRadians: 0 };
    const jumpRide = trickFeatureRideUnitVector(jumpZone);
    expect(jumpRide.x).toBeCloseTo(1);
    expect(jumpRide.y).toBeCloseTo(0);
  });

  it('rides jumps along the clockwise reef tangent', () => {
    const jumpZone: TrickZone = {
      ...zone,
      type: 'jump',
      prepareSlot: 2,
      rotationRadians: Math.PI / 2,
    };
    const ride = signedFeatureRideVector(jumpZone, { x: 30, y: 13 }, 12);
    expect(ride.x).toBeCloseTo(0);
    expect(ride.y).toBeCloseTo(-1);

    const anim = createTrickAnimationState(arena.map, jumpZone, { x: 30, y: 13 }, 12);
    expect(anim.end.y).toBeLessThan(anim.start.y);
  });

  it('rides jumps from either end of the feature axis', () => {
    const jumpZone: TrickZone = { ...zone, type: 'jump', prepareSlot: 2, rotationRadians: 0 };
    const fromWest = createTrickAnimationState(arena.map, jumpZone, { x: 28, y: 11 }, 0);
    const fromEast = createTrickAnimationState(arena.map, jumpZone, { x: 32, y: 11 }, 8);

    expect(fromWest.end.x).toBeGreaterThan(fromWest.start.x);
    expect(fromEast.end.x).toBeLessThan(fromEast.start.x);
  });

  it('follows rider heading when picking ride direction past feature centre', () => {
    const wallZone: TrickZone = {
      ...zone,
      type: 'wall_ride',
      prepareSlot: 1,
      rotationRadians: 0,
    };
    const pastCentre = { x: 32, y: 11 };
    const ride = signedFeatureRideVector(wallZone, pastCentre, 0);
    expect(ride.x).toBeCloseTo(1);
    expect(ride.y).toBeCloseTo(0);

    const anim = createTrickAnimationState(arena.map, wallZone, pastCentre, 0);
    expect(anim.end.x).toBeGreaterThan(anim.start.x);
  });

  it('offsets wall rides toward the mesh wall face from either approach side', () => {
    const wallZone: TrickZone = {
      ...zone,
      type: 'wall_ride',
      prepareSlot: 1,
      rotationRadians: 0,
    };
    const wallNormal = trickFeatureWallNormal(0);
    expect(wallNormal.y).toBeLessThan(0);

    const fromSouth = createTrickAnimationState(arena.map, wallZone, { x: 28, y: 12.5 }, 0);
    const fromNorth = createTrickAnimationState(arena.map, wallZone, { x: 28, y: 9.5 }, 0);
    expect(fromSouth.rideSide).not.toBe(fromNorth.rideSide);
    expect(fromSouth.end.x).toBeGreaterThan(fromSouth.start.x);
    expect(fromNorth.end.x).toBeGreaterThan(fromNorth.start.x);
  });

  it('records ride side and zone orientation for client pose offsets', () => {
    const wallZone: TrickZone = {
      ...zone,
      type: 'wall_ride',
      prepareSlot: 1,
      rotationRadians: 0,
    };
    const ride = signedFeatureRideVector(wallZone, { x: 28, y: 11 }, 0);
    const fromNorth = featureRideSide(wallZone, { x: 30, y: 9.5 }, ride);
    const fromSouth = featureRideSide(wallZone, { x: 30, y: 12.5 }, ride);
    expect(fromNorth).not.toBe(fromSouth);

    const anim = createTrickAnimationState(arena.map, wallZone, { x: 28, y: 9.5 }, 0);
    const snapshot = toTrickAnimationSnapshot(anim);
    expect(snapshot?.rideSide).toBe(fromNorth);
    expect(snapshot?.rotationRadians).toBe(0);
    expect(snapshot?.zoneCenter).toEqual(wallZone.center);
  });

  it('completes in exactly two ticks', () => {
    let anim = createTrickAnimationState(arena.map, zone, start, 0);
    expect(anim.ticksTotal).toBe(TRICK_ANIMATION_TICKS);

    const first = tickTrickAnimation(anim);
    anim = first.state!;
    expect(anim).not.toBeNull();

    const second = tickTrickAnimation(anim);
    expect(second.state).toBeNull();
  });
});

import {
  headingToDegrees,
  snapAngleToHeading,
  TRICK_ANIMATION_ALIGN_PROGRESS,
} from '@osrs-surfing/engine';

import type { DisplayTrickAnimation } from '../visualSnapshot.js';

/**
 * Visual offsets in engine tile space (x = east, y = south).
 * Angles are in the board's local frame: pitch is nose-up positive, roll banks
 * about the length axis, riderLean is the rider's forward pitch.
 */
export interface TrickBoardPose {
  liftY: number;
  pitch: number;
  roll: number;
  yawOffset: number;
  /** Exact tile-plane travel yaw during the trick; null falls back to entity heading. */
  travelYawRadians: number | null;
  offsetX: number;
  offsetY: number;
  /** Rider pitch relative to the deck — the rider inherits board attitude from the rig. */
  riderLean: number;
  /** 0–1 squash of the rider for ducking/tucking poses. */
  riderCrouch: number;
}

type TrickPoseOffsets = Omit<TrickBoardPose, 'travelYawRadians'>;

/** Share of the timeline spent easing into/out of the boardslide on rails. */
const RAIL_SLIDE_RAMP = 0.25;
/** Final share of the timeline spent settling onto the snapped exit heading. */
const EXIT_BLEND_START = 0.85;

/** Ramp shape factors mirroring buildJumpRamp in trickFeatureMeshes.ts. */
const JUMP_PEAK_FACTOR = 0.55;
/** Ramp face height where the locked path enters the ramp footprint. */
const JUMP_START_HEIGHT_SHARE = 0.24;
/** Take-off happens at the ramp peak, halfway along the locked path. */
const JUMP_TAKE_OFF_PROGRESS = 0.5;
/** Nose-up angle riding the ramp face. */
const JUMP_CLIMB_PITCH = 0.45;
/** Extra height of the airborne arc above the take-off point. */
const JUMP_AIR_ARC_FACTOR = 0.3;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function easeInOutSine(t: number): number {
  const x = clamp01(t);
  return 0.5 - 0.5 * Math.cos(Math.PI * x);
}

function yawOfDelta(dx: number, dy: number): number | null {
  if (Math.hypot(dx, dy) < 1e-6) {
    return null;
  }
  return Math.atan2(dy, dx);
}

function lerpAngle(from: number, to: number, t: number): number {
  const tau = Math.PI * 2;
  let delta = (to - from) % tau;
  if (delta > Math.PI) {
    delta -= tau;
  }
  if (delta < -Math.PI) {
    delta += tau;
  }
  return from + delta * clamp01(t);
}

function rideYawRadians(animation: DisplayTrickAnimation): number | null {
  return (
    yawOfDelta(animation.end.x - animation.start.x, animation.end.y - animation.start.y) ??
    yawOfDelta(animation.start.x - animation.entry.x, animation.start.y - animation.entry.y)
  );
}

/**
 * Board yaw through the trick: ease from the entry direction onto the exact
 * ride line, hold it, then settle onto the snapped 16-way exit heading.
 */
function trickTravelYaw(animation: DisplayTrickAnimation, progress: number): number | null {
  const rideYaw = rideYawRadians(animation);
  if (rideYaw === null) {
    return null;
  }
  const entryYaw =
    yawOfDelta(animation.start.x - animation.entry.x, animation.start.y - animation.entry.y) ??
    rideYaw;

  if (progress <= TRICK_ANIMATION_ALIGN_PROGRESS) {
    return lerpAngle(entryYaw, rideYaw, easeInOutSine(progress / TRICK_ANIMATION_ALIGN_PROGRESS));
  }
  if (progress >= EXIT_BLEND_START) {
    const exitYaw = (headingToDegrees(snapAngleToHeading(rideYaw)) * Math.PI) / 180;
    return lerpAngle(rideYaw, exitYaw, (progress - EXIT_BLEND_START) / (1 - EXIT_BLEND_START));
  }
  return rideYaw;
}

function railPose(animation: DisplayTrickAnimation, progress: number): TrickPoseOffsets {
  const radius = animation.zoneRadius;
  const grind = Math.sin(progress * Math.PI);
  const slide =
    easeInOutSine(progress / RAIL_SLIDE_RAMP) * easeInOutSine((1 - progress) / RAIL_SLIDE_RAMP);

  return {
    liftY: radius * 0.26 + grind * radius * 0.05,
    pitch: 0,
    roll: animation.rideSide * slide * 0.12,
    yawOffset: animation.rideSide * slide * (Math.PI / 2),
    offsetX: 0,
    offsetY: 0,
    riderLean: -slide * 0.1,
    riderCrouch: slide * 0.2,
  };
}

function brainCoralPose(animation: DisplayTrickAnimation, progress: number): TrickPoseOffsets {
  const radius = animation.zoneRadius;
  const sphereTop = radius * 0.9;
  let lift = 0;

  if (progress < 0.26) {
    const t = progress / 0.26;
    lift = easeInOutSine(t) * radius * 0.58;
  } else if (progress < 0.5) {
    const t = (progress - 0.26) / 0.24;
    lift = radius * 0.58 + easeInOutSine(t) * (sphereTop - radius * 0.58);
  } else {
    const t = (progress - 0.5) / 0.5;
    lift = sphereTop - easeInOutSine(t) * (sphereTop - radius * 0.1);
  }

  // Nose up while climbing the dome, level on top, nose down rolling off.
  const climb = 0.3 * Math.cos(progress * Math.PI);

  return {
    liftY: lift,
    pitch: climb,
    roll: 0,
    yawOffset: 0,
    offsetX: 0,
    offsetY: 0,
    riderLean: climb * 0.15,
    riderCrouch: 0,
  };
}

function tunnelPose(animation: DisplayTrickAnimation, progress: number): TrickPoseOffsets {
  void animation;
  const duck = Math.sin(progress * Math.PI);

  return {
    liftY: 0,
    pitch: 0,
    roll: 0,
    yawOffset: 0,
    offsetX: 0,
    offsetY: 0,
    riderLean: -duck * 0.35,
    riderCrouch: duck * 0.45,
  };
}

function wallRidePose(animation: DisplayTrickAnimation, progress: number): TrickPoseOffsets {
  const radius = animation.zoneRadius;
  const lateral = radius * 0.34;
  const arc = Math.sin(progress * Math.PI);
  const rideYaw = rideYawRadians(animation) ?? animation.rotationRadians;
  // Stay on the side the rider approached from; the wall sits on the centreline.
  const normal = { x: -Math.sin(rideYaw), y: Math.cos(rideYaw) };
  const side = animation.rideSide;

  return {
    liftY: radius * 0.14 + arc * radius * 0.42,
    pitch: 0,
    // Bank so the wall-side rail rises against the face.
    roll: side * (0.38 + arc * 0.12),
    yawOffset: 0,
    offsetX: normal.x * side * lateral * arc,
    offsetY: normal.y * side * lateral * arc,
    riderLean: -arc * 0.12,
    riderCrouch: arc * 0.15,
  };
}

function jumpPose(animation: DisplayTrickAnimation, progress: number): TrickPoseOffsets {
  const radius = animation.zoneRadius;
  const peak = radius * JUMP_PEAK_FACTOR;
  const startHeight = peak * JUMP_START_HEIGHT_SHARE;
  const align = TRICK_ANIMATION_ALIGN_PROGRESS;

  let lift: number;
  let pitch: number;
  let crouch = 0;
  if (progress < align) {
    // Carve from open water onto the lower ramp face.
    const t = progress / align;
    lift = easeInOutSine(t) * startHeight;
    pitch = JUMP_CLIMB_PITCH * easeInOutSine(t);
  } else if (progress < JUMP_TAKE_OFF_PROGRESS) {
    // Ride the face up to the peak.
    const t = (progress - align) / (JUMP_TAKE_OFF_PROGRESS - align);
    lift = startHeight + easeInOutSine(t) * (peak - startHeight);
    pitch = JUMP_CLIMB_PITCH;
  } else {
    // Airborne: pop above the lip, front flip, land level on the water.
    const t = (progress - JUMP_TAKE_OFF_PROGRESS) / (1 - JUMP_TAKE_OFF_PROGRESS);
    lift = peak * (1 - easeInOutSine(t)) + radius * JUMP_AIR_ARC_FACTOR * Math.sin(Math.PI * t);
    const flip = easeInOutSine(t / 0.92);
    pitch = JUMP_CLIMB_PITCH - flip * (Math.PI * 2 + JUMP_CLIMB_PITCH);
    // Tuck mid-flip, stretch back out for the landing.
    crouch = Math.sin(Math.PI * t) * 0.5;
  }

  return {
    liftY: lift,
    pitch,
    roll: 0,
    yawOffset: 0,
    offsetX: 0,
    offsetY: 0,
    riderLean: 0,
    riderCrouch: crouch,
  };
}

export function tideSpinBoardPose(progress: number): TrickBoardPose {
  const spin = clamp01(progress) * Math.PI * 2;
  return {
    liftY: 0.06 + Math.sin(progress * Math.PI) * 0.1,
    pitch: Math.sin(spin) * 0.06,
    roll: Math.sin(spin) * 0.35,
    yawOffset: spin * 0.12,
    travelYawRadians: null,
    offsetX: 0,
    offsetY: 0,
    riderLean: Math.cos(spin) * 0.12,
    riderCrouch: 0.2,
  };
}

export function trickBoardPose(animation: DisplayTrickAnimation): TrickBoardPose {
  const progress = clamp01(animation.progress);

  const offsets = ((): TrickPoseOffsets => {
    switch (animation.type) {
      case 'rail':
        return railPose(animation, progress);
      case 'brain_coral':
        return brainCoralPose(animation, progress);
      case 'tunnel':
        return tunnelPose(animation, progress);
      case 'wall_ride':
        return wallRidePose(animation, progress);
      case 'jump':
        return jumpPose(animation, progress);
      default:
        return {
          liftY: 0,
          pitch: 0,
          roll: 0,
          yawOffset: 0,
          offsetX: 0,
          offsetY: 0,
          riderLean: 0,
          riderCrouch: 0,
        };
    }
  })();

  return { ...offsets, travelYawRadians: trickTravelYaw(animation, progress) };
}

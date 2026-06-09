import { trickFeatureWallNormal } from '@osrs-surfing/engine';

import type { DisplayTrickAnimation } from '../visualSnapshot.js';

/** Visual offsets in engine tile space (x = east, y = south). */
export interface TrickBoardPose {
  liftY: number;
  pitch: number;
  roll: number;
  yawOffset: number;
  offsetX: number;
  offsetY: number;
  riderLean: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function easeInOutSine(t: number): number {
  const x = clamp01(t);
  return 0.5 - 0.5 * Math.cos(Math.PI * x);
}

function railPose(animation: DisplayTrickAnimation, progress: number): TrickBoardPose {
  const radius = animation.zoneRadius;
  const grind = Math.sin(progress * Math.PI);

  return {
    liftY: radius * 0.26 + grind * radius * 0.05,
    pitch: grind * 0.1,
    roll: animation.rideSide * (0.14 + grind * 0.06),
    yawOffset: Math.PI / 2,
    offsetX: 0,
    offsetY: 0,
    riderLean: animation.rideSide * grind * 0.12,
  };
}

function brainCoralPose(animation: DisplayTrickAnimation, progress: number): TrickBoardPose {
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

  const bounce =
    progress < 0.5
      ? -0.3 * Math.sin(progress * Math.PI * 3.2)
      : 0.12 * Math.sin((progress - 0.5) * Math.PI);

  return {
    liftY: lift,
    pitch: bounce,
    roll: 0,
    yawOffset: 0,
    offsetX: 0,
    offsetY: 0,
    riderLean: bounce * 0.35,
  };
}

function tunnelPose(animation: DisplayTrickAnimation, progress: number): TrickBoardPose {
  const radius = animation.zoneRadius;
  const duck = Math.sin(progress * Math.PI);

  return {
    liftY: -duck * radius * 0.1,
    pitch: duck * 0.22,
    roll: 0,
    yawOffset: 0,
    offsetX: 0,
    offsetY: 0,
    riderLean: duck * 0.08,
  };
}

function wallRidePose(animation: DisplayTrickAnimation, progress: number): TrickBoardPose {
  const radius = animation.zoneRadius;
  const wallNormal = trickFeatureWallNormal(animation.rotationRadians);
  const lateral = radius * 0.34;
  const arc = Math.sin(progress * Math.PI);

  return {
    liftY: radius * 0.14 + arc * radius * 0.42,
    pitch: arc * 0.2 * animation.rideSide,
    roll: -animation.rideSide * (0.38 + arc * 0.12),
    yawOffset: 0,
    offsetX: wallNormal.x * lateral,
    offsetY: wallNormal.y * lateral,
    riderLean: -animation.rideSide * arc * 0.18,
  };
}

function jumpTravelsWithZoneAxis(animation: DisplayTrickAnimation): boolean {
  const dx = animation.end.x - animation.start.x;
  const dy = animation.end.y - animation.start.y;
  const rideLength = Math.hypot(dx, dy);
  if (rideLength < 1e-6) {
    return true;
  }
  const axisX = Math.cos(animation.rotationRadians);
  const axisY = Math.sin(animation.rotationRadians);
  return (dx * axisX + dy * axisY) / rideLength >= 0;
}

function jumpPose(animation: DisplayTrickAnimation, progress: number): TrickBoardPose {
  const direction = jumpTravelsWithZoneAxis(animation) ? 1 : -1;
  const radius = animation.zoneRadius;
  const arc = Math.sin(progress * Math.PI);
  const flip = progress * Math.PI * 1.1;

  return {
    liftY: arc * radius * 0.62,
    pitch: direction * (-arc * 0.4 - flip * 0.65),
    roll: direction * Math.sin(progress * Math.PI * 2.2) * 0.48,
    yawOffset: 0,
    offsetX: 0,
    offsetY: 0,
    riderLean: direction * Math.sin(progress * Math.PI * 2) * 0.15,
  };
}

export function tideSpinBoardPose(progress: number): TrickBoardPose {
  const spin = clamp01(progress) * Math.PI * 2;
  return {
    liftY: 0.06 + Math.sin(progress * Math.PI) * 0.1,
    pitch: Math.sin(spin) * 0.06,
    roll: Math.sin(spin) * 0.35,
    yawOffset: spin * 0.12,
    offsetX: 0,
    offsetY: 0,
    riderLean: Math.cos(spin) * 0.18,
  };
}

export function trickBoardPose(animation: DisplayTrickAnimation): TrickBoardPose {
  const progress = clamp01(animation.progress);

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
      };
  }
}

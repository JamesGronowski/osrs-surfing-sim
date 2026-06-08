import { headingToDegrees } from '@osrs-surfing/engine';
import type { Vector3 } from 'three';

/** Engine tile X → Three.js world X (east). */
export function tileToWorldX(tileX: number): number {
  return tileX;
}

/** Engine tile Y → Three.js world Z (south). */
export function tileToWorldZ(tileY: number): number {
  return tileY;
}

export function tileToWorld3(
  tileX: number,
  tileY: number,
  heightY = 0,
): { x: number; y: number; z: number } {
  return { x: tileToWorldX(tileX), y: heightY, z: tileToWorldZ(tileY) };
}

export function world3ToTile(point: Vector3): { x: number; y: number } {
  return { x: point.x, y: point.z };
}

/** Engine heading (clockwise from east) → Three.js Y rotation (radians). */
export function headingToRotationY(heading: number): number {
  const degrees = headingToDegrees(heading);
  return (-degrees * Math.PI) / 180;
}

/** Engine/trick rotation (clockwise from east in tile plane) → Three.js Y rotation. */
export function radiansToRotationY(radians: number): number {
  return -radians;
}

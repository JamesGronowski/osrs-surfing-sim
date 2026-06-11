import {
  TIDE_LEADING_WASH_HEIGHT,
  TIDE_WATER_RISE_Y,
  normalizeAngle,
  tideVisualDepthAtAngle,
  tideWaveSurfaceAtProgress,
  type TideState,
} from '@osrs-surfing/engine';
import { BoxGeometry, Group, InstancedMesh, Matrix4, MeshStandardMaterial } from 'three';

import { tileToWorld3 } from './worldCoords.js';

const TAU = Math.PI * 2;
const MATRIX = new Matrix4();
const EDGE_ARC_STEPS = 28;
const EDGE_INSET = 0.08;
const WASH_ARC_STEPS = 52;
const WASH_ARC_SPREAD = 0.38;
const WASH_RADIAL_SAMPLES = 8;
const WASH_BODY_ROWS = 4;

function radiusAtAngle(tide: TideState, angle: number, outer: boolean): number {
  if (outer) {
    return tide.outerRadiusAtAngle?.(angle) ?? tide.outerRadius;
  }
  return tide.innerRadiusAtAngle?.(angle) ?? tide.innerRadius;
}

function reefRadiusAtAngle(tide: TideState, angle: number, radialT: number): number {
  const inner = radiusAtAngle(tide, angle, false);
  const outer = radiusAtAngle(tide, angle, true);
  return inner + (outer - inner) * radialT;
}

function edgeDepth(tide: TideState, edgeAngle: number, isLeading: boolean): number {
  const probe = isLeading ? normalizeAngle(edgeAngle + 0.04) : normalizeAngle(edgeAngle - 0.04);
  return tideVisualDepthAtAngle(probe, tide);
}

export class TideEdgeLayer {
  readonly root = new Group();
  private leading: InstancedMesh | null = null;
  private trailing: InstancedMesh | null = null;
  private washBody: InstancedMesh | null = null;
  private washCrest: InstancedMesh | null = null;
  private capacity = 0;
  private washCapacity = 0;

  constructor() {
    const foamMaterial = new MeshStandardMaterial({
      color: 0xe8f8ff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.3,
      metalness: 0.05,
    });
    const washMaterial = new MeshStandardMaterial({
      color: 0x8ec8e0,
      transparent: true,
      opacity: 0.45,
      roughness: 0.5,
      metalness: 0.05,
    });
    const breakerMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.94,
      roughness: 0.14,
      metalness: 0.02,
      emissive: 0xd0eaff,
      emissiveIntensity: 0.24,
    });
    const crestMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.82,
      roughness: 0.1,
      metalness: 0.04,
      emissive: 0xffffff,
      emissiveIntensity: 0.14,
    });

    this.capacity = EDGE_ARC_STEPS * 4;
    const edgeHeight = Math.max(0.35, TIDE_WATER_RISE_Y * 0.08);
    this.leading = new InstancedMesh(
      new BoxGeometry(1, edgeHeight, 0.08),
      foamMaterial,
      this.capacity,
    );
    this.trailing = new InstancedMesh(
      new BoxGeometry(1, edgeHeight, 0.08),
      washMaterial,
      this.capacity,
    );

    this.washCapacity = WASH_ARC_STEPS * WASH_RADIAL_SAMPLES * WASH_BODY_ROWS * 2;
    this.washBody = new InstancedMesh(new BoxGeometry(1, 1, 1), breakerMaterial, this.washCapacity);
    this.washCrest = new InstancedMesh(new BoxGeometry(1, 1, 1), crestMaterial, this.washCapacity);

    for (const mesh of [this.leading, this.trailing, this.washBody, this.washCrest]) {
      mesh.visible = false;
      // Instances follow the tide around the island; the bounding sphere three.js
      // computes on first render goes stale and culls them once the camera turns.
      mesh.frustumCulled = false;
    }
    this.root.add(this.leading, this.trailing, this.washBody, this.washCrest);
  }

  sync(tide: TideState | null): void {
    if (!tide || !this.leading || !this.trailing || !this.washBody || !this.washCrest) {
      for (const mesh of [this.leading, this.trailing, this.washBody, this.washCrest]) {
        if (mesh) {
          mesh.visible = false;
        }
      }
      return;
    }

    const center = tileToWorld3(tide.centerX, tide.centerY);
    const edgeHeight = Math.max(0.35, TIDE_WATER_RISE_Y * 0.08);
    const edges: Array<{ angle: number; leading: boolean }> = [
      { angle: tide.phaseRadians, leading: true },
      { angle: normalizeAngle(tide.phaseRadians + tide.sweepRadians), leading: false },
    ];

    let leadingCount = 0;
    let trailingCount = 0;

    for (const edge of edges) {
      const depth = edgeDepth(tide, edge.angle, edge.leading);
      const spread = edge.leading ? 0.18 : 0.14;
      const mesh = edge.leading ? this.leading : this.trailing;
      let count = edge.leading ? leadingCount : trailingCount;

      for (const outer of [false, true]) {
        const baseRadius = radiusAtAngle(tide, edge.angle, outer);
        for (let i = 0; i <= EDGE_ARC_STEPS; i += 1) {
          if (count >= this.capacity) {
            break;
          }
          const t = edge.angle + spread * (i / EDGE_ARC_STEPS - 0.5);
          const radius = baseRadius + (outer ? EDGE_INSET : -EDGE_INSET);
          const x = center.x + Math.cos(t) * radius;
          const z = center.z + Math.sin(t) * radius;
          const waterY = tideWaveSurfaceAtProgress(edge.leading ? 0.04 : 0.96);
          const scale = edge.leading ? 0.75 + depth * 0.9 : 0.45 + depth * 0.55;

          if (scale < 0.05) {
            MATRIX.makeScale(0, 0, 0);
          } else {
            MATRIX.makeScale(scale, edgeHeight * (0.8 + depth * 1.1), scale * 0.65);
          }
          MATRIX.setPosition(x, waterY + edgeHeight * 0.45, z);
          mesh.setMatrixAt(count, MATRIX);
          count += 1;
        }
      }

      if (edge.leading) {
        leadingCount = count;
      } else {
        trailingCount = count;
      }
    }

    this.leading.count = leadingCount;
    this.leading.instanceMatrix.needsUpdate = true;
    this.leading.visible = leadingCount > 0;

    this.trailing.count = trailingCount;
    this.trailing.instanceMatrix.needsUpdate = true;
    this.trailing.visible = trailingCount > 0;

    this.syncCurlingWash(tide, center);
  }

  /** Trailing-edge curl — rolls back over the submerged high-tide body. */
  private syncCurlingWash(tide: TideState, center: { x: number; y: number; z: number }): void {
    if (!this.washBody || !this.washCrest) {
      return;
    }

    const curlAngle = normalizeAngle(tide.phaseRadians + tide.sweepRadians);
    const washHeight = TIDE_LEADING_WASH_HEIGHT;
    let bodyCount = 0;
    let crestCount = 0;

    for (let row = 0; row < WASH_BODY_ROWS; row += 1) {
      const rowIntoBand = row / WASH_BODY_ROWS;
      const arcCenter = normalizeAngle(curlAngle - rowIntoBand * 0.06);
      const rowHeightScale = 1 - rowIntoBand * 0.22;

      for (let i = 0; i <= WASH_ARC_STEPS; i += 1) {
        const arcT = arcCenter + WASH_ARC_SPREAD * (i / WASH_ARC_STEPS - 0.5);
        const arcBlend = 1 - Math.abs(i / WASH_ARC_STEPS - 0.5) * 1.15;

        for (let r = 0; r < WASH_RADIAL_SAMPLES; r += 1) {
          if (bodyCount >= this.washCapacity || crestCount >= this.washCapacity) {
            break;
          }

          const radialT = (r + 0.5) / WASH_RADIAL_SAMPLES;
          const radius = reefRadiusAtAngle(tide, arcT, radialT);
          const x = center.x + Math.cos(arcT) * radius;
          const z = center.z + Math.sin(arcT) * radius;
          const columnHeight = washHeight * rowHeightScale * (0.9 + (r % 3) * 0.05) * arcBlend;
          const width = 1.55 + radialT * 1.05 - rowIntoBand * 0.2;
          const depth = 0.72 + radialT * 0.38;

          MATRIX.makeScale(width, columnHeight, depth);
          MATRIX.setPosition(x, columnHeight * 0.5, z);
          this.washBody.setMatrixAt(bodyCount, MATRIX);
          bodyCount += 1;

          const crestHeight = columnHeight * 0.32;
          const crestLift = columnHeight * 0.92;
          const curlBack = rowIntoBand * 0.35 + radialT * 0.12;
          const crestX = center.x + Math.cos(arcT - curlBack) * (radius - 0.15);
          const crestZ = center.z + Math.sin(arcT - curlBack) * (radius - 0.15);

          MATRIX.makeScale(width * 1.6, crestHeight, depth * 1.4);
          MATRIX.setPosition(crestX, crestLift + crestHeight * 0.42, crestZ);
          this.washCrest.setMatrixAt(crestCount, MATRIX);
          crestCount += 1;
        }
      }
    }

    this.washBody.count = bodyCount;
    this.washBody.instanceMatrix.needsUpdate = true;
    this.washBody.visible = bodyCount > 0;

    this.washCrest.count = crestCount;
    this.washCrest.instanceMatrix.needsUpdate = true;
    this.washCrest.visible = crestCount > 0;
  }

  dispose(): void {
    for (const mesh of [this.leading, this.trailing, this.washBody, this.washCrest]) {
      if (!mesh) {
        continue;
      }
      mesh.geometry.dispose();
      (mesh.material as MeshStandardMaterial).dispose();
      mesh.removeFromParent();
    }
    this.leading = null;
    this.trailing = null;
    this.washBody = null;
    this.washCrest = null;
    void TAU;
  }
}

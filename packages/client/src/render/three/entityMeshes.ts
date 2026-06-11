import {
  coralParkLandSurfaceY,
  getTile,
  headingToDegrees,
  tideRideSurfaceY,
  type TideState,
  type WorldMap,
} from '@osrs-surfing/engine';
import {
  BoxGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Shape,
} from 'three';

import type { DisplaySimulationSnapshot, DisplayTrickAnimation } from '../visualSnapshot.js';
import { tideSpinBoardPose, trickBoardPose } from './trickAnimationPose.js';
import { headingToRotationY, radiansToRotationY, tileToWorld3 } from './worldCoords.js';

const PLAYER_SKIN = 0xc8945e;
const PLAYER_SHIRT = 0x3a6ea5;
const PLAYER_HAIR = 0x4a2c12;
const PLAYER_PANTS = 0x5a4a36;
const BOARD_WOOD = 0xc9a066;
const BOARD_STRIPE = 0xf4c542;
const NPC_SHIRT = 0xa8442c;
const NPC_HAIR = 0x5c3a1e;
const WAKE_PINK = 0xf4a7b9;
const WAKE_WHITE = 0xffffff;

interface DemoSurferStyle {
  shirt: number;
  hair: number;
  boardWood: number;
  boardStripe: number;
}

/** Distinct outfits per demo surfer, assigned by snapshot order. */
const DEMO_SURFER_STYLES: DemoSurferStyle[] = [
  { shirt: 0x2d8a6e, hair: 0x2a1810, boardWood: 0xb8884a, boardStripe: 0xe8d44a },
  { shirt: 0x8a2d4e, hair: 0x1c120c, boardWood: 0xc9a066, boardStripe: 0x66c2e8 },
  { shirt: 0x6a5fb5, hair: 0x3a2a18, boardWood: 0x9a7a4a, boardStripe: 0xf4a7b9 },
  { shirt: 0xc2a23c, hair: 0x241a10, boardWood: 0xb8884a, boardStripe: 0x8fe07a },
  { shirt: 0xe05038, hair: 0x14100c, boardWood: 0xf2ead8, boardStripe: 0xe04848 },
];

/** Deck surface height within the rig — rider feet rest here. */
const DECK_TOP_Y = 0.05;
/** Full rider squash at crouch 1; keeps the blocky OSRS look while ducking. */
const RIDER_CROUCH_SQUASH = 0.35;

interface BoardRiderPose {
  worldX: number;
  worldZ: number;
  boardY: number;
  rotationY: number;
  pitch: number;
  roll: number;
  riderLean: number;
  riderCrouch: number;
}

function boardRiderPose(
  tileX: number,
  tileY: number,
  heading: number,
  animation: DisplayTrickAnimation | null,
  tide: TideState | null,
  tideSpinProgress: number | null = null,
): BoardRiderPose {
  const pose = animation
    ? trickBoardPose(animation)
    : tideSpinProgress !== null
      ? tideSpinBoardPose(tideSpinProgress)
      : null;
  const world = tileToWorld3(tileX + (pose?.offsetX ?? 0), tileY + (pose?.offsetY ?? 0));
  const surfaceY = tideRideSurfaceY(tileX, tileY, tide);
  const yawBase =
    pose !== null && pose.travelYawRadians !== null
      ? radiansToRotationY(pose.travelYawRadians)
      : headingToRotationY(heading);
  return {
    worldX: world.x,
    worldZ: world.z,
    boardY: surfaceY + (pose?.liftY ?? 0),
    rotationY: yawBase + (pose?.yawOffset ?? 0),
    pitch: pose?.pitch ?? 0,
    roll: pose?.roll ?? 0,
    riderLean: pose?.riderLean ?? 0,
    riderCrouch: pose?.riderCrouch ?? 0,
  };
}

/**
 * Board-and-rider hierarchy: the rig carries world position and yaw, the tilt
 * group carries board pitch/roll, and the rider anchor sits on the deck so the
 * rider inherits the full board attitude instead of being transformed apart
 * from it (which made the deck rotate through the rider's body).
 */
interface SurferRig {
  rig: Group;
  tilt: Group;
  riderAnchor: Group;
  wake: Group;
}

function makeSurferRig(woodColor: number, stripeColor: number, wake: Group): SurferRig {
  const rig = new Group();
  const tilt = new Group();
  // Meshes face +X; rig y = yaw, tilt x = bank about the length axis,
  // tilt z = nose pitch (up positive) — matches the previous 'YXZ' transform.
  tilt.rotation.order = 'YXZ';
  const riderAnchor = new Group();
  riderAnchor.position.y = DECK_TOP_Y;
  tilt.add(makeSurfboardMesh(woodColor, stripeColor), riderAnchor);
  rig.add(tilt);
  return { rig, tilt, riderAnchor, wake };
}

function applySurferPose(parts: SurferRig, rider: Group, pose: BoardRiderPose): void {
  parts.rig.position.set(pose.worldX, pose.boardY, pose.worldZ);
  parts.rig.rotation.y = pose.rotationY;
  parts.tilt.rotation.set(pose.roll, 0, pose.pitch);
  rider.position.set(0, 0, 0);
  rider.rotation.set(0, 0, pose.riderLean);
  rider.scale.y = 1 - pose.riderCrouch * RIDER_CROUCH_SQUASH;
}

function flatMaterial(color: number, roughness = 0.9): MeshStandardMaterial {
  return new MeshStandardMaterial({ color, roughness, flatShading: true });
}

function boxMesh(
  width: number,
  height: number,
  depth: number,
  color: number,
  x: number,
  y: number,
  z: number,
): Mesh {
  const mesh = new Mesh(new BoxGeometry(width, height, depth), flatMaterial(color));
  mesh.position.set(x, y, z);
  return mesh;
}

interface HumanoidColors {
  shirt: number;
  pants: number;
  hair: number | null;
}

/** Low-poly flat-shaded humanoid in the blocky OSRS proportions, facing +X. */
function makeHumanoidMesh(colors: HumanoidColors, scale = 1): Group {
  const group = new Group();
  group.add(
    boxMesh(0.09, 0.18, 0.08, colors.pants, 0, 0.09, -0.055),
    boxMesh(0.09, 0.18, 0.08, colors.pants, 0, 0.09, 0.055),
    boxMesh(0.13, 0.24, 0.22, colors.shirt, 0, 0.3, 0),
    boxMesh(0.08, 0.2, 0.07, colors.shirt, 0, 0.32, -0.145),
    boxMesh(0.08, 0.2, 0.07, colors.shirt, 0, 0.32, 0.145),
    boxMesh(0.06, 0.05, 0.06, PLAYER_SKIN, 0, 0.195, -0.145),
    boxMesh(0.06, 0.05, 0.06, PLAYER_SKIN, 0, 0.195, 0.145),
    boxMesh(0.12, 0.13, 0.12, PLAYER_SKIN, 0, 0.485, 0),
  );
  if (colors.hair !== null) {
    group.add(boxMesh(0.13, 0.05, 0.13, colors.hair, -0.005, 0.565, 0));
  }
  group.scale.setScalar(scale);
  return group;
}

/** Low-poly board outline: rounded tail, pointed nose, nose along +X. */
function surfboardDeckGeometry(): ExtrudeGeometry {
  const outline = new Shape();
  outline.moveTo(-0.62, -0.13);
  outline.lineTo(-0.3, -0.22);
  outline.lineTo(0.22, -0.2);
  outline.lineTo(0.58, -0.08);
  outline.lineTo(0.68, 0);
  outline.lineTo(0.58, 0.08);
  outline.lineTo(0.22, 0.2);
  outline.lineTo(-0.3, 0.22);
  outline.lineTo(-0.62, 0.13);
  outline.closePath();

  const geometry = new ExtrudeGeometry(outline, { depth: 0.07, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -0.035, 0);
  return geometry;
}

function makeSurfboardMesh(woodColor = BOARD_WOOD, stripeColor = BOARD_STRIPE): Group {
  const group = new Group();
  const deck = new Mesh(surfboardDeckGeometry(), flatMaterial(woodColor, 0.8));
  const stripe = boxMesh(0.95, 0.02, 0.09, stripeColor, 0, 0.04, 0);
  const fin = boxMesh(0.1, 0.12, 0.03, woodColor, -0.48, -0.08, 0);
  group.add(deck, stripe, fin);
  return group;
}

function makePlayerMesh(): Group {
  return makeHumanoidMesh({ shirt: PLAYER_SHIRT, pants: PLAYER_PANTS, hair: PLAYER_HAIR });
}

function makeWakeMesh(outerOpacity: number, innerOpacity: number): Group {
  const wake = new Group();
  const outer = new Mesh(
    new CylinderGeometry(0.5, 0.5, 0.02, 16),
    new MeshStandardMaterial({ color: WAKE_PINK, transparent: true, opacity: outerOpacity }),
  );
  outer.scale.set(1.9, 1, 0.8);
  const inner = new Mesh(
    new CylinderGeometry(0.42, 0.42, 0.02, 16),
    new MeshStandardMaterial({ color: WAKE_WHITE, transparent: true, opacity: innerOpacity }),
  );
  inner.scale.set(1.6, 1, 0.65);
  wake.add(outer, inner);
  wake.visible = false;
  return wake;
}

interface DemoSurferVisual {
  parts: SurferRig;
  rider: Group;
}

function makeDemoSurferVisual(style: DemoSurferStyle): DemoSurferVisual {
  const parts = makeSurferRig(style.boardWood, style.boardStripe, makeWakeMesh(0.32, 0.28));
  const rider = makeHumanoidMesh({ shirt: style.shirt, pants: PLAYER_PANTS, hair: style.hair });
  parts.riderAnchor.add(rider);
  parts.rig.visible = false;
  return { parts, rider };
}

function makeNpcMesh(): Group {
  return makeHumanoidMesh({ shirt: NPC_SHIRT, pants: PLAYER_PANTS, hair: NPC_HAIR }, 1.1);
}

export class EntityLayer {
  readonly root = new Group();
  private readonly playerParts = makeSurferRig(BOARD_WOOD, BOARD_STRIPE, makeWakeMesh(0.4, 0.35));
  private readonly dockBoard = makeSurfboardMesh();
  private readonly player = makePlayerMesh();
  private readonly demoSurferPool: DemoSurferVisual[] = [];
  private readonly npcPool: Group[] = [];

  constructor() {
    this.root.add(this.playerParts.rig, this.playerParts.wake, this.dockBoard, this.player);
  }

  sync(snapshot: DisplaySimulationSnapshot, map: WorldMap): void {
    const tile = getTile(
      map,
      Math.floor(snapshot.surfboard.position.x),
      Math.floor(snapshot.surfboard.position.y),
    );
    const beached = snapshot.surfboard.speedState === 'seated' && tile === 'sand';
    const headingRad = beached
      ? 0
      : (headingToDegrees(snapshot.surfboard.currentHeading) * Math.PI) / 180;
    const riderPose = boardRiderPose(
      snapshot.surfboard.position.x,
      snapshot.surfboard.position.y,
      snapshot.surfboard.currentHeading,
      snapshot.trickAnimation,
      snapshot.tide,
    );
    const rotationY = beached ? 0 : headingToRotationY(snapshot.surfboard.currentHeading);
    const boardY = riderPose.boardY;

    this.playerParts.rig.visible = snapshot.boardMounted;
    this.dockBoard.visible = !snapshot.boardMounted;
    this.player.visible = true;
    this.syncNpcs(snapshot, map);
    this.syncDemoSurfers(snapshot);

    if (!snapshot.boardMounted) {
      const dockPos = tileToWorld3(snapshot.boardDockX, snapshot.boardDockY);
      const walkPos = tileToWorld3(snapshot.surfboard.position.x, snapshot.surfboard.position.y);
      const dockY = coralParkLandSurfaceY(snapshot.boardDockX, snapshot.boardDockY, 'sand');
      const walkTile = getTile(
        map,
        Math.floor(snapshot.surfboard.position.x),
        Math.floor(snapshot.surfboard.position.y),
      );
      const walkY =
        walkTile === 'grass' || walkTile === 'sand'
          ? coralParkLandSurfaceY(
              snapshot.surfboard.position.x,
              snapshot.surfboard.position.y,
              walkTile,
            )
          : dockY;
      this.dockBoard.position.set(dockPos.x, dockY, dockPos.z);
      this.dockBoard.rotation.set(0, 0, 0);

      if (this.player.parent !== this.root) {
        this.root.add(this.player);
      }
      this.player.position.set(walkPos.x, walkY, walkPos.z);
      this.player.rotation.set(0, headingToRotationY(snapshot.surfboard.currentHeading), 0);
      this.player.scale.y = 1;
      this.playerParts.wake.visible = false;
      return;
    }

    if (this.player.parent !== this.playerParts.riderAnchor) {
      this.playerParts.riderAnchor.add(this.player);
      this.player.rotation.set(0, 0, 0);
    }
    applySurferPose(this.playerParts, this.player, riderPose);

    const showWake = snapshot.surfboard.speedState === 'riding' && snapshot.trickAnimation === null;
    this.playerParts.wake.visible = showWake;
    if (showWake) {
      const behind = headingRad + Math.PI;
      this.playerParts.wake.position.set(
        riderPose.worldX + Math.cos(behind) * 0.85,
        boardY + 0.02,
        riderPose.worldZ + Math.sin(behind) * 0.85,
      );
      this.playerParts.wake.rotation.set(0, rotationY, 0);
    }
  }

  private syncDemoSurfers(snapshot: DisplaySimulationSnapshot): void {
    while (this.demoSurferPool.length < snapshot.demoSurfers.length) {
      const style = DEMO_SURFER_STYLES[this.demoSurferPool.length % DEMO_SURFER_STYLES.length];
      const visual = makeDemoSurferVisual(style);
      this.demoSurferPool.push(visual);
      this.root.add(visual.parts.rig, visual.parts.wake);
    }

    for (let i = 0; i < this.demoSurferPool.length; i += 1) {
      const visual = this.demoSurferPool[i];
      const demo = snapshot.demoSurfers[i];
      if (!demo) {
        visual.parts.rig.visible = false;
        visual.parts.wake.visible = false;
        continue;
      }

      const riderPose = boardRiderPose(
        demo.surfboard.position.x,
        demo.surfboard.position.y,
        demo.surfboard.currentHeading,
        demo.trickAnimation,
        snapshot.tide,
        demo.tideSpinProgress,
      );
      const headingRad = (headingToDegrees(demo.surfboard.currentHeading) * Math.PI) / 180;

      visual.parts.rig.visible = true;
      applySurferPose(visual.parts, visual.rider, riderPose);

      const showWake =
        demo.trickAnimation === null &&
        (demo.surfboard.speedState === 'riding' || demo.tideSpinProgress !== null);
      visual.parts.wake.visible = showWake;
      if (showWake) {
        const behind = headingRad + Math.PI;
        visual.parts.wake.position.set(
          riderPose.worldX + Math.cos(behind) * 0.85,
          riderPose.boardY + 0.02,
          riderPose.worldZ + Math.sin(behind) * 0.85,
        );
        visual.parts.wake.rotation.set(0, riderPose.rotationY, 0);
      }
    }
  }

  private syncNpcs(snapshot: DisplaySimulationSnapshot, map: WorldMap): void {
    while (this.npcPool.length < snapshot.npcs.length) {
      const npc = makeNpcMesh();
      this.npcPool.push(npc);
      this.root.add(npc);
    }

    for (let i = 0; i < this.npcPool.length; i += 1) {
      const mesh = this.npcPool[i];
      if (i >= snapshot.npcs.length) {
        mesh.visible = false;
        continue;
      }
      const npc = snapshot.npcs[i];
      mesh.visible = true;
      const npcPos = tileToWorld3(npc.x, npc.y);
      const npcTile = getTile(map, Math.floor(npc.x), Math.floor(npc.y));
      const npcY =
        npcTile === 'grass' || npcTile === 'sand'
          ? coralParkLandSurfaceY(npc.x, npc.y, npcTile)
          : coralParkLandSurfaceY(npc.x, npc.y, 'sand');
      mesh.position.set(npcPos.x, npcY, npcPos.z);
    }
  }

  dispose(): void {
    this.root.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        (child.material as MeshStandardMaterial).dispose();
      }
    });
  }
}

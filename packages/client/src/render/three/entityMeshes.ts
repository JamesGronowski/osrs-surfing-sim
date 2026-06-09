import {
  getTile,
  headingToDegrees,
  tideRideSurfaceY,
  type TideState,
  type WorldMap,
} from '@osrs-surfing/engine';
import { CapsuleGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

import type { DisplaySimulationSnapshot, DisplayTrickAnimation } from '../visualSnapshot.js';
import { trickBoardPose } from './trickAnimationPose.js';
import { headingToRotationY, tileToWorld3 } from './worldCoords.js';

const PLAYER_SKIN = 0xffcc66;
const PLAYER_SHIRT = 0x3a6ea5;
const BOARD_WOOD = 0xc9a066;
const BOARD_STRIPE = 0xf4c542;
const DEMO_SURFER_SHIRT = 0x2d8a6e;
const DEMO_SURFER_HAIR = 0x2a1810;
const DEMO_BOARD_WOOD = 0xb8884a;
const DEMO_BOARD_STRIPE = 0xe8d44a;
const NPC_HAIR = 0x5c3a1e;
const WAKE_PINK = 0xf4a7b9;
const WAKE_WHITE = 0xffffff;

const SURFACE_Y = 0.12;
const RIDER_ABOVE_BOARD = 0.22;

interface BoardRiderPose {
  worldX: number;
  worldZ: number;
  boardY: number;
  rotationY: number;
  pitch: number;
  roll: number;
  riderLean: number;
}

function boardRiderPose(
  tileX: number,
  tileY: number,
  heading: number,
  animation: DisplayTrickAnimation | null,
  tide: TideState | null,
): BoardRiderPose {
  const pose = animation ? trickBoardPose(animation) : null;
  const world = tileToWorld3(tileX + (pose?.offsetX ?? 0), tileY + (pose?.offsetY ?? 0));
  const surfaceY = tideRideSurfaceY(tileX, tileY, tide);
  return {
    worldX: world.x,
    worldZ: world.z,
    boardY: surfaceY + (pose?.liftY ?? 0),
    rotationY: headingToRotationY(heading) + (pose?.yawOffset ?? 0),
    pitch: pose?.pitch ?? 0,
    roll: pose?.roll ?? 0,
    riderLean: pose?.riderLean ?? 0,
  };
}

function applyBoardRiderPose(board: Group, rider: Group, pose: BoardRiderPose): void {
  board.position.set(pose.worldX, pose.boardY, pose.worldZ);
  board.rotation.set(pose.pitch, pose.rotationY, pose.roll);
  rider.position.set(pose.worldX, pose.boardY + RIDER_ABOVE_BOARD, pose.worldZ);
  rider.rotation.set(pose.riderLean, pose.rotationY, pose.roll * 0.35);
}

function makeSurfboardMesh(woodColor = BOARD_WOOD, stripeColor = BOARD_STRIPE): Group {
  const group = new Group();
  const deck = new Mesh(
    new CylinderGeometry(0.45, 0.45, 0.08, 24),
    new MeshStandardMaterial({ color: woodColor, roughness: 0.8 }),
  );
  deck.scale.set(1.6, 1, 0.55);
  const stripe = new Mesh(
    new CylinderGeometry(0.08, 0.08, 0.09, 12),
    new MeshStandardMaterial({ color: stripeColor, roughness: 0.7 }),
  );
  stripe.scale.set(1.2, 1, 0.5);
  stripe.position.y = 0.02;
  group.add(deck, stripe);
  return group;
}

function makePlayerMesh(): Group {
  const group = new Group();
  const body = new Mesh(
    new CapsuleGeometry(0.14, 0.28, 4, 8),
    new MeshStandardMaterial({ color: PLAYER_SHIRT, roughness: 0.85 }),
  );
  body.position.y = 0.28;
  const head = new Mesh(
    new CapsuleGeometry(0.1, 0.08, 4, 8),
    new MeshStandardMaterial({ color: PLAYER_SKIN, roughness: 0.85 }),
  );
  head.position.y = 0.52;
  group.add(body, head);
  return group;
}

function makeDemoSurferMesh(): Group {
  const group = new Group();
  const body = new Mesh(
    new CapsuleGeometry(0.14, 0.26, 4, 8),
    new MeshStandardMaterial({ color: DEMO_SURFER_SHIRT, roughness: 0.85 }),
  );
  body.position.y = 0.27;
  const head = new Mesh(
    new CapsuleGeometry(0.1, 0.08, 4, 8),
    new MeshStandardMaterial({ color: PLAYER_SKIN, roughness: 0.85 }),
  );
  head.position.y = 0.51;
  const hair = new Mesh(
    new CapsuleGeometry(0.12, 0.14, 4, 8),
    new MeshStandardMaterial({ color: DEMO_SURFER_HAIR, roughness: 0.9 }),
  );
  hair.position.y = 0.66;
  group.add(body, head, hair);
  return group;
}

function makeNpcMesh(): Group {
  const group = new Group();
  const body = new Mesh(
    new CapsuleGeometry(0.16, 0.3, 4, 8),
    new MeshStandardMaterial({ color: PLAYER_SHIRT, roughness: 0.85 }),
  );
  body.position.y = 0.3;
  const head = new Mesh(
    new CapsuleGeometry(0.11, 0.1, 4, 8),
    new MeshStandardMaterial({ color: PLAYER_SKIN, roughness: 0.85 }),
  );
  head.position.y = 0.56;
  const hair = new Mesh(
    new CapsuleGeometry(0.12, 0.04, 4, 8),
    new MeshStandardMaterial({ color: NPC_HAIR, roughness: 0.9 }),
  );
  hair.position.y = 0.68;
  group.add(body, head, hair);
  return group;
}

export class EntityLayer {
  readonly root = new Group();
  readonly ridingBoard = makeSurfboardMesh();
  readonly dockBoard = makeSurfboardMesh();
  readonly player = makePlayerMesh();
  readonly wake = new Group();
  readonly demoSurferBoard = makeSurfboardMesh(DEMO_BOARD_WOOD, DEMO_BOARD_STRIPE);
  readonly demoSurfer = makeDemoSurferMesh();
  readonly demoSurferWake = new Group();
  private readonly npcPool: Group[] = [];

  constructor() {
    this.root.add(
      this.ridingBoard,
      this.dockBoard,
      this.player,
      this.wake,
      this.demoSurferBoard,
      this.demoSurfer,
      this.demoSurferWake,
    );

    const wakeOuter = new Mesh(
      new CylinderGeometry(0.5, 0.5, 0.02, 16),
      new MeshStandardMaterial({ color: WAKE_PINK, transparent: true, opacity: 0.4 }),
    );
    wakeOuter.scale.set(1.9, 1, 0.8);
    const wakeInner = new Mesh(
      new CylinderGeometry(0.42, 0.42, 0.02, 16),
      new MeshStandardMaterial({ color: WAKE_WHITE, transparent: true, opacity: 0.35 }),
    );
    wakeInner.scale.set(1.6, 1, 0.65);
    this.wake.add(wakeOuter, wakeInner);
    this.wake.visible = false;

    const demoWakeOuter = new Mesh(
      new CylinderGeometry(0.5, 0.5, 0.02, 16),
      new MeshStandardMaterial({ color: WAKE_PINK, transparent: true, opacity: 0.32 }),
    );
    demoWakeOuter.scale.set(1.9, 1, 0.8);
    const demoWakeInner = new Mesh(
      new CylinderGeometry(0.42, 0.42, 0.02, 16),
      new MeshStandardMaterial({ color: WAKE_WHITE, transparent: true, opacity: 0.28 }),
    );
    demoWakeInner.scale.set(1.6, 1, 0.65);
    this.demoSurferWake.add(demoWakeOuter, demoWakeInner);
    this.demoSurferWake.visible = false;
    this.demoSurferBoard.visible = false;
    this.demoSurfer.visible = false;
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

    this.ridingBoard.visible = snapshot.boardMounted;
    this.dockBoard.visible = !snapshot.boardMounted;
    this.player.visible = true;
    this.syncNpcs(snapshot);
    this.syncDemoSurfer(snapshot);

    if (!snapshot.boardMounted) {
      const dockPos = tileToWorld3(snapshot.boardDockX, snapshot.boardDockY);
      const walkPos = tileToWorld3(snapshot.surfboard.position.x, snapshot.surfboard.position.y);
      this.dockBoard.position.set(dockPos.x, SURFACE_Y, dockPos.z);
      this.dockBoard.rotation.set(0, 0, 0);

      this.player.position.set(walkPos.x, SURFACE_Y, walkPos.z);
      this.player.rotation.set(0, headingToRotationY(snapshot.surfboard.currentHeading), 0);
      this.ridingBoard.position.set(0, -100, 0);
      return;
    }

    applyBoardRiderPose(this.ridingBoard, this.player, riderPose);

    this.dockBoard.position.set(0, -100, 0);

    const showWake = snapshot.surfboard.speedState === 'riding' && snapshot.trickAnimation === null;
    this.wake.visible = showWake;
    if (showWake) {
      const behind = headingRad + Math.PI;
      this.wake.position.set(
        riderPose.worldX + Math.cos(behind) * 0.85,
        boardY + 0.02,
        riderPose.worldZ + Math.sin(behind) * 0.85,
      );
      this.wake.rotation.set(0, rotationY, 0);
    }
  }

  private syncDemoSurfer(snapshot: DisplaySimulationSnapshot): void {
    const demo = snapshot.demoSurfer;
    if (!demo) {
      this.demoSurferBoard.visible = false;
      this.demoSurfer.visible = false;
      this.demoSurferWake.visible = false;
      return;
    }

    const riderPose = boardRiderPose(
      demo.surfboard.position.x,
      demo.surfboard.position.y,
      demo.surfboard.currentHeading,
      demo.trickAnimation,
      snapshot.tide,
    );
    const headingRad = (headingToDegrees(demo.surfboard.currentHeading) * Math.PI) / 180;

    this.demoSurferBoard.visible = true;
    this.demoSurfer.visible = true;
    applyBoardRiderPose(this.demoSurferBoard, this.demoSurfer, riderPose);

    const showWake = demo.surfboard.speedState === 'riding' && demo.trickAnimation === null;
    this.demoSurferWake.visible = showWake;
    if (showWake) {
      const behind = headingRad + Math.PI;
      this.demoSurferWake.position.set(
        riderPose.worldX + Math.cos(behind) * 0.85,
        riderPose.boardY + 0.02,
        riderPose.worldZ + Math.sin(behind) * 0.85,
      );
      this.demoSurferWake.rotation.set(0, riderPose.rotationY, 0);
    }
  }

  private syncNpcs(snapshot: DisplaySimulationSnapshot): void {
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
      mesh.position.set(npcPos.x, SURFACE_Y, npcPos.z);
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

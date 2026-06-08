import {
  getTile,
  headingToDegrees,
  type SimulationSnapshot,
  type WorldMap,
} from '@osrs-surfing/engine';
import { CapsuleGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

import { headingToRotationY, tileToWorld3 } from './worldCoords.js';

const PLAYER_SKIN = 0xffcc66;
const PLAYER_SHIRT = 0x3a6ea5;
const BOARD_WOOD = 0xc9a066;
const BOARD_STRIPE = 0xf4c542;
const NPC_HAIR = 0x5c3a1e;
const WAKE_PINK = 0xf4a7b9;
const WAKE_WHITE = 0xffffff;

const SURFACE_Y = 0.12;

function makeSurfboardMesh(): Group {
  const group = new Group();
  const deck = new Mesh(
    new CylinderGeometry(0.45, 0.45, 0.08, 24),
    new MeshStandardMaterial({ color: BOARD_WOOD, roughness: 0.8 }),
  );
  deck.scale.set(1.6, 1, 0.55);
  const stripe = new Mesh(
    new CylinderGeometry(0.08, 0.08, 0.09, 12),
    new MeshStandardMaterial({ color: BOARD_STRIPE, roughness: 0.7 }),
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
  private readonly npcPool: Group[] = [];

  constructor() {
    this.root.add(this.ridingBoard, this.dockBoard, this.player, this.wake);

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
  }

  sync(snapshot: SimulationSnapshot, map: WorldMap): void {
    const pos = tileToWorld3(snapshot.surfboard.position.x, snapshot.surfboard.position.y);
    const tile = getTile(
      map,
      Math.floor(snapshot.surfboard.position.x),
      Math.floor(snapshot.surfboard.position.y),
    );
    const beached = snapshot.surfboard.speedState === 'seated' && tile === 'sand';
    const headingRad = beached
      ? 0
      : (headingToDegrees(snapshot.surfboard.currentHeading) * Math.PI) / 180;
    const rotationY = beached ? 0 : headingToRotationY(snapshot.surfboard.currentHeading);

    this.ridingBoard.visible = snapshot.boardMounted;
    this.dockBoard.visible = !snapshot.boardMounted;
    this.player.visible = true;

    if (!snapshot.boardMounted) {
      const dockPos = tileToWorld3(snapshot.boardDockX, snapshot.boardDockY);
      this.dockBoard.position.set(dockPos.x, SURFACE_Y, dockPos.z);
      this.dockBoard.rotation.set(0, 0, 0);

      this.player.position.set(pos.x, SURFACE_Y, pos.z);
      this.player.rotation.set(0, headingToRotationY(snapshot.surfboard.currentHeading), 0);
      this.ridingBoard.position.set(0, -100, 0);
      return;
    }

    this.ridingBoard.position.set(pos.x, SURFACE_Y, pos.z);
    this.ridingBoard.rotation.set(0, rotationY, 0);

    this.player.position.set(pos.x, SURFACE_Y + 0.22, pos.z);
    this.player.rotation.set(0, rotationY, 0);

    this.dockBoard.position.set(0, -100, 0);

    const showWake = snapshot.surfboard.speedState === 'riding';
    this.wake.visible = showWake;
    if (showWake) {
      const behind = headingRad + Math.PI;
      this.wake.position.set(
        pos.x + Math.cos(behind) * 0.85,
        SURFACE_Y + 0.02,
        pos.z + Math.sin(behind) * 0.85,
      );
      this.wake.rotation.set(0, rotationY, 0);
    }

    this.syncNpcs(snapshot);
  }

  private syncNpcs(snapshot: SimulationSnapshot): void {
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

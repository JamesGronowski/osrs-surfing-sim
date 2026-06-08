import {
  isTrickZoneSubmerged,
  trickZoneVisualAlpha,
  type SimulationSnapshot,
  type TrickFeatureType,
} from '@osrs-surfing/engine';
import {
  BoxGeometry,
  ConeGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
  type Material,
} from 'three';

import { radiansToRotationY, tileToWorld3 } from './worldCoords.js';

const TRICKED_BASE = 0x555555;
const TRICKED_ACCENT = 0x444444;

function paletteFor(type: TrickFeatureType, tricked: boolean): { base: number; accent: number } {
  if (tricked) {
    return { base: TRICKED_BASE, accent: TRICKED_ACCENT };
  }
  switch (type) {
    case 'rail':
      return { base: 0xf4a7b9, accent: 0xf4c542 };
    case 'tunnel':
      return { base: 0x9b6bff, accent: 0xc9b4ff };
    case 'jump':
      return { base: 0xff8c42, accent: 0xffe066 };
    case 'brain_coral':
      return { base: 0xff6eb4, accent: 0xff9ed2 };
    case 'wall_ride':
      return { base: 0x6ec8ff, accent: 0xb8e6ff };
    default:
      return { base: 0xf4a7b9, accent: 0xf4c542 };
  }
}

function makeMaterial(color: number, opacity: number): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    roughness: 0.7,
    metalness: 0.1,
  });
}

function buildRailGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  const rail = new Mesh(
    new BoxGeometry(radius * 2.3, radius * 0.12, radius * 0.24),
    makeMaterial(palette.base, alpha),
  );
  rail.position.y = radius * 0.2;
  const post = new Mesh(
    new BoxGeometry(radius * 0.36, radius * 0.44, radius * 0.36),
    makeMaterial(palette.accent, alpha),
  );
  post.position.set(0, radius * 0.35, 0);
  group.add(rail, post);
  return group;
}

function buildTunnelGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  const base = new Mesh(
    new BoxGeometry(radius * 1.6, radius * 0.55, radius * 0.8),
    makeMaterial(palette.base, alpha),
  );
  base.position.y = radius * 0.28;
  const arch = new Mesh(
    new TorusGeometry(radius * 0.75, radius * 0.12, 8, 16, Math.PI),
    makeMaterial(palette.accent, alpha),
  );
  arch.rotation.x = Math.PI / 2;
  arch.rotation.z = Math.PI;
  arch.position.y = radius * 0.45;
  group.add(base, arch);
  return group;
}

function buildJumpGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  const ramp = new Mesh(
    new BoxGeometry(radius * 1.4, radius * 0.35, radius * 1.1),
    makeMaterial(palette.base, alpha),
  );
  ramp.position.set(0, radius * 0.18, -radius * 0.15);
  ramp.rotation.x = -0.35;
  const lip = new Mesh(
    new BoxGeometry(radius * 1.5, radius * 0.1, radius * 0.2),
    makeMaterial(palette.accent, alpha),
  );
  lip.position.set(0, radius * 0.35, radius * 0.45);
  group.add(ramp, lip);
  return group;
}

function buildBrainCoralGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  const core = new Mesh(
    new IcosahedronGeometry(radius * 0.55, 1),
    makeMaterial(palette.base, alpha),
  );
  core.position.y = radius * 0.35;
  const bump = new Mesh(
    new IcosahedronGeometry(radius * 0.3, 0),
    makeMaterial(palette.accent, alpha),
  );
  bump.position.set(radius * 0.25, radius * 0.5, radius * 0.15);
  group.add(core, bump);
  return group;
}

function buildWallRideGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  const wall = new Mesh(
    new BoxGeometry(radius * 0.35, radius * 1.2, radius * 1.4),
    makeMaterial(palette.base, alpha),
  );
  wall.position.y = radius * 0.5;
  const crest = new Mesh(
    new BoxGeometry(radius * 0.45, radius * 0.15, radius * 1.5),
    makeMaterial(palette.accent, alpha),
  );
  crest.position.y = radius * 1.05;
  group.add(wall, crest);
  return group;
}

function buildTrickGroup(
  type: TrickFeatureType,
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  switch (type) {
    case 'rail':
      return buildRailGroup(radius, palette, alpha);
    case 'tunnel':
      return buildTunnelGroup(radius, palette, alpha);
    case 'jump':
      return buildJumpGroup(radius, palette, alpha);
    case 'brain_coral':
      return buildBrainCoralGroup(radius, palette, alpha);
    case 'wall_ride':
      return buildWallRideGroup(radius, palette, alpha);
    default:
      return buildRailGroup(radius, palette, alpha);
  }
}

function addApproachChevrons(group: Group, radius: number, alpha: number): void {
  const material = makeMaterial(0xfff566, alpha * 0.9);
  for (const offset of [-0.72, -0.52, -0.32]) {
    const cone = new Mesh(new ConeGeometry(radius * 0.15, radius * 0.25, 3), material);
    cone.rotation.x = Math.PI;
    cone.rotation.z = Math.PI;
    cone.position.set(0, radius * 0.08, radius * offset + radius * 0.22);
    group.add(cone);
  }
}

function disposeGroupContents(group: Group): void {
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    child.traverse((node) => {
      if (node instanceof Mesh) {
        node.geometry.dispose();
        const material = node.material;
        if (Array.isArray(material)) {
          material.forEach((entry) => entry.dispose());
        } else {
          (material as Material).dispose();
        }
      }
    });
  }
}

function zoneMeshKey(
  zone: SimulationSnapshot['trickZones'][number],
  snapshot: SimulationSnapshot,
  interactionDisabled: boolean,
): string {
  const showChevrons =
    !zone.tricked &&
    !interactionDisabled &&
    snapshot.trickPrepare !== null &&
    snapshot.trickPrepare.slot === zone.prepareSlot;
  return `${zone.id}:${zone.type}:${zone.tricked}:${zone.radius}:${showChevrons}`;
}

function setGroupOpacity(group: Group, opacity: number): void {
  group.traverse((node) => {
    if (node instanceof Mesh) {
      const material = node.material as MeshStandardMaterial;
      material.opacity = opacity;
      material.transparent = opacity < 1;
    }
  });
}

export class TrickFeatureLayer {
  readonly root = new Group();
  private pool: Group[] = [];
  private meshKeys: string[] = [];

  sync(snapshot: SimulationSnapshot): void {
    const tide = snapshot.tide;
    const zones = snapshot.trickZones;

    while (this.pool.length < zones.length) {
      const group = new Group();
      this.pool.push(group);
      this.meshKeys.push('');
      this.root.add(group);
    }

    for (let i = 0; i < this.pool.length; i += 1) {
      const group = this.pool[i];
      if (i >= zones.length) {
        group.visible = false;
        continue;
      }

      const zone = zones[i];
      group.visible = true;

      const interactionDisabled = tide ? isTrickZoneSubmerged(zone, tide) : false;
      const alpha = trickZoneVisualAlpha(zone, tide);
      const featureAlpha = interactionDisabled ? alpha * 0.5 : alpha;
      const meshKey = zoneMeshKey(zone, snapshot, interactionDisabled);

      if (this.meshKeys[i] !== meshKey) {
        disposeGroupContents(group);
        const palette = paletteFor(zone.type, zone.tricked);
        const feature = buildTrickGroup(zone.type, zone.radius, palette, featureAlpha);
        group.add(feature);

        if (
          !zone.tricked &&
          !interactionDisabled &&
          snapshot.trickPrepare !== null &&
          snapshot.trickPrepare.slot === zone.prepareSlot
        ) {
          addApproachChevrons(group, zone.radius, featureAlpha);
        }
        this.meshKeys[i] = meshKey;
      } else {
        setGroupOpacity(group, featureAlpha);
      }

      const pos = tileToWorld3(zone.center.x, zone.center.y);
      group.position.set(pos.x, 0, pos.z);
      group.rotation.y = radiansToRotationY(zone.rotationRadians);
    }
  }

  dispose(): void {
    for (const group of this.pool) {
      group.traverse((child) => {
        if (child instanceof Mesh) {
          child.geometry.dispose();
          (child.material as MeshStandardMaterial).dispose();
        }
      });
    }
    this.pool = [];
    this.root.clear();
  }
}

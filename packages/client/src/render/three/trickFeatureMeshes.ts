import {
  isTrickZoneSubmerged,
  TIDE_REEF_RIDE_SURFACE_Y,
  tideRideSurfaceY,
  TUNNEL_TORUS_BASE_Y_FACTOR,
  TUNNEL_TORUS_CLEARANCE_ABOVE_ARCH,
  TUNNEL_TORUS_LENGTH_SCALE,
  TUNNEL_TORUS_MAJOR_RADIUS_FACTOR,
  TUNNEL_TORUS_TUBE_RADIUS_FACTOR,
  trickZoneHitboxExtents,
  trickZoneVisualAlpha,
  trickZoneVisualSubmergeProgress,
  type SimulationSnapshot,
  type TrickFeatureType,
} from '@osrs-surfing/engine';
import {
  BoxGeometry,
  ConeGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  TorusGeometry,
  type Material,
} from 'three';

import { radiansToRotationY, tileToWorld3 } from './worldCoords.js';

/** Reef overlay tile top in world Y (see MapMeshBuilder OVERLAY_TILE_HEIGHT). */
const REEF_OVERLAY_TOP_Y = 0.06;

/** Extra clearance below reef geometry when fully submerged. */
const TRICK_FEATURE_SUBMERGE_BELOW_FLOOR = 0.2;

/** Set true to draw green trick hitbox overlays (sizes from engine trickHitbox.ts). */
const SHOW_TRICK_HITBOXES = false;
/** Hitbox overlay colour (edit here). */
const TRICK_HITBOX_COLOR = 0x22ff66;
/** Opacity (0–1); not faded with tide so debug boxes stay visible. */
const TRICK_HITBOX_OPACITY = 0.45;
/** Draw above terrain, water, and feature meshes. */
const TRICK_HITBOX_RENDER_ORDER = 10_000;
const TRICK_HITBOX_MESH_NAME = 'trick-hitbox';

/** Jump ramp half-run along local Z from centre to outer edge (fraction of zone radius). */
const JUMP_RAMP_RUN_FACTOR = 1;
/** Peak height where both ramp top edges meet (fraction of zone radius). */
const JUMP_PEAK_HEIGHT_FACTOR = 0.55;
/** Outer ramp top sits this far below ride surface at y=0 (fraction of zone radius). */
const JUMP_RAMP_LIP_BELOW_SURFACE_FACTOR = 0.12;
/** Ramp slab thickness (fraction of zone radius). */
const JUMP_RAMP_THICKNESS_FACTOR = 0.14;
/** Ramp width across the reef (fraction of zone radius). */
const JUMP_RAMP_WIDTH_FACTOR = 2.2;
/** How far each ramp extends past centre so the slabs interpenetrate at the peak (fraction of run). */
const JUMP_RAMP_CENTER_OVERLAP_RUN_FACTOR = 0.5;

/** Tallest mesh extent above group origin per feature type (fraction of zone radius). */
function trickFeatureHeightAboveSurface(type: TrickFeatureType, radius: number): number {
  switch (type) {
    case 'tunnel':
      return (
        radius *
        (TUNNEL_TORUS_MAJOR_RADIUS_FACTOR +
          TUNNEL_TORUS_TUBE_RADIUS_FACTOR +
          TUNNEL_TORUS_CLEARANCE_ABOVE_ARCH)
      );
    case 'wall_ride':
      return radius * 1.125;
    case 'brain_coral':
      return radius * 0.8;
    case 'jump':
      return radius * (JUMP_PEAK_HEIGHT_FACTOR + JUMP_RAMP_THICKNESS_FACTOR * 0.5);
    case 'rail':
    default:
      return radius * 0.57;
  }
}

function trickFeatureFullSubmergeDepth(type: TrickFeatureType, radius: number): number {
  return (
    trickFeatureHeightAboveSurface(type, radius) +
    REEF_OVERLAY_TOP_Y +
    TRICK_FEATURE_SUBMERGE_BELOW_FLOOR
  );
}

function trickFeatureTideBaseY(
  zone: SimulationSnapshot['trickZones'][number],
  tide: SimulationSnapshot['tide'],
): number {
  if (!tide) {
    return 0;
  }
  return tideRideSurfaceY(zone.center.x, zone.center.y, tide) - TIDE_REEF_RIDE_SURFACE_Y;
}

function trickFeatureSurfaceY(
  zone: SimulationSnapshot['trickZones'][number],
  tide: SimulationSnapshot['tide'],
  tickBlend: number,
  interactionDisabled: boolean,
): number {
  const tideBase = trickFeatureTideBaseY(zone, tide);
  if (!interactionDisabled) {
    return tideBase;
  }
  const submerge = trickZoneVisualSubmergeProgress(zone, tide, tickBlend);
  return tideBase - submerge * trickFeatureFullSubmergeDepth(zone.type, zone.radius);
}

function paletteFor(type: TrickFeatureType): { base: number; accent: number } {
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

function makeHitboxMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: TRICK_HITBOX_COLOR,
    transparent: true,
    opacity: TRICK_HITBOX_OPACITY,
    depthTest: false,
    depthWrite: false,
  });
}

function buildHitboxMesh(type: TrickFeatureType, radius: number): Mesh {
  const extents = trickZoneHitboxExtents(type, radius);
  const mesh = new Mesh(
    new BoxGeometry(extents.halfAlongRide * 2, extents.height, extents.halfLateral * 2),
    makeHitboxMaterial(),
  );
  mesh.name = TRICK_HITBOX_MESH_NAME;
  mesh.renderOrder = TRICK_HITBOX_RENDER_ORDER;
  mesh.position.y = extents.centerY;
  return mesh;
}

function syncHitboxOverlay(
  group: Group,
  type: TrickFeatureType,
  radius: number,
  surfaceYOffset: number,
): void {
  const extents = trickZoneHitboxExtents(type, radius);
  const existing = group.getObjectByName(TRICK_HITBOX_MESH_NAME) as Mesh | undefined;

  if (!SHOW_TRICK_HITBOXES) {
    if (existing) {
      existing.visible = false;
    }
    return;
  }

  const width = extents.halfAlongRide * 2;
  const height = extents.height;
  const depth = extents.halfLateral * 2;
  let hitbox = existing;
  if (!hitbox) {
    hitbox = buildHitboxMesh(type, radius);
    group.add(hitbox);
  } else {
    const geometry = hitbox.geometry as BoxGeometry;
    if (
      geometry.parameters.width !== width ||
      geometry.parameters.height !== height ||
      geometry.parameters.depth !== depth
    ) {
      geometry.dispose();
      hitbox.geometry = new BoxGeometry(width, height, depth);
    }
    hitbox.renderOrder = TRICK_HITBOX_RENDER_ORDER;
    hitbox.position.y = extents.centerY;
  }
  hitbox.position.y = extents.centerY + surfaceYOffset;
  hitbox.visible = true;
}

function buildRailGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  const rail = new Mesh(
    new BoxGeometry(radius * 2.3, radius * 0.1, radius * 0.2),
    makeMaterial(palette.base, alpha),
  );
  rail.position.y = radius * 0.22;
  const post = new Mesh(
    new BoxGeometry(radius * 0.32, radius * 0.4, radius * 0.32),
    makeMaterial(palette.accent, alpha),
  );
  post.position.set(0, radius * 0.34, 0);
  group.add(rail, post);
  return group;
}

function buildTunnelGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  const arch = new Mesh(
    new TorusGeometry(
      radius * TUNNEL_TORUS_MAJOR_RADIUS_FACTOR,
      radius * TUNNEL_TORUS_TUBE_RADIUS_FACTOR,
      14,
      28,
      Math.PI,
    ),
    makeMaterial(palette.accent, alpha),
  );
  // Half-torus in the XY plane — bore is +Z; stretch that axis into a long ride-through tube.
  arch.scale.set(1, 1, TUNNEL_TORUS_LENGTH_SCALE);
  arch.position.y = radius * TUNNEL_TORUS_BASE_Y_FACTOR;
  group.add(arch);
  // Meshes are built along +Z; align with reef tangent (rails use +X).
  group.rotation.y = Math.PI / 2;
  return group;
}

function buildJumpRamp(
  radius: number,
  zSign: 1 | -1,
  palette: { base: number; accent: number },
  alpha: number,
): Mesh {
  const run = radius * JUMP_RAMP_RUN_FACTOR;
  const peakY = radius * JUMP_PEAK_HEIGHT_FACTOR;
  const lipBelow = radius * JUMP_RAMP_LIP_BELOW_SURFACE_FACTOR;
  const thickness = radius * JUMP_RAMP_THICKNESS_FACTOR;
  const width = radius * JUMP_RAMP_WIDTH_FACTOR;

  const rise = peakY + lipBelow;
  const angle = Math.atan2(rise, run);
  const overlap = run * JUMP_RAMP_CENTER_OVERLAP_RUN_FACTOR;
  const depth = run + overlap;
  const innerTopOffsetY = (thickness / 2) * Math.cos(angle) + (depth / 2) * Math.sin(angle);
  const centerY = peakY - innerTopOffsetY;
  const centerZ =
    -zSign * ((thickness / 2) * Math.sin(angle) - (depth / 2) * Math.cos(angle));

  const ramp = new Mesh(
    new BoxGeometry(width, thickness, depth),
    makeMaterial(palette.base, alpha),
  );
  ramp.position.set(0, centerY, centerZ);
  ramp.rotation.x = zSign * angle;
  return ramp;
}

function buildJumpGroup(
  radius: number,
  palette: { base: number; accent: number },
  alpha: number,
): Group {
  const group = new Group();
  group.add(
    buildJumpRamp(radius, -1, palette, alpha),
    buildJumpRamp(radius, 1, palette, alpha),
  );
  // Meshes are built along +Z; align with reef tangent (rails use +X).
  group.rotation.y = Math.PI / 2;
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
    new BoxGeometry(radius * 0.24, radius * 1.15, radius * 1.35),
    makeMaterial(palette.base, alpha),
  );
  wall.position.set(0, radius * 0.48, 0);
  const crest = new Mesh(
    new BoxGeometry(radius * 0.34, radius * 0.14, radius * 1.45),
    makeMaterial(palette.accent, alpha),
  );
  crest.position.y = radius * 1.02;
  group.add(wall, crest);
  // Meshes are built along +Z; ride direction matches rails along +X.
  group.rotation.y = Math.PI / 2;
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

function addApproachChevrons(
  group: Group,
  type: TrickFeatureType,
  radius: number,
  alpha: number,
): void {
  const material = makeMaterial(0xfff566, alpha * 0.9);
  const approachSides = type === 'jump' ? [-1, 1] : [1];

  for (const side of approachSides) {
    const chevrons = new Group();
    chevrons.rotation.y = Math.PI / 2;
    for (const offset of [-0.72, -0.52, -0.32]) {
      const cone = new Mesh(new ConeGeometry(radius * 0.15, radius * 0.25, 3), material);
      cone.rotation.x = Math.PI;
      cone.rotation.z = Math.PI;
      cone.position.set(0, radius * 0.08, side * (radius * offset + radius * 0.22));
      chevrons.add(cone);
    }
    group.add(chevrons);
  }
}

function disposeGroupContents(group: Group): void {
  const children = group.children.filter((child) => child.name !== TRICK_HITBOX_MESH_NAME);
  for (const child of children) {
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
  return `${zone.id}:${zone.type}:${zone.radius}:${showChevrons}`;
}

function setGroupOpacity(group: Group, opacity: number): void {
  group.traverse((node) => {
    if (node instanceof Mesh && node.name !== TRICK_HITBOX_MESH_NAME) {
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

  sync(snapshot: SimulationSnapshot, tickBlend = 0): void {
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
      const alpha = trickZoneVisualAlpha(zone, tide, tickBlend);
      const featureAlpha = alpha;
      const meshKey = zoneMeshKey(zone, snapshot, interactionDisabled);

      if (this.meshKeys[i] !== meshKey) {
        disposeGroupContents(group);
        const palette = paletteFor(zone.type);
        const feature = buildTrickGroup(zone.type, zone.radius, palette, featureAlpha);
        group.add(feature);

        if (
          !zone.tricked &&
          !interactionDisabled &&
          snapshot.trickPrepare !== null &&
          snapshot.trickPrepare.slot === zone.prepareSlot
        ) {
          addApproachChevrons(group, zone.type, zone.radius, featureAlpha);
        }
        this.meshKeys[i] = meshKey;
      } else {
        setGroupOpacity(group, featureAlpha);
      }

      const pos = tileToWorld3(zone.center.x, zone.center.y);
      const surfaceY = trickFeatureSurfaceY(zone, tide, tickBlend, interactionDisabled);
      const reefSurfaceY = trickFeatureTideBaseY(zone, tide);
      syncHitboxOverlay(group, zone.type, zone.radius, reefSurfaceY - surfaceY);

      group.position.set(pos.x, surfaceY, pos.z);
      group.rotation.y = radiansToRotationY(
        zone.rotationRadians + (zone.rotationJitterRadians ?? 0),
      );
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

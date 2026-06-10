import {
  coralParkLandElevationKey,
  coralParkLandSurfaceY,
  TIDE_LEADING_WASH_HEIGHT,
  TIDE_REEF_SINK_Y,
  tideWaveSurfaceY,
  type TideState,
  type TileType,
  type WorldMap,
} from '@osrs-surfing/engine';
import {
  BoxGeometry,
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from 'three';

import { renderVariantColor, resolveRenderTileVariant } from '../tileAppearance.js';
import { TILE_PALETTE } from '../tilePalette.js';
import { paletteHex } from './hexColor.js';
import { TideEdgeLayer } from './tideVisualMeshes.js';

const OVERLAY_TILE_HEIGHT = 0.06;
const OVERLAY_TILE_CENTER_Y = OVERLAY_TILE_HEIGHT / 2;
const TIDE_WATER_COLUMN_MIN_HEIGHT = 0.35;

const MATRIX = new Matrix4();

type TileInstance = { tx: number; ty: number };

interface TideAnimInstance {
  tx: number;
  ty: number;
  mesh: InstancedMesh;
  index: number;
  baseCenterY: number;
  tileHeight: number;
}

const TIDE_ANIM_TILES: ReadonlySet<TileType> = new Set(['coral_rideable', 'shallow']);

const CORAL_EXPOSED_COLOR = new Color(paletteHex(TILE_PALETTE.reefExposed));
const CORAL_SUBMERGED_COLOR = new Color(paletteHex(TILE_PALETTE.reefSubmerged));

/**
 * Coral tiles flip between exposed/submerged colors with the tide, so they get
 * their own instanced mesh with per-instance colors; everything else is static.
 */
function groupInstancesByColor(map: WorldMap, includeLand: boolean): Map<number, TileInstance[]> {
  const groups = new Map<number, TileInstance[]>();

  for (let ty = 0; ty < map.heightTiles; ty += 1) {
    for (let tx = 0; tx < map.widthTiles; tx += 1) {
      const tile = map.tiles[ty][tx];
      let color: number | null = null;

      if (includeLand && (tile === 'grass' || tile === 'sand')) {
        color = renderVariantColor(tile);
      } else if (
        !includeLand &&
        tile !== 'deep_water' &&
        tile !== 'grass' &&
        tile !== 'sand' &&
        tile !== 'coral_rideable'
      ) {
        const variant = resolveRenderTileVariant(tile, tx + 0.5, ty + 0.5, null);
        color = renderVariantColor(variant);
      }

      if (color === null) {
        continue;
      }

      const list = groups.get(color) ?? [];
      list.push({ tx, ty });
      groups.set(color, list);
    }
  }

  return groups;
}

function collectCoralTiles(map: WorldMap): TileInstance[] {
  const tiles: TileInstance[] = [];
  for (let ty = 0; ty < map.heightTiles; ty += 1) {
    for (let tx = 0; tx < map.widthTiles; tx += 1) {
      if (map.tiles[ty][tx] === 'coral_rideable') {
        tiles.push({ tx, ty });
      }
    }
  }
  return tiles;
}

function landTileSurfaceY(tx: number, ty: number, tile: TileType): number {
  if (tile === 'grass' || tile === 'sand') {
    return coralParkLandSurfaceY(tx + 0.5, ty + 0.5, tile);
  }
  return OVERLAY_TILE_HEIGHT;
}

function buildInstancedLayer(
  groups: Map<number, TileInstance[]>,
  map: WorldMap,
  tideAnimInstances: TideAnimInstance[],
  options: { landElevation: boolean; flatHeight: number; flatCenterY: number },
): InstancedMesh[] {
  const meshes: InstancedMesh[] = [];

  for (const [color, instances] of groups) {
    const mesh = new InstancedMesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: paletteHex(color) }),
      instances.length,
    );
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    for (let i = 0; i < instances.length; i += 1) {
      const { tx, ty } = instances[i];
      const tile = map.tiles[ty][tx];
      const tileHeight = options.landElevation
        ? landTileSurfaceY(tx, ty, tile)
        : options.flatHeight;
      const centerY = options.landElevation ? tileHeight / 2 : options.flatCenterY;
      MATRIX.makeScale(1, tileHeight, 1);
      MATRIX.setPosition(tx + 0.5, centerY, ty + 0.5);
      mesh.setMatrixAt(i, MATRIX);

      if (TIDE_ANIM_TILES.has(tile)) {
        tideAnimInstances.push({
          tx,
          ty,
          mesh,
          index: i,
          baseCenterY: centerY,
          tileHeight,
        });
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    meshes.push(mesh);
  }

  return meshes;
}

function disposeMeshes(meshes: InstancedMesh[]): void {
  for (const mesh of meshes) {
    mesh.geometry.dispose();
    (mesh.material as MeshStandardMaterial).dispose();
  }
}

export class MapMeshBuilder {
  readonly root = new Group();
  readonly tideEdges = new TideEdgeLayer();
  private water: Mesh | null = null;
  private landMeshes: InstancedMesh[] = [];
  private overlayMeshes: InstancedMesh[] = [];
  private tideAnimInstances: TideAnimInstance[] = [];
  private waterCaps: InstancedMesh | null = null;
  private coralMesh: InstancedMesh | null = null;
  private coralTiles: TileInstance[] = [];
  private coralSubmerged: Uint8Array = new Uint8Array(0);
  private mapKey: string | null = null;

  constructor() {
    this.root.add(this.tideEdges.root);
  }

  build(map: WorldMap, tide: TideState | null): void {
    const nextKey = `${map.widthTiles}x${map.heightTiles}:${coralParkLandElevationKey()}`;
    if (this.mapKey === nextKey) {
      return;
    }
    this.destroy();

    const waterMaterial = new MeshStandardMaterial({
      color: paletteHex(TILE_PALETTE.deepWater),
      roughness: 0.85,
      metalness: 0.05,
    });
    this.water = new Mesh(new PlaneGeometry(map.widthTiles, map.heightTiles), waterMaterial);
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.set(map.widthTiles / 2, 0, map.heightTiles / 2);
    this.water.receiveShadow = true;
    this.root.add(this.water);

    const landGroups = groupInstancesByColor(map, true);
    this.landMeshes = buildInstancedLayer(landGroups, map, [], {
      landElevation: true,
      flatHeight: OVERLAY_TILE_HEIGHT,
      flatCenterY: OVERLAY_TILE_CENTER_Y,
    });
    for (const mesh of this.landMeshes) {
      this.root.add(mesh);
    }

    this.rebuildOverlay(map, tide);
    this.mapKey = nextKey;
  }

  rebuildOverlay(map: WorldMap, tide: TideState | null): void {
    for (const mesh of this.overlayMeshes) {
      this.root.remove(mesh);
    }
    disposeMeshes(this.overlayMeshes);
    this.overlayMeshes = [];

    if (this.waterCaps) {
      this.root.remove(this.waterCaps);
      this.waterCaps.geometry.dispose();
      (this.waterCaps.material as MeshStandardMaterial).dispose();
      this.waterCaps = null;
    }
    if (this.coralMesh) {
      this.root.remove(this.coralMesh);
      this.coralMesh.geometry.dispose();
      (this.coralMesh.material as MeshStandardMaterial).dispose();
      this.coralMesh = null;
    }

    this.tideAnimInstances = [];
    const overlayGroups = groupInstancesByColor(map, false);
    this.overlayMeshes = buildInstancedLayer(overlayGroups, map, this.tideAnimInstances, {
      landElevation: false,
      flatHeight: OVERLAY_TILE_HEIGHT,
      flatCenterY: OVERLAY_TILE_CENTER_Y,
    });
    for (const mesh of this.overlayMeshes) {
      this.root.add(mesh);
    }

    this.buildCoralMesh(map);

    if (this.tideAnimInstances.length > 0) {
      this.waterCaps = new InstancedMesh(
        new BoxGeometry(1, 1, 1),
        new MeshStandardMaterial({
          color: paletteHex(TILE_PALETTE.shallow),
          transparent: true,
          opacity: 0.62,
          roughness: 0.35,
          metalness: 0.1,
        }),
        this.tideAnimInstances.length,
      );
      this.waterCaps.count = 0;
      this.root.add(this.waterCaps);
    }

    this.updateTideVisuals(map, tide);
  }

  private buildCoralMesh(map: WorldMap): void {
    this.coralTiles = collectCoralTiles(map);
    this.coralSubmerged = new Uint8Array(this.coralTiles.length).fill(255);
    if (this.coralTiles.length === 0) {
      return;
    }

    const mesh = new InstancedMesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff }),
      this.coralTiles.length,
    );
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    for (let i = 0; i < this.coralTiles.length; i += 1) {
      const { tx, ty } = this.coralTiles[i];
      MATRIX.makeScale(1, OVERLAY_TILE_HEIGHT, 1);
      MATRIX.setPosition(tx + 0.5, OVERLAY_TILE_CENTER_Y, ty + 0.5);
      mesh.setMatrixAt(i, MATRIX);
      mesh.setColorAt(i, CORAL_EXPOSED_COLOR);
      this.tideAnimInstances.push({
        tx,
        ty,
        mesh,
        index: i,
        baseCenterY: OVERLAY_TILE_CENTER_Y,
        tileHeight: OVERLAY_TILE_HEIGHT,
      });
    }
    mesh.instanceMatrix.needsUpdate = true;

    this.coralMesh = mesh;
    this.root.add(mesh);
  }

  private updateCoralColors(tide: TideState | null): void {
    if (!this.coralMesh) {
      return;
    }
    let dirty = false;
    for (let i = 0; i < this.coralTiles.length; i += 1) {
      const { tx, ty } = this.coralTiles[i];
      const variant = resolveRenderTileVariant('coral_rideable', tx + 0.5, ty + 0.5, tide);
      const submerged = variant === 'reef_submerged' ? 1 : 0;
      if (this.coralSubmerged[i] !== submerged) {
        this.coralSubmerged[i] = submerged;
        this.coralMesh.setColorAt(i, submerged ? CORAL_SUBMERGED_COLOR : CORAL_EXPOSED_COLOR);
        dirty = true;
      }
    }
    if (dirty && this.coralMesh.instanceColor) {
      this.coralMesh.instanceColor.needsUpdate = true;
    }
  }

  updateTideVisuals(map: WorldMap, tide: TideState | null): void {
    void map;

    this.updateCoralColors(tide);

    for (const ref of this.tideAnimInstances) {
      const worldX = ref.tx + 0.5;
      const worldY = ref.ty + 0.5;
      const waveTop = tide ? tideWaveSurfaceY(worldX, worldY, tide) : 0;
      const floodFactor = TIDE_LEADING_WASH_HEIGHT > 0 ? waveTop / TIDE_LEADING_WASH_HEIGHT : 0;
      const sink = floodFactor * TIDE_REEF_SINK_Y;
      const centerY = ref.baseCenterY - sink;
      MATRIX.makeScale(1, ref.tileHeight, 1);
      MATRIX.setPosition(ref.tx + 0.5, centerY, ref.ty + 0.5);
      ref.mesh.setMatrixAt(ref.index, MATRIX);
      ref.mesh.instanceMatrix.needsUpdate = true;
    }

    if (this.waterCaps) {
      let capCount = 0;
      for (let i = 0; i < this.tideAnimInstances.length; i += 1) {
        const ref = this.tideAnimInstances[i];
        const worldX = ref.tx + 0.5;
        const worldY = ref.ty + 0.5;
        const waterTop = tide ? tideWaveSurfaceY(worldX, worldY, tide) : 0;
        if (waterTop < 0.08) {
          continue;
        }
        const floodFactor = TIDE_LEADING_WASH_HEIGHT > 0 ? waterTop / TIDE_LEADING_WASH_HEIGHT : 0;
        const reefBottom = ref.baseCenterY - ref.tileHeight / 2 - floodFactor * TIDE_REEF_SINK_Y;
        const columnHeight = Math.max(TIDE_WATER_COLUMN_MIN_HEIGHT, waterTop - reefBottom);
        const columnCenterY = reefBottom + columnHeight / 2;
        MATRIX.makeScale(1, columnHeight, 1);
        MATRIX.setPosition(ref.tx + 0.5, columnCenterY, ref.ty + 0.5);
        this.waterCaps.setMatrixAt(capCount, MATRIX);
        capCount += 1;
      }
      this.waterCaps.count = capCount;
      this.waterCaps.instanceMatrix.needsUpdate = true;
      this.waterCaps.visible = capCount > 0;
    }

    this.tideEdges.sync(tide);
  }

  setWaterScroll(scrollX: number, scrollY: number): void {
    if (!this.water) {
      return;
    }
    const material = this.water.material as MeshStandardMaterial;
    material.map = null;
    void scrollX;
    void scrollY;
  }

  destroy(): void {
    if (this.water) {
      this.water.geometry.dispose();
      (this.water.material as MeshStandardMaterial).dispose();
      this.root.remove(this.water);
      this.water = null;
    }
    for (const mesh of this.landMeshes) {
      this.root.remove(mesh);
    }
    disposeMeshes(this.landMeshes);
    this.landMeshes = [];
    for (const mesh of this.overlayMeshes) {
      this.root.remove(mesh);
    }
    disposeMeshes(this.overlayMeshes);
    this.overlayMeshes = [];
    if (this.waterCaps) {
      this.root.remove(this.waterCaps);
      this.waterCaps.geometry.dispose();
      (this.waterCaps.material as MeshStandardMaterial).dispose();
      this.waterCaps = null;
    }
    if (this.coralMesh) {
      this.root.remove(this.coralMesh);
      this.coralMesh.geometry.dispose();
      (this.coralMesh.material as MeshStandardMaterial).dispose();
      this.coralMesh = null;
    }
    this.coralTiles = [];
    this.coralSubmerged = new Uint8Array(0);
    this.tideAnimInstances = [];
    this.tideEdges.sync(null);
    this.mapKey = null;
  }
}

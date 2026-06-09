import {
  TIDE_LEADING_WASH_HEIGHT,
  TIDE_REEF_SINK_Y,
  tideWaveSurfaceY,
  type TideState,
  type TileType,
  type WorldMap,
} from '@osrs-surfing/engine';
import {
  BoxGeometry,
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

const LAND_TILE_HEIGHT = 0.12;
const LAND_TILE_CENTER_Y = LAND_TILE_HEIGHT / 2;
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

function groupInstancesByColor(
  map: WorldMap,
  tide: TideState | null,
  includeLand: boolean,
): Map<number, TileInstance[]> {
  const groups = new Map<number, TileInstance[]>();

  for (let ty = 0; ty < map.heightTiles; ty += 1) {
    for (let tx = 0; tx < map.widthTiles; tx += 1) {
      const tile = map.tiles[ty][tx];
      let color: number | null = null;

      if (includeLand && (tile === 'grass' || tile === 'sand')) {
        color = renderVariantColor(tile);
      } else if (!includeLand && tile !== 'deep_water' && tile !== 'grass' && tile !== 'sand') {
        const variant = resolveRenderTileVariant(tile, tx + 0.5, ty + 0.5, tide);
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

function buildInstancedLayer(
  groups: Map<number, TileInstance[]>,
  tileHeight: number,
  centerY: number,
  map: WorldMap,
  tideAnimInstances: TideAnimInstance[],
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
  private mapKey: string | null = null;

  constructor() {
    this.root.add(this.tideEdges.root);
  }

  build(map: WorldMap, tide: TideState | null): void {
    if (this.mapKey === `${map.widthTiles}x${map.heightTiles}`) {
      this.updateTideVisuals(map, tide);
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

    const landGroups = groupInstancesByColor(map, tide, true);
    this.landMeshes = buildInstancedLayer(
      landGroups,
      LAND_TILE_HEIGHT,
      LAND_TILE_CENTER_Y,
      map,
      [],
    );
    for (const mesh of this.landMeshes) {
      this.root.add(mesh);
    }

    this.rebuildOverlay(map, tide);
    this.mapKey = `${map.widthTiles}x${map.heightTiles}`;
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

    this.tideAnimInstances = [];
    const overlayGroups = groupInstancesByColor(map, tide, false);
    this.overlayMeshes = buildInstancedLayer(
      overlayGroups,
      OVERLAY_TILE_HEIGHT,
      OVERLAY_TILE_CENTER_Y,
      map,
      this.tideAnimInstances,
    );
    for (const mesh of this.overlayMeshes) {
      this.root.add(mesh);
    }

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

  updateTideVisuals(map: WorldMap, tide: TideState | null): void {
    void map;

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
    this.tideAnimInstances = [];
    this.tideEdges.sync(null);
    this.mapKey = null;
  }
}

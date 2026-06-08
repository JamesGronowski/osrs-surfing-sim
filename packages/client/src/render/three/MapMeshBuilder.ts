import type { TideState, WorldMap } from '@osrs-surfing/engine';
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

const LAND_TILE_HEIGHT = 0.12;
const LAND_TILE_CENTER_Y = LAND_TILE_HEIGHT / 2;
const OVERLAY_TILE_HEIGHT = 0.06;
const OVERLAY_TILE_CENTER_Y = OVERLAY_TILE_HEIGHT / 2;

const MATRIX = new Matrix4();

type TileInstance = { tx: number; ty: number };

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
      MATRIX.makeScale(1, tileHeight, 1);
      MATRIX.setPosition(tx + 0.5, centerY, ty + 0.5);
      mesh.setMatrixAt(i, MATRIX);
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
  private water: Mesh | null = null;
  private landMeshes: InstancedMesh[] = [];
  private overlayMeshes: InstancedMesh[] = [];
  private mapKey: string | null = null;

  build(map: WorldMap, tide: TideState | null): void {
    if (this.mapKey === `${map.widthTiles}x${map.heightTiles}`) {
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
    this.landMeshes = buildInstancedLayer(landGroups, LAND_TILE_HEIGHT, LAND_TILE_CENTER_Y);
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

    const overlayGroups = groupInstancesByColor(map, tide, false);
    this.overlayMeshes = buildInstancedLayer(
      overlayGroups,
      OVERLAY_TILE_HEIGHT,
      OVERLAY_TILE_CENTER_Y,
    );
    for (const mesh of this.overlayMeshes) {
      this.root.add(mesh);
    }
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
    this.mapKey = null;
  }
}

import { Container, Graphics, TilingSprite } from 'pixi.js';

import type { TideState, WorldMap } from '@osrs-surfing/engine';

import { resolveRenderTileVariant } from './tileAppearance.js';
import { type TileTextureSet } from './tileTextures.js';
import { TILE_TEXTURE_SIZE, tiledFillMatrix } from './tileTextures.js';

export class MapLayerStack {
  readonly root = new Container();
  private ocean: TilingSprite | null = null;
  private overlay: Graphics | null = null;
  private land: Graphics | null = null;

  constructor(
    private readonly tileSizePx: number,
    private readonly textures: TileTextureSet,
  ) {}

  build(map: WorldMap, tide: TideState | null): void {
    this.destroyLayers();

    const mapWidthPx = map.widthTiles * this.tileSizePx;
    const mapHeightPx = map.heightTiles * this.tileSizePx;
    const textureScale = this.tileSizePx / TILE_TEXTURE_SIZE;

    this.ocean = new TilingSprite({
      texture: this.textures.textureFor('deep_water'),
      width: mapWidthPx,
      height: mapHeightPx,
    });
    this.ocean.tileScale.set(textureScale, textureScale);

    this.overlay = new Graphics();
    this.rebuildOverlay(map, tide);

    this.land = this.buildLand(map);

    this.root.addChild(this.ocean, this.overlay, this.land);
  }

  setOceanScroll(scrollX: number, scrollY: number): void {
    if (!this.ocean) {
      return;
    }
    const textureScale = this.tileSizePx / TILE_TEXTURE_SIZE;
    this.ocean.tilePosition.set(-scrollX * textureScale, -scrollY * textureScale);
  }

  rebuildOverlay(map: WorldMap, tide: TideState | null): void {
    if (!this.overlay) {
      return;
    }
    this.overlay.clear();

    for (let ty = 0; ty < map.heightTiles; ty += 1) {
      for (let tx = 0; tx < map.widthTiles; tx += 1) {
        const tile = map.tiles[ty][tx];
        if (tile === 'deep_water' || tile === 'grass' || tile === 'sand') {
          continue;
        }
        const variant = resolveRenderTileVariant(tile, tx + 0.5, ty + 0.5, tide);
        const x = tx * this.tileSizePx;
        const y = ty * this.tileSizePx;
        this.overlay.rect(x, y, this.tileSizePx, this.tileSizePx).fill({
          texture: this.textures.textureFor(variant),
          matrix: tiledFillMatrix(x, y, this.tileSizePx, 0, 0),
        });
      }
    }
  }

  destroy(): void {
    this.destroyLayers();
    this.root.destroy({ children: true });
  }

  private buildLand(map: WorldMap): Graphics {
    const land = new Graphics();
    for (let ty = 0; ty < map.heightTiles; ty += 1) {
      for (let tx = 0; tx < map.widthTiles; tx += 1) {
        const tile = map.tiles[ty][tx];
        if (tile !== 'grass' && tile !== 'sand') {
          continue;
        }
        const x = tx * this.tileSizePx;
        const y = ty * this.tileSizePx;
        land.rect(x, y, this.tileSizePx, this.tileSizePx).fill({
          texture: this.textures.textureFor(tile),
          matrix: tiledFillMatrix(x, y, this.tileSizePx, 0, 0),
        });
      }
    }
    return land;
  }

  private destroyLayers(): void {
    this.ocean?.destroy();
    this.overlay?.destroy();
    this.land?.destroy();
    this.ocean = null;
    this.overlay = null;
    this.land = null;
    this.root.removeChildren();
  }
}

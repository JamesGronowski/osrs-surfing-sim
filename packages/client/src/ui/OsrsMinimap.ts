import type { SimulationSnapshot, WorldMap } from '@osrs-surfing/engine';

import { renderVariantColor, resolveRenderTileVariant } from '../render/tileAppearance.js';

const MINIMAP_SIZE = 146;

export class OsrsMinimap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(root: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = MINIMAP_SIZE;
    this.canvas.height = MINIMAP_SIZE;
    this.canvas.className = 'osrs-minimap-canvas';
    root.appendChild(this.canvas);
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Minimap canvas unsupported');
    }
    this.ctx = ctx;
  }

  update(snapshot: SimulationSnapshot, map: WorldMap): void {
    const ctx = this.ctx;
    const scaleX = MINIMAP_SIZE / map.widthTiles;
    const scaleY = MINIMAP_SIZE / map.heightTiles;

    for (let ty = 0; ty < map.heightTiles; ty += 1) {
      for (let tx = 0; tx < map.widthTiles; tx += 1) {
        const tile = map.tiles[ty][tx];
        const variant = resolveRenderTileVariant(tile, tx + 0.5, ty + 0.5, snapshot.tide);
        const color = renderVariantColor(variant);
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fillRect(tx * scaleX, ty * scaleY, Math.ceil(scaleX), Math.ceil(scaleY));
      }
    }

    const px = snapshot.surfboard.position.x * scaleX;
    const py = snapshot.surfboard.position.y * scaleY;

    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

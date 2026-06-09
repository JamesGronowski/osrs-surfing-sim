import type { SimulationSnapshot, WorldMap } from '@osrs-surfing/engine';

import { renderVariantColor, resolveRenderTileVariant } from '../render/tileAppearance.js';
import { MINIMAP_MAP_SIZE } from './minimapLayout.js';
import { OSRS_ASSETS } from './osrsAssets.js';

export class OsrsMinimap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private compassNeedle: HTMLImageElement;

  constructor(
    mapRoot: HTMLElement,
    compassButton: HTMLButtonElement,
    frameImage: HTMLImageElement,
    onCompassClick: () => void,
  ) {
    frameImage.src = OSRS_ASSETS.fixed.minimapFrame;
    frameImage.alt = '';
    frameImage.decoding = 'async';

    this.canvas = document.createElement('canvas');
    this.canvas.width = MINIMAP_MAP_SIZE;
    this.canvas.height = MINIMAP_MAP_SIZE;
    this.canvas.className = 'osrs-minimap-canvas';
    mapRoot.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Minimap canvas unsupported');
    }
    this.ctx = ctx;

    const needle = compassButton.querySelector('img');
    if (!needle) {
      throw new Error('Minimap compass needle missing');
    }
    this.compassNeedle = needle;
    this.compassNeedle.src = OSRS_ASSETS.fixed.compassNeedle;
    this.compassNeedle.alt = 'Compass';

    compassButton.addEventListener('click', onCompassClick);
  }

  setCompassRotation(radians: number): void {
    const degrees = (radians * 180) / Math.PI;
    this.compassNeedle.style.transform = `rotate(${degrees}deg)`;
  }

  update(snapshot: SimulationSnapshot, map: WorldMap): void {
    const ctx = this.ctx;
    const size = MINIMAP_MAP_SIZE;
    const radius = size / 2;
    const scaleX = size / map.widthTiles;
    const scaleY = size / map.heightTiles;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.clip();

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

    ctx.restore();
  }
}

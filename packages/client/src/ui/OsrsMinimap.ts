import {
  TIDE_LEADING_WASH_HEIGHT,
  tideWaveSurfaceAtAngle,
  type SimulationSnapshot,
  type TideState,
  type WorldMap,
} from '@osrs-surfing/engine';

import { renderVariantColor, resolveRenderTileVariant } from '../render/tileAppearance.js';
import { bindUiPress } from './bindUiPress.js';
import { MINIMAP_MAP_SIZE } from './minimapLayout.js';
import { OSRS_ASSETS } from './osrsAssets.js';

interface CoralTile {
  tx: number;
  ty: number;
  angle: number;
}

/** Flood share where coral flips to its submerged colour (resolveRenderTileVariant). */
const CORAL_SUBMERGE_FLOOD = 0.35;
/** Repaint the tide overlay once the phase has advanced this far (≈ once a tick). */
const TIDE_REPAINT_PHASE_DELTA = 0.04;

export class OsrsMinimap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private compassNeedle: HTMLImageElement;
  private baseCanvas: HTMLCanvasElement | null = null;
  private tideCanvas: HTMLCanvasElement | null = null;
  private tideCtx: CanvasRenderingContext2D | null = null;
  private lastTidePhase = Number.NaN;
  private baseMap: WorldMap | null = null;
  private coralTiles: CoralTile[] = [];

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
    this.compassNeedle.src = OSRS_ASSETS.fixed.compassDial;
    this.compassNeedle.alt = 'Compass';

    bindUiPress(compassButton, onCompassClick);
  }

  setCompassRotation(radians: number): void {
    const degrees = (radians * 180) / Math.PI;
    this.compassNeedle.style.transform = `rotate(${degrees}deg)`;
  }

  /** Pre-renders all static tiles once; only coral flips color with the tide. */
  private ensureBaseCanvas(map: WorldMap): void {
    if (this.baseMap === map && this.baseCanvas) {
      return;
    }
    const size = MINIMAP_MAP_SIZE;
    const base = document.createElement('canvas');
    base.width = size;
    base.height = size;
    const ctx = base.getContext('2d');
    if (!ctx) {
      throw new Error('Minimap base canvas unsupported');
    }

    const scaleX = size / map.widthTiles;
    const scaleY = size / map.heightTiles;
    this.coralTiles = [];

    for (let ty = 0; ty < map.heightTiles; ty += 1) {
      for (let tx = 0; tx < map.widthTiles; tx += 1) {
        const tile = map.tiles[ty][tx];
        let variant = resolveRenderTileVariant(tile, tx + 0.5, ty + 0.5, null);
        if (tile === 'coral_rideable') {
          this.coralTiles.push({ tx, ty, angle: Number.NaN });
          variant = 'reef_exposed';
        }
        const color = renderVariantColor(variant);
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fillRect(tx * scaleX, ty * scaleY, Math.ceil(scaleX), Math.ceil(scaleY));
      }
    }

    this.baseCanvas = base;
    const tideCanvas = document.createElement('canvas');
    tideCanvas.width = size;
    tideCanvas.height = size;
    this.tideCanvas = tideCanvas;
    this.tideCtx = tideCanvas.getContext('2d');
    this.lastTidePhase = Number.NaN;
    this.baseMap = map;
  }

  /** Submerged-coral overlay; repainted only when the tide has moved a tick's worth. */
  private repaintTideOverlay(tide: TideState, map: WorldMap): void {
    const ctx = this.tideCtx;
    if (!ctx) {
      return;
    }
    const phaseDelta = Math.abs(tide.phaseRadians - this.lastTidePhase);
    if (phaseDelta < TIDE_REPAINT_PHASE_DELTA) {
      return;
    }
    this.lastTidePhase = tide.phaseRadians;

    const size = MINIMAP_MAP_SIZE;
    const scaleX = size / map.widthTiles;
    const scaleY = size / map.heightTiles;
    ctx.clearRect(0, 0, size, size);
    const submergedColor = renderVariantColor('reef_submerged');
    ctx.fillStyle = `#${submergedColor.toString(16).padStart(6, '0')}`;

    for (const coral of this.coralTiles) {
      if (Number.isNaN(coral.angle)) {
        coral.angle = Math.atan2(coral.ty + 0.5 - tide.centerY, coral.tx + 0.5 - tide.centerX);
      }
      const flood = tideWaveSurfaceAtAngle(coral.angle, tide) / TIDE_LEADING_WASH_HEIGHT;
      if (flood > CORAL_SUBMERGE_FLOOD) {
        ctx.fillRect(coral.tx * scaleX, coral.ty * scaleY, Math.ceil(scaleX), Math.ceil(scaleY));
      }
    }
  }

  update(snapshot: SimulationSnapshot, map: WorldMap): void {
    this.ensureBaseCanvas(map);
    if (snapshot.tide) {
      this.repaintTideOverlay(snapshot.tide, map);
    }

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

    if (this.baseCanvas) {
      ctx.drawImage(this.baseCanvas, 0, 0);
    }
    if (this.tideCanvas) {
      ctx.drawImage(this.tideCanvas, 0, 0);
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

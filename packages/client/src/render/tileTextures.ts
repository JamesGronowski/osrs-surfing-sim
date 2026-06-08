import { Matrix, Texture } from 'pixi.js';

import type { RenderTileVariant } from './tileAppearance.js';
import { REEF_CORAL_PINK, REEF_CORAL_ROSE } from './tilePalette.js';

export const TILE_TEXTURE_SIZE = 32;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface WaterPaintOptions {
  base: Rgb;
  band: Rgb;
  highlight: Rgb;
  shadow: Rgb;
  sparkle: Rgb;
  tint?: Rgb;
  tintAlpha?: number;
  sparkles?: boolean;
}

const SPARKLE_COORDS: ReadonlyArray<readonly [number, number]> = [
  [4, 6],
  [13, 2],
  [21, 9],
  [8, 17],
  [24, 22],
  [16, 27],
  [28, 14],
  [2, 24],
  [11, 12],
  [19, 19],
  [26, 5],
  [6, 29],
];

function rgb(hex: number): Rgb {
  return {
    r: (hex >> 16) & 0xff,
    g: (hex >> 8) & 0xff,
    b: hex & 0xff,
  };
}

function css({ r, g, b }: Rgb): string {
  return `rgb(${r},${g},${b})`;
}

function blend(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function paintOsrsWater(
  ctx: CanvasRenderingContext2D,
  size: number,
  options: WaterPaintOptions,
): void {
  const { base, band, highlight, shadow, sparkle, tint, tintAlpha, sparkles = true } = options;

  ctx.fillStyle = css(base);
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = css(band);
  ctx.globalAlpha = sparkles ? 0.28 : 0.18;
  ctx.lineWidth = 1;
  for (let i = -size; i < size * 2; i += 5) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (sparkles) {
    ctx.fillStyle = css(shadow);
    ctx.globalAlpha = 0.22;
    ctx.fillRect(3, 20, 9, 5);
    ctx.fillRect(18, 8, 7, 4);
    ctx.fillRect(22, 24, 6, 5);
    ctx.globalAlpha = 1;

    for (const [x, y] of SPARKLE_COORDS) {
      ctx.fillStyle = css(sparkle);
      ctx.fillRect(x, y, 1, 1);
      if ((x + y) % 4 === 0) {
        ctx.fillStyle = css(highlight);
        ctx.fillRect(x, y - 1, 1, 3);
        ctx.fillRect(x - 1, y, 3, 1);
      }
    }
  }

  if (tint !== undefined && tintAlpha !== undefined && tintAlpha > 0) {
    ctx.fillStyle = css(tint);
    ctx.globalAlpha = tintAlpha;
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 1;
  }
}

function paintSand(ctx: CanvasRenderingContext2D, size: number): void {
  const base = rgb(0xc9b07a);
  const dark = blend(base, rgb(0x8a7048), 0.35);
  const light = blend(base, rgb(0xe8d4a0), 0.4);

  ctx.fillStyle = css(base);
  ctx.fillRect(0, 0, size, size);

  const specks: Array<readonly [number, number, Rgb]> = [
    [5, 4, dark],
    [12, 9, light],
    [20, 6, dark],
    [8, 18, light],
    [17, 15, dark],
    [25, 22, light],
    [10, 26, dark],
    [22, 28, light],
  ];
  for (const [x, y, color] of specks) {
    ctx.fillStyle = css(color);
    ctx.fillRect(x, y, 2, 2);
  }
}

function paintGrass(ctx: CanvasRenderingContext2D, size: number): void {
  const base = rgb(0x4d8a3c);
  const dark = blend(base, rgb(0x2f5c24), 0.3);
  const light = blend(base, rgb(0x6eb058), 0.35);

  ctx.fillStyle = css(base);
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 14; i += 1) {
    const x = (i * 7 + 3) % size;
    const y = (i * 5 + 2) % size;
    ctx.fillStyle = css(i % 2 === 0 ? dark : light);
    ctx.fillRect(x, y, 2, 2);
  }
}

function createTexture(paint: (ctx: CanvasRenderingContext2D, size: number) => void): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_TEXTURE_SIZE;
  canvas.height = TILE_TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D unsupported');
  }
  paint(ctx, TILE_TEXTURE_SIZE);
  const texture = Texture.from(canvas);
  texture.source.style.addressMode = 'repeat';
  return texture;
}

const DEEP_WATER = rgb(0x286890);
const SHALLOW_WATER = rgb(0x3a88a8);

export class TileTextureSet {
  readonly variants: Record<RenderTileVariant, Texture>;

  constructor() {
    this.variants = {
      deep_water: createTexture((ctx, size) =>
        paintOsrsWater(ctx, size, {
          base: DEEP_WATER,
          band: blend(DEEP_WATER, rgb(0x4a9cc4), 0.35),
          highlight: rgb(0x7ec8e8),
          shadow: blend(DEEP_WATER, rgb(0x173f58), 0.45),
          sparkle: rgb(0x9ad8f0),
          sparkles: false,
        }),
      ),
      shallow: createTexture((ctx, size) =>
        paintOsrsWater(ctx, size, {
          base: SHALLOW_WATER,
          band: blend(SHALLOW_WATER, rgb(0x5eb0d0), 0.4),
          highlight: rgb(0x9ee4f8),
          shadow: blend(SHALLOW_WATER, rgb(0x286880), 0.35),
          sparkle: rgb(0xc8f0ff),
        }),
      ),
      reef_exposed: createTexture((ctx, size) =>
        paintOsrsWater(ctx, size, {
          base: blend(DEEP_WATER, rgb(REEF_CORAL_ROSE), 0.14),
          band: blend(DEEP_WATER, rgb(0x6a9cb8), 0.28),
          highlight: rgb(0x9ad4ec),
          shadow: blend(DEEP_WATER, rgb(0x1a4a62), 0.38),
          sparkle: rgb(0xc0ecf8),
          tint: rgb(REEF_CORAL_PINK),
          tintAlpha: 0.19,
        }),
      ),
      reef_submerged: createTexture((ctx, size) =>
        paintOsrsWater(ctx, size, {
          base: blend(DEEP_WATER, rgb(REEF_CORAL_ROSE), 0.04),
          band: blend(DEEP_WATER, rgb(0x4a9cc4), 0.3),
          highlight: rgb(0x7ec8e8),
          shadow: blend(DEEP_WATER, rgb(0x173f58), 0.42),
          sparkle: rgb(0x94d4ec),
          tint: rgb(REEF_CORAL_PINK),
          tintAlpha: 0.065,
        }),
      ),
      sand: createTexture(paintSand),
      grass: createTexture(paintGrass),
      coral_solid: createTexture((ctx, size) => {
        paintOsrsWater(ctx, size, {
          base: blend(DEEP_WATER, rgb(0x6a4a58), 0.55),
          band: rgb(0x7a5a68),
          highlight: rgb(0x9a7a88),
          shadow: rgb(0x4a3040),
          sparkle: rgb(0xb09098),
        });
      }),
      tide_zone: createTexture((ctx, size) =>
        paintOsrsWater(ctx, size, {
          base: blend(DEEP_WATER, rgb(0x3488a8), 0.5),
          band: rgb(0x4a9cc0),
          highlight: rgb(0x88d8f0),
          shadow: blend(DEEP_WATER, rgb(0x1a5068), 0.4),
          sparkle: rgb(0xb0ecff),
        }),
      ),
    };
  }

  textureFor(variant: RenderTileVariant): Texture {
    return this.variants[variant];
  }
}

export function tiledFillMatrix(
  screenX: number,
  screenY: number,
  tileSizePx: number,
  scrollX: number,
  scrollY: number,
): Matrix {
  const scale = tileSizePx / TILE_TEXTURE_SIZE;
  const matrix = new Matrix();
  matrix.scale(scale, scale);
  matrix.translate(screenX - scrollX, screenY - scrollY);
  return matrix;
}

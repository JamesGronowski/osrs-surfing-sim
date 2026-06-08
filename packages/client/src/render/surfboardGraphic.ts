import { Graphics } from 'pixi.js';

const BOARD_LENGTH_RATIO = 0.9;
const BOARD_WIDTH_RATIO = 0.28;
const BOARD_WOOD = 0xc9a66b;
const BOARD_STRIPE = 0xe8d4a8;
const BOARD_OUTLINE = 0x6b4a2a;
const BOARD_FIN = 0x8b6914;

export function drawSurfboardShape(graphic: Graphics, tileSizePx: number, beached: boolean): void {
  const length = tileSizePx * BOARD_LENGTH_RATIO;
  const width = tileSizePx * BOARD_WIDTH_RATIO;
  const halfLen = length / 2;
  const halfWid = width / 2;

  graphic.clear();

  if (beached) {
    graphic.roundRect(-halfLen, -halfWid, length, width, 3).fill(BOARD_WOOD);
    graphic.roundRect(-halfLen, -halfWid, length, width, 3).stroke({
      color: BOARD_OUTLINE,
      width: 2,
    });
    graphic
      .roundRect(-halfLen * 0.15, -halfWid * 0.35, length * 0.55, width * 0.35, 2)
      .fill(BOARD_STRIPE);
    graphic
      .moveTo(halfLen * 0.55, halfWid * 0.5)
      .lineTo(halfLen * 0.7, halfWid * 0.9)
      .lineTo(halfLen * 0.45, halfWid * 0.55)
      .closePath()
      .fill(BOARD_FIN);
    return;
  }

  graphic.roundRect(-halfLen, -halfWid, length, width, 4).fill(BOARD_WOOD);
  graphic.roundRect(-halfLen, -halfWid, length, width, 4).stroke({
    color: BOARD_OUTLINE,
    width: 2,
  });
  graphic
    .roundRect(-halfLen * 0.1, -halfWid * 0.3, length * 0.5, width * 0.3, 2)
    .fill(BOARD_STRIPE);
  graphic
    .moveTo(-halfLen * 0.75, halfWid * 0.45)
    .lineTo(-halfLen * 0.9, halfWid * 0.85)
    .lineTo(-halfLen * 0.6, halfWid * 0.5)
    .closePath()
    .fill(BOARD_FIN);
}

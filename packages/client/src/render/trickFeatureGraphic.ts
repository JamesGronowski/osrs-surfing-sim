import { Graphics } from 'pixi.js';

import type { TrickFeatureType, TrickZone } from '@osrs-surfing/engine';

const SUBMERGED_ALPHA = 0.42;
const TRICKED_ALPHA = 0.42;
const APPROACH_CHEVRON_COLOR = 0xfff566;

type StrokeStyle = NonNullable<Parameters<Graphics['stroke']>[0]>;

function strokeSegment(
  g: Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: StrokeStyle,
): void {
  g.poly([x1, y1, x2, y2]).stroke(style);
}

function rotateLocal(lx: number, ly: number, rotation: number): { x: number; y: number } {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return { x: lx * cos - ly * sin, y: lx * sin + ly * cos };
}

function toWorld(
  cx: number,
  cy: number,
  lx: number,
  ly: number,
  rotation: number,
): { x: number; y: number } {
  const rotated = rotateLocal(lx, ly, rotation);
  return { x: cx + rotated.x, y: cy + rotated.y };
}

function fillPoly(
  g: Graphics,
  cx: number,
  cy: number,
  localPoints: number[],
  rotation: number,
  color: number,
  alpha: number,
): void {
  const world: number[] = [];
  for (let i = 0; i < localPoints.length; i += 2) {
    const p = toWorld(cx, cy, localPoints[i], localPoints[i + 1], rotation);
    world.push(p.x, p.y);
  }
  g.poly(world).fill({ color, alpha });
}

function fillLocalRoundRect(
  g: Graphics,
  cx: number,
  cy: number,
  lx: number,
  ly: number,
  w: number,
  h: number,
  radius: number,
  rotation: number,
  color: number,
  alpha: number,
): void {
  const corners = [
    [lx, ly],
    [lx + w, ly],
    [lx + w, ly + h],
    [lx, ly + h],
  ];
  const world: number[] = [];
  for (const [px, py] of corners) {
    const p = toWorld(cx, cy, px, py, rotation);
    world.push(p.x, p.y);
  }
  g.poly(world).fill({ color, alpha });
  void radius;
}

function tunnelArchLocal(baseY: number, radius: number): number[] {
  const points: number[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i += 1) {
    const angle = Math.PI + (Math.PI * i) / steps;
    points.push(Math.cos(angle) * radius, baseY + Math.sin(angle) * radius);
  }
  return points;
}

function paletteFor(
  type: TrickFeatureType,
  tricked: boolean,
): { base: number; accent: number; approach: number } {
  if (tricked) {
    return { base: 0x555555, accent: 0x444444, approach: 0x888888 };
  }
  switch (type) {
    case 'rail':
      return { base: 0xf4a7b9, accent: 0xf4c542, approach: APPROACH_CHEVRON_COLOR };
    case 'tunnel':
      return { base: 0x9b6bff, accent: 0xc9b4ff, approach: APPROACH_CHEVRON_COLOR };
    case 'jump':
      return { base: 0xff8c42, accent: 0xffe066, approach: APPROACH_CHEVRON_COLOR };
    case 'brain_coral':
      return { base: 0xff6eb4, accent: 0xff9ed2, approach: APPROACH_CHEVRON_COLOR };
    case 'wall_ride':
      return { base: 0x6ec8ff, accent: 0xb8e6ff, approach: APPROACH_CHEVRON_COLOR };
    default:
      return { base: 0xf4a7b9, accent: 0xf4c542, approach: APPROACH_CHEVRON_COLOR };
  }
}

function drawApproachChevrons(
  g: Graphics,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
  color: number,
  alpha: number,
): void {
  const style = { color, width: Math.max(2, r * 0.08), alpha };
  for (const offset of [-0.72, -0.52, -0.32]) {
    const tip = toWorld(cx, cy, 0, r * offset + r * 0.22, rotation);
    const left = toWorld(cx, cy, -r * 0.22, r * offset, rotation);
    const right = toWorld(cx, cy, r * 0.22, r * offset, rotation);
    strokeSegment(g, left.x, left.y, tip.x, tip.y, style);
    strokeSegment(g, right.x, right.y, tip.x, tip.y, style);
  }
}

function drawRail(
  g: Graphics,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
  palette: ReturnType<typeof paletteFor>,
  alpha: number,
): void {
  fillLocalRoundRect(
    g,
    cx,
    cy,
    -r * 1.15,
    -r * 0.12,
    r * 2.3,
    r * 0.24,
    3,
    rotation,
    palette.base,
    alpha,
  );
  fillLocalRoundRect(
    g,
    cx,
    cy,
    -r * 0.18,
    -r * 0.22,
    r * 0.36,
    r * 0.44,
    2,
    rotation,
    palette.accent,
    alpha,
  );
  fillPoly(
    g,
    cx,
    cy,
    [-r * 1.15, -r * 0.12, r * 1.15, -r * 0.12, r * 1.05, r * 0.05, -r * 1.05, r * 0.05],
    rotation,
    palette.accent,
    alpha * 0.55,
  );
}

function drawTunnel(
  g: Graphics,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
  palette: ReturnType<typeof paletteFor>,
  alpha: number,
): void {
  const baseY = r * 0.2;
  fillLocalRoundRect(
    g,
    cx,
    cy,
    -r * 0.8,
    baseY,
    r * 1.6,
    r * 0.55,
    2,
    rotation,
    palette.base,
    alpha,
  );
  fillPoly(g, cx, cy, tunnelArchLocal(baseY, r * 0.8), rotation, palette.base, alpha);
  fillPoly(g, cx, cy, tunnelArchLocal(baseY, r * 0.45), rotation, palette.accent, alpha * 0.85);
}

function drawJump(
  g: Graphics,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
  palette: ReturnType<typeof paletteFor>,
  alpha: number,
): void {
  fillPoly(
    g,
    cx,
    cy,
    [-r * 0.95, r * 0.5, r * 0.95, r * 0.5, r * 0.2, -r * 0.95],
    rotation,
    palette.base,
    alpha,
  );
  fillPoly(
    g,
    cx,
    cy,
    [-r * 0.38, r * 0.5, r * 0.38, r * 0.5, 0, -r * 0.35],
    rotation,
    palette.accent,
    alpha * 0.9,
  );
  const lipA = toWorld(cx, cy, -r * 0.95, r * 0.5, rotation);
  const lipB = toWorld(cx, cy, r * 0.95, r * 0.5, rotation);
  strokeSegment(g, lipA.x, lipA.y, lipB.x, lipB.y, {
    color: palette.accent,
    width: Math.max(2, r * 0.06),
    alpha,
  });
}

function drawBrainCoral(
  g: Graphics,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
  palette: ReturnType<typeof paletteFor>,
  alpha: number,
): void {
  fillPoly(
    g,
    cx,
    cy,
    [
      -r * 0.7,
      -r * 0.2,
      -r * 0.5,
      -r * 0.75,
      0,
      -r * 0.95,
      r * 0.5,
      -r * 0.75,
      r * 0.7,
      -r * 0.2,
      r * 0.65,
      r * 0.35,
      0,
      r * 0.55,
      -r * 0.65,
      r * 0.35,
    ],
    rotation,
    palette.base,
    alpha,
  );
  fillPoly(
    g,
    cx,
    cy,
    [-r * 0.35, r * 0.05, 0, -r * 0.25, r * 0.35, r * 0.05],
    rotation,
    palette.accent,
    alpha * 0.8,
  );
}

function drawWallRide(
  g: Graphics,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
  palette: ReturnType<typeof paletteFor>,
  alpha: number,
): void {
  fillLocalRoundRect(
    g,
    cx,
    cy,
    -r * 0.15,
    -r * 0.85,
    r * 0.3,
    r * 1.7,
    2,
    rotation,
    palette.base,
    alpha,
  );
  fillLocalRoundRect(
    g,
    cx,
    cy,
    -r * 0.55,
    -r * 0.55,
    r * 1.1,
    r * 0.35,
    2,
    rotation,
    palette.accent,
    alpha,
  );
}

export function drawTrickFeature(
  g: Graphics,
  screenX: number,
  screenY: number,
  pixelRadius: number,
  zone: TrickZone,
  submerged: boolean,
): void {
  const r = pixelRadius;
  const rotation = zone.rotationRadians;
  const alpha = zone.tricked ? TRICKED_ALPHA : submerged ? SUBMERGED_ALPHA : 1;
  const palette = paletteFor(zone.type, zone.tricked);

  switch (zone.type) {
    case 'rail':
      drawRail(g, screenX, screenY, r, rotation, palette, alpha);
      break;
    case 'tunnel':
      drawTunnel(g, screenX, screenY, r, rotation, palette, alpha);
      break;
    case 'jump':
      drawJump(g, screenX, screenY, r, rotation, palette, alpha);
      break;
    case 'brain_coral':
      drawBrainCoral(g, screenX, screenY, r, rotation, palette, alpha);
      break;
    case 'wall_ride':
      drawWallRide(g, screenX, screenY, r, rotation, palette, alpha);
      break;
    default:
      drawRail(g, screenX, screenY, r, rotation, palette, alpha);
      break;
  }

  if (!zone.tricked) {
    drawApproachChevrons(g, screenX, screenY, r, rotation, palette.approach, submerged ? alpha : 1);
  }
}

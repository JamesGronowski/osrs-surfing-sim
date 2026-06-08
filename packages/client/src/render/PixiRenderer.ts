import { Application, Container, Graphics, Text } from 'pixi.js';

import {
  getTile,
  headingToDegrees,
  isTrickZoneSubmerged,
  normalizeAngle,
  type SimulationSnapshot,
  type WorldMap,
} from '@osrs-surfing/engine';

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from '../ui/fixedLayout.js';
import type { IRenderer, RenderSize } from './IRenderer.js';
import { drawSurfboardShape } from './surfboardGraphic.js';
import { drawTrickFeature } from './trickFeatureGraphic.js';
import { TILE_PALETTE } from './tilePalette.js';
import { MapLayerStack } from './mapLayers.js';
import { TileTextureSet } from './tileTextures.js';
import { waterTextureScroll } from './waterAnimation.js';

const CLICK_ARROW_RADIUS_TILES = 1.4;
const ARROW_ORBIT_RADIUS_TILES = 0.9;

type StrokeStyle = NonNullable<Parameters<Graphics['stroke']>[0]>;

/** Isolated segment — avoids Pixi v8 stitching paths from (0, 0). */
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

export class PixiRenderer implements IRenderer {
  private app: Application | null = null;
  private tileSizePx = 32;
  private worldContainer: Container | null = null;
  private boardGraphic: Graphics | null = null;
  private dockBoardGraphic: Graphics | null = null;
  private playerGraphic: Graphics | null = null;
  private npcGraphics: Graphics | null = null;
  private facingGraphic: Graphics | null = null;
  private headingArrow: Graphics | null = null;
  private intendedGhost: Graphics | null = null;
  private trickGraphics: Graphics | null = null;
  private tideGraphic: Graphics | null = null;
  private wakeGraphic: Graphics | null = null;
  private walkClickGraphic: Graphics | null = null;
  private xpTexts: Text[] = [];
  private offsetX = 0;
  private offsetY = 0;
  private tileTextures: TileTextureSet | null = null;
  private mapLayers: MapLayerStack | null = null;
  private mapLayerKey: string | null = null;

  async init(container: HTMLElement, tileSizePx: number): Promise<void> {
    this.tileSizePx = tileSizePx;
    this.tileTextures = new TileTextureSet();
    this.app = new Application();
    await this.app.init({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      backgroundColor: TILE_PALETTE.deepWater,
      antialias: false,
      resolution: 2,
      autoDensity: true,
    });
    container.appendChild(this.app.canvas);

    this.worldContainer = new Container();
    this.app.stage.addChild(this.worldContainer);

    this.mapLayers = new MapLayerStack(tileSizePx, this.tileTextures);
    this.worldContainer.addChild(this.mapLayers.root);

    this.boardGraphic = new Graphics();
    this.dockBoardGraphic = new Graphics();
    this.playerGraphic = new Graphics();
    this.npcGraphics = new Graphics();
    this.facingGraphic = new Graphics();
    this.headingArrow = new Graphics();
    this.intendedGhost = new Graphics();
    this.trickGraphics = new Graphics();
    this.tideGraphic = new Graphics();
    this.wakeGraphic = new Graphics();
    this.walkClickGraphic = new Graphics();

    this.worldContainer.addChild(this.walkClickGraphic);
    this.worldContainer.addChild(this.tideGraphic);
    this.worldContainer.addChild(this.trickGraphics);
    this.worldContainer.addChild(this.npcGraphics);
    this.worldContainer.addChild(this.wakeGraphic);
    this.worldContainer.addChild(this.dockBoardGraphic);
    this.worldContainer.addChild(this.playerGraphic);
    this.worldContainer.addChild(this.boardGraphic);
    this.worldContainer.addChild(this.intendedGhost);
    this.worldContainer.addChild(this.facingGraphic);
    this.worldContainer.addChild(this.headingArrow);
  }

  resize(size: RenderSize): void {
    if (!this.app) {
      return;
    }
    this.app.renderer.resize(size.width, size.height);
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: this.offsetX + worldX * this.tileSizePx,
      y: this.offsetY + worldY * this.tileSizePx,
    };
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.offsetX) / this.tileSizePx,
      y: (screenY - this.offsetY) / this.tileSizePx,
    };
  }

  render(snapshot: SimulationSnapshot, map: WorldMap, visualTimeMs = performance.now()): void {
    if (
      !this.app ||
      !this.worldContainer ||
      !this.boardGraphic ||
      !this.dockBoardGraphic ||
      !this.playerGraphic ||
      !this.npcGraphics ||
      !this.facingGraphic ||
      !this.headingArrow ||
      !this.intendedGhost ||
      !this.trickGraphics ||
      !this.tideGraphic ||
      !this.wakeGraphic ||
      !this.walkClickGraphic
    ) {
      return;
    }

    this.updateCamera(snapshot, map);
    this.ensureMapLayers(map, snapshot.tide);
    this.mapLayers!.root.position.set(this.offsetX, this.offsetY);
    const { scrollX, scrollY } = waterTextureScroll(visualTimeMs);
    this.mapLayers!.setOceanScroll(scrollX, scrollY);

    this.drawWalkClick(snapshot);
    this.drawTide(snapshot);
    this.drawTrickZones(snapshot);
    this.drawNpcs(snapshot);
    this.drawRideWake(snapshot);
    this.drawBoard(snapshot, map);
    this.drawFacing(snapshot, map);
    this.drawHeadingArrow(snapshot);
    this.drawIntendedGhost(snapshot);
  }

  showXpDrop(text: string, worldX: number, worldY: number): void {
    if (!this.app || !this.worldContainer) {
      return;
    }
    const screen = this.worldToScreen(worldX, worldY);
    const label = new Text({
      text,
      style: {
        fill: 0x7ecf8f,
        fontSize: 12,
        fontFamily: 'monospace',
      },
    });
    label.x = screen.x;
    label.y = screen.y - 10;
    this.worldContainer.addChild(label);
    this.xpTexts.push(label);

    const fade = () => {
      label.y -= 0.5;
      label.alpha -= 0.02;
      if (label.alpha <= 0) {
        this.worldContainer?.removeChild(label);
        this.xpTexts = this.xpTexts.filter((entry) => entry !== label);
        return;
      }
      requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
  }

  syncMapAfterTick(snapshot: SimulationSnapshot, map: WorldMap): void {
    this.ensureMapLayers(map, snapshot.tide);
    this.mapLayers!.rebuildOverlay(map, snapshot.tide);
  }

  destroy(): void {
    this.mapLayers?.destroy();
    this.mapLayers = null;
    this.mapLayerKey = null;
    this.app?.destroy(true);
    this.app = null;
  }

  private updateCamera(snapshot: SimulationSnapshot, map: WorldMap): void {
    const mapWidthPx = map.widthTiles * this.tileSizePx;
    const mapHeightPx = map.heightTiles * this.tileSizePx;

    if (mapWidthPx <= VIEWPORT_WIDTH && mapHeightPx <= VIEWPORT_HEIGHT) {
      this.offsetX = Math.max(0, (VIEWPORT_WIDTH - mapWidthPx) / 2);
      this.offsetY = Math.max(0, (VIEWPORT_HEIGHT - mapHeightPx) / 2);
      return;
    }

    const focusX = snapshot.surfboard.position.x;
    const focusY = snapshot.surfboard.position.y;
    let offsetX = VIEWPORT_WIDTH / 2 - focusX * this.tileSizePx;
    let offsetY = VIEWPORT_HEIGHT / 2 - focusY * this.tileSizePx;

    offsetX = Math.min(0, Math.max(VIEWPORT_WIDTH - mapWidthPx, offsetX));
    offsetY = Math.min(0, Math.max(VIEWPORT_HEIGHT - mapHeightPx, offsetY));

    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  private ensureMapLayers(map: WorldMap, tide: SimulationSnapshot['tide']): void {
    if (!this.mapLayers) {
      return;
    }
    const mapKey = `${map.widthTiles}x${map.heightTiles}`;
    if (this.mapLayerKey === mapKey) {
      return;
    }
    this.mapLayers.build(map, tide);
    this.mapLayerKey = mapKey;
  }

  private drawTide(snapshot: SimulationSnapshot): void {
    this.tideGraphic!.clear();
    const tide = snapshot.tide;
    if (!tide) {
      return;
    }

    const ts = this.tileSizePx;
    const center = this.worldToScreen(tide.centerX, tide.centerY);

    const innerPx = tide.innerRadius * ts;
    const outerPx = tide.outerRadius * ts;
    const arcSteps = 36;
    const edges = [tide.phaseRadians, normalizeAngle(tide.phaseRadians + tide.sweepRadians)];

    for (const edgeAngle of edges) {
      this.strokeReefArc(center, innerPx, outerPx, edgeAngle, arcSteps);
    }
  }

  private strokeReefArc(
    center: { x: number; y: number },
    innerPx: number,
    outerPx: number,
    angle: number,
    steps: number,
  ): void {
    const spread = 0.12;
    const arcStyle = { color: 0xb8e8ff, width: 2, alpha: 0.55 };
    for (const radius of [innerPx, outerPx]) {
      const points: number[] = [];
      for (let i = 0; i <= steps; i += 1) {
        const t = angle + spread * (i / steps - 0.5);
        points.push(center.x + Math.cos(t) * radius, center.y + Math.sin(t) * radius);
      }
      this.tideGraphic!.poly(points).stroke(arcStyle);
    }
  }

  private drawTrickZones(snapshot: SimulationSnapshot): void {
    this.trickGraphics!.clear();
    const tide = snapshot.tide;

    for (const zone of snapshot.trickZones) {
      if (tide && isTrickZoneSubmerged(zone, tide)) {
        continue;
      }

      const center = this.worldToScreen(zone.center.x, zone.center.y);
      const r = zone.radius * this.tileSizePx;
      drawTrickFeature(this.trickGraphics!, center.x, center.y, r, zone);
    }
  }

  private drawRideWake(snapshot: SimulationSnapshot): void {
    this.wakeGraphic!.clear();
    if (!snapshot.boardMounted || snapshot.surfboard.speedState !== 'riding') {
      return;
    }

    const { x, y } = this.worldToScreen(
      snapshot.surfboard.position.x,
      snapshot.surfboard.position.y,
    );
    const angle = (headingToDegrees(snapshot.surfboard.currentHeading) * Math.PI) / 180;
    const behind = angle + Math.PI;
    const dist = this.tileSizePx * 0.85;
    const wx = x + Math.cos(behind) * dist;
    const wy = y + Math.sin(behind) * dist;
    const waveW = this.tileSizePx * 0.95;
    const waveH = this.tileSizePx * 0.38;

    this.wakeGraphic!.ellipse(wx, wy, waveW, waveH).fill({ color: 0xf4a7b9, alpha: 0.4 });
    this.wakeGraphic!.ellipse(wx, wy, waveW * 0.85, waveH * 0.7).fill({
      color: 0xffffff,
      alpha: 0.35,
    });
  }

  private drawWalkClick(snapshot: SimulationSnapshot): void {
    this.walkClickGraphic!.clear();
    if (snapshot.boardMounted || snapshot.walkTargetTx === null || snapshot.walkTargetTy === null) {
      return;
    }

    const ts = this.tileSizePx;
    const x = this.offsetX + snapshot.walkTargetTx * ts;
    const y = this.offsetY + snapshot.walkTargetTy * ts;
    const color = snapshot.walkClickValid ? 0xffff00 : 0xff4444;
    const pad = 5;

    const crossStyle = { color, width: 2, alpha: 0.9 };
    strokeSegment(this.walkClickGraphic!, x + pad, y + pad, x + ts - pad, y + ts - pad, crossStyle);
    strokeSegment(this.walkClickGraphic!, x + ts - pad, y + pad, x + pad, y + ts - pad, crossStyle);
  }

  private drawNpcs(snapshot: SimulationSnapshot): void {
    this.npcGraphics!.clear();
    for (const npc of snapshot.npcs) {
      const { x, y } = this.worldToScreen(npc.x, npc.y);
      const r = this.tileSizePx * 0.22;

      this.npcGraphics!.circle(x, y - r * 1.8, r * 0.9).fill(0x5c3a1e);
      this.npcGraphics!.roundRect(x - r, y - r, r * 2, r * 2.2, 2).fill(0xffcc66);
      this.npcGraphics!.roundRect(x - r * 0.7, y + r * 0.1, r * 1.4, r * 1.5, 2).fill(0x3a6ea5);
      strokeSegment(this.npcGraphics!, x - r * 1.4, y - r * 3.2, x + r * 1.4, y - r * 3.2, {
        color: 0xffff00,
        width: 1,
        alpha: 0.85,
      });
    }
  }

  private drawBoard(snapshot: SimulationSnapshot, map: WorldMap): void {
    this.boardGraphic!.visible = snapshot.boardMounted;
    this.dockBoardGraphic!.visible = !snapshot.boardMounted;
    this.playerGraphic!.visible = !snapshot.boardMounted;

    if (!snapshot.boardMounted) {
      const dock = this.worldToScreen(snapshot.boardDockX, snapshot.boardDockY);
      drawSurfboardShape(this.dockBoardGraphic!, this.tileSizePx, true);
      this.dockBoardGraphic!.rotation = 0;
      this.dockBoardGraphic!.position.set(dock.x, dock.y);

      const player = this.worldToScreen(
        snapshot.surfboard.position.x,
        snapshot.surfboard.position.y,
      );
      this.playerGraphic!.clear();
      this.playerGraphic!.circle(
        player.x,
        player.y - this.tileSizePx * 0.15,
        this.tileSizePx * 0.18,
      ).fill(0xffcc66);
      this.playerGraphic!.roundRect(
        player.x - this.tileSizePx * 0.14,
        player.y,
        this.tileSizePx * 0.28,
        this.tileSizePx * 0.35,
        2,
      ).fill(0x3a6ea5);
      return;
    }

    const { x, y } = this.worldToScreen(
      snapshot.surfboard.position.x,
      snapshot.surfboard.position.y,
    );
    const tile = getTile(
      map,
      Math.floor(snapshot.surfboard.position.x),
      Math.floor(snapshot.surfboard.position.y),
    );
    const beached = snapshot.surfboard.speedState === 'seated' && tile === 'sand';
    const angle = beached
      ? 0
      : (headingToDegrees(snapshot.surfboard.currentHeading) * Math.PI) / 180;

    drawSurfboardShape(this.boardGraphic!, this.tileSizePx, beached);
    this.boardGraphic!.rotation = angle;
    this.boardGraphic!.position.set(x, y);
  }

  private drawFacing(snapshot: SimulationSnapshot, map: WorldMap): void {
    const { x, y } = this.worldToScreen(
      snapshot.surfboard.position.x,
      snapshot.surfboard.position.y,
    );

    this.facingGraphic!.clear();

    if (!snapshot.boardMounted) {
      const angle = (headingToDegrees(snapshot.surfboard.currentHeading) * Math.PI) / 180;
      const len = this.tileSizePx * 0.35;
      const originY = y - this.tileSizePx * 0.12;
      strokeSegment(
        this.facingGraphic!,
        x,
        originY,
        x + Math.cos(angle) * len,
        originY + Math.sin(angle) * len,
        { color: 0xffffff, width: 2 },
      );
      return;
    }

    const tile = getTile(
      map,
      Math.floor(snapshot.surfboard.position.x),
      Math.floor(snapshot.surfboard.position.y),
    );
    const beached = snapshot.surfboard.speedState === 'seated' && tile === 'sand';
    const angle = beached
      ? 0
      : (headingToDegrees(snapshot.surfboard.currentHeading) * Math.PI) / 180;
    const len = this.tileSizePx * 0.55;

    const tipX = x + Math.cos(angle) * len;
    const tipY = y + Math.sin(angle) * len;
    strokeSegment(this.facingGraphic!, x, y, tipX, tipY, { color: 0xffffff, width: 3 });
    this.facingGraphic!.poly([
      tipX,
      tipY,
      tipX - Math.cos(angle - 0.5) * 8,
      tipY - Math.sin(angle - 0.5) * 8,
      tipX - Math.cos(angle + 0.5) * 8,
      tipY - Math.sin(angle + 0.5) * 8,
    ]).fill(0xffffff);
  }

  private drawHeadingArrow(snapshot: SimulationSnapshot): void {
    this.headingArrow!.clear();
    if (
      !snapshot.boardMounted ||
      snapshot.hoverHeading === null ||
      snapshot.cursorWorldX === null ||
      snapshot.cursorWorldY === null
    ) {
      return;
    }

    const board = this.worldToScreen(snapshot.surfboard.position.x, snapshot.surfboard.position.y);
    const hoverAngle = (headingToDegrees(snapshot.hoverHeading) * Math.PI) / 180;
    const orbitX = board.x + Math.cos(hoverAngle) * ARROW_ORBIT_RADIUS_TILES * this.tileSizePx;
    const orbitY = board.y + Math.sin(hoverAngle) * ARROW_ORBIT_RADIUS_TILES * this.tileSizePx;
    const color = snapshot.clickValid ? 0xffffff : 0xff4444;

    strokeSegment(this.headingArrow!, board.x, board.y, orbitX, orbitY, {
      color,
      width: 2,
      alpha: 0.5,
    });

    const arrowLen = CLICK_ARROW_RADIUS_TILES * this.tileSizePx * 0.5;
    const tipX = orbitX + Math.cos(hoverAngle) * arrowLen;
    const tipY = orbitY + Math.sin(hoverAngle) * arrowLen;
    strokeSegment(this.headingArrow!, orbitX, orbitY, tipX, tipY, { color, width: 4 });
    this.headingArrow!.poly([
      tipX,
      tipY,
      tipX - Math.cos(hoverAngle - 0.6) * 10,
      tipY - Math.sin(hoverAngle - 0.6) * 10,
      tipX - Math.cos(hoverAngle + 0.6) * 10,
      tipY - Math.sin(hoverAngle + 0.6) * 10,
    ]).fill(color);
  }

  private drawIntendedGhost(snapshot: SimulationSnapshot): void {
    this.intendedGhost!.clear();
    if (
      !snapshot.boardMounted ||
      snapshot.surfboard.currentHeading === snapshot.surfboard.intendedHeading
    ) {
      return;
    }

    const board = this.worldToScreen(snapshot.surfboard.position.x, snapshot.surfboard.position.y);
    const targetAngle = (headingToDegrees(snapshot.surfboard.intendedHeading) * Math.PI) / 180;
    const len = this.tileSizePx * 0.45;

    strokeSegment(
      this.intendedGhost!,
      board.x,
      board.y,
      board.x + Math.cos(targetAngle) * len,
      board.y + Math.sin(targetAngle) * len,
      { color: 0xaaccff, width: 2, alpha: 0.6, cap: 'round' },
    );
  }
}

export function bindPointerEvents(
  canvas: HTMLCanvasElement,
  onMove: (worldX: number, worldY: number) => void,
  onClick: (worldX: number, worldY: number) => void,
  screenToWorld: (x: number, y: number) => { x: number; y: number },
): () => void {
  /** Map pointer to logical viewport coords (0…VIEWPORT), independent of Pixi resolution / CSS scale. */
  const toViewportCoords = (event: PointerEvent): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * VIEWPORT_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * VIEWPORT_HEIGHT,
    };
  };

  const handleMove = (event: PointerEvent) => {
    const { x, y } = toViewportCoords(event);
    const world = screenToWorld(x, y);
    onMove(world.x, world.y);
  };

  const handleClick = (event: PointerEvent) => {
    event.preventDefault();
    const { x, y } = toViewportCoords(event);
    const world = screenToWorld(x, y);
    onClick(world.x, world.y);
  };

  const handleLeave = () => {
    onMove(NaN, NaN);
  };

  canvas.addEventListener('pointermove', handleMove);
  canvas.addEventListener('pointerdown', handleClick);
  canvas.addEventListener('pointerleave', handleLeave);

  return () => {
    canvas.removeEventListener('pointermove', handleMove);
    canvas.removeEventListener('pointerdown', handleClick);
    canvas.removeEventListener('pointerleave', handleLeave);
  };
}

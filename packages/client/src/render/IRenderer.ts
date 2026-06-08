import type { SimulationSnapshot, WorldMap } from '@osrs-surfing/engine';

export interface RenderSize {
  width: number;
  height: number;
}

export interface IRenderer {
  init(container: HTMLElement, tileSizePx: number): Promise<void>;
  resize(size: RenderSize): void;
  render(snapshot: SimulationSnapshot, map: WorldMap, visualTimeMs?: number): void;
  syncMapAfterTick(snapshot: SimulationSnapshot, map: WorldMap): void;
  worldToScreen(worldX: number, worldY: number): { x: number; y: number };
  screenToWorld(screenX: number, screenY: number): { x: number; y: number };
  destroy(): void;
}

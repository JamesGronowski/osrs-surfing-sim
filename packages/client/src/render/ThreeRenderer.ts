import {
  AmbientLight,
  DirectionalLight,
  Plane,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import type { SimulationSnapshot, WorldMap } from '@osrs-surfing/engine';

import type { DisplaySimulationSnapshot } from './visualSnapshot.js';

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from '../ui/fixedLayout.js';
import { bindPointerEvents } from './bindPointerEvents.js';
import type { IRenderer, RenderSize } from './IRenderer.js';
import { TILE_PALETTE } from './tilePalette.js';
import { EntityLayer } from './three/entityMeshes.js';
import { paletteHex } from './three/hexColor.js';
import { MapMeshBuilder } from './three/MapMeshBuilder.js';
import { OsrsOrbitCamera } from './three/OsrsOrbitCamera.js';
import { OverlayLayer } from './three/overlayMeshes.js';
import { TrickFeatureLayer } from './three/trickFeatureMeshes.js';
import { tileToWorld3, world3ToTile } from './three/worldCoords.js';

const GROUND_PLANE = new Plane(new Vector3(0, 1, 0), 0);
const RAY_ORIGIN = new Vector3();
const RAY_DIRECTION = new Vector3();
const NDC = new Vector2();
const HIT_POINT = new Vector3();

export class ThreeRenderer implements IRenderer {
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private orbitCamera: OsrsOrbitCamera | null = null;
  private raycaster = new Raycaster();
  private mapMeshes: MapMeshBuilder | null = null;
  private entities: EntityLayer | null = null;
  private tricks: TrickFeatureLayer | null = null;
  private overlays: OverlayLayer | null = null;
  private container: HTMLElement | null = null;
  private lastFrameMs = 0;
  private unbindPointer: (() => void) | null = null;
  private unbindCamera: (() => void) | null = null;
  private xpContainer: HTMLElement | null = null;

  async init(container: HTMLElement, _tileSizePx: number): Promise<void> {
    void _tileSizePx;
    this.container = container;

    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(paletteHex(TILE_PALETTE.deepWater));
    container.appendChild(this.renderer.domElement);

    this.scene = new Scene();

    const ambient = new AmbientLight(0xffffff, 0.55);
    const sun = new DirectionalLight(0xfff4e0, 0.85);
    sun.position.set(40, 80, 30);
    this.scene.add(ambient, sun);

    this.orbitCamera = new OsrsOrbitCamera(VIEWPORT_WIDTH / VIEWPORT_HEIGHT);

    this.mapMeshes = new MapMeshBuilder();
    this.entities = new EntityLayer();
    this.tricks = new TrickFeatureLayer();
    this.overlays = new OverlayLayer();

    this.scene.add(this.mapMeshes.root, this.tricks.root, this.entities.root, this.overlays.root);

    this.xpContainer = document.createElement('div');
    this.xpContainer.className = 'xp-drop-layer';
    this.xpContainer.style.cssText =
      'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    container.style.position = 'relative';
    container.appendChild(this.xpContainer);

    this.bindCameraEvents(this.renderer.domElement);
  }

  getCanvas(): HTMLCanvasElement {
    if (!this.renderer) {
      throw new Error('Renderer not initialized');
    }
    return this.renderer.domElement;
  }

  bindPointerInput(
    onMove: (worldX: number, worldY: number) => void,
    onClick: (worldX: number, worldY: number) => void,
  ): () => void {
    this.unbindPointer?.();
    this.unbindPointer = bindPointerEvents(this.getCanvas(), onMove, onClick, (x, y) =>
      this.screenToWorld(x, y),
    );
    return this.unbindPointer;
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    return this.orbitCamera?.handleKeyDown(event.code) ?? false;
  }

  handleKeyUp(event: KeyboardEvent): boolean {
    return this.orbitCamera?.handleKeyUp(event.code) ?? false;
  }

  resize(size: RenderSize): void {
    if (!this.renderer || !this.orbitCamera) {
      return;
    }
    this.renderer.setSize(size.width, size.height, false);
    this.orbitCamera.setAspect(size.width / size.height);
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    if (!this.orbitCamera) {
      return { x: 0, y: 0 };
    }
    const pos = tileToWorld3(worldX, worldY, 0.5);
    HIT_POINT.set(pos.x, pos.y, pos.z);
    HIT_POINT.project(this.orbitCamera.camera);

    return {
      x: ((HIT_POINT.x + 1) / 2) * VIEWPORT_WIDTH,
      y: ((-HIT_POINT.y + 1) / 2) * VIEWPORT_HEIGHT,
    };
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    if (!this.orbitCamera) {
      return { x: 0, y: 0 };
    }

    NDC.x = (screenX / VIEWPORT_WIDTH) * 2 - 1;
    NDC.y = -(screenY / VIEWPORT_HEIGHT) * 2 + 1;

    this.raycaster.setFromCamera(NDC, this.orbitCamera.camera);
    const ray = this.raycaster.ray;
    RAY_ORIGIN.copy(ray.origin);
    RAY_DIRECTION.copy(ray.direction);

    const denom = RAY_DIRECTION.y;
    if (Math.abs(denom) < 1e-6) {
      return { x: NaN, y: NaN };
    }

    const t = -RAY_ORIGIN.y / denom;
    if (t < 0) {
      return { x: NaN, y: NaN };
    }

    HIT_POINT.copy(RAY_ORIGIN).addScaledVector(RAY_DIRECTION, t);
    return world3ToTile(HIT_POINT);
  }

  render(
    snapshot: DisplaySimulationSnapshot,
    map: WorldMap,
    visualTimeMs = performance.now(),
    tickBlend = 0,
  ): void {
    if (
      !this.renderer ||
      !this.scene ||
      !this.orbitCamera ||
      !this.mapMeshes ||
      !this.entities ||
      !this.tricks ||
      !this.overlays
    ) {
      return;
    }

    const deltaMs = this.lastFrameMs > 0 ? visualTimeMs - this.lastFrameMs : 16;
    this.lastFrameMs = visualTimeMs;
    const deltaSeconds = Math.min(0.1, deltaMs / 1000);

    this.mapMeshes.build(map, snapshot.tide);
    void visualTimeMs;

    this.orbitCamera.setFocus(snapshot.surfboard.position.x, snapshot.surfboard.position.y);
    this.orbitCamera.update(deltaSeconds);

    this.tricks.sync(snapshot, tickBlend);
    this.entities.sync(snapshot, map);
    this.overlays.sync(snapshot, map);

    this.renderer.render(this.scene, this.orbitCamera.camera);
  }

  showXpDrop(text: string, worldX: number, worldY: number): void {
    if (!this.xpContainer) {
      return;
    }
    const screen = this.worldToScreen(worldX, worldY);
    const label = document.createElement('div');
    label.textContent = text;
    label.style.cssText = 'position:absolute;color:#7ecf8f;font:12px monospace;white-space:nowrap;';
    label.style.left = `${screen.x}px`;
    label.style.top = `${screen.y - 10}px`;
    this.xpContainer.appendChild(label);

    const fade = () => {
      const top = parseFloat(label.style.top);
      label.style.top = `${top - 0.5}px`;
      label.style.opacity = `${parseFloat(label.style.opacity || '1') - 0.02}`;
      if (parseFloat(label.style.opacity || '1') <= 0) {
        label.remove();
        return;
      }
      requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
  }

  syncMapAfterTick(snapshot: SimulationSnapshot, map: WorldMap): void {
    this.mapMeshes?.build(map, snapshot.tide);
    this.mapMeshes?.rebuildOverlay(map, snapshot.tide);
  }

  destroy(): void {
    this.unbindPointer?.();
    this.unbindCamera?.();
    this.entities?.dispose();
    this.tricks?.dispose();
    this.overlays?.dispose();
    this.mapMeshes?.destroy();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.xpContainer?.remove();
    this.renderer = null;
    this.scene = null;
    void GROUND_PLANE;
    void this.container;
  }

  private bindCameraEvents(canvas: HTMLCanvasElement): void {
    const camera = this.orbitCamera;
    if (!camera) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      camera.onPointerDown(event);
      if (event.button === 1) {
        canvas.setPointerCapture(event.pointerId);
      }
    };
    const onPointerMove = (event: PointerEvent) => camera.onPointerMove(event);
    const onPointerUp = (event: PointerEvent) => {
      if (event.button === 1 && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      camera.onPointerUp(event);
    };
    const onPointerCancel = (event: PointerEvent) => {
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      camera.onPointerCancel();
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.onWheel(event.deltaY);
    };
    const onContextMenu = (event: Event) => event.preventDefault();

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', onContextMenu);

    this.unbindCamera = () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);
    };
  }
}

export { bindPointerEvents } from './bindPointerEvents.js';

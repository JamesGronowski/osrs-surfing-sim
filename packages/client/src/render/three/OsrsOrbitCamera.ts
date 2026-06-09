import { PerspectiveCamera, Vector3 } from 'three';

import { CAMERA_YAW_NORTH } from '../../ui/minimapLayout.js';
import { tileToWorld3 } from './worldCoords.js';

const DEFAULT_YAW = Math.PI * 0.75;
const DEFAULT_PITCH = 0.55;
const DEFAULT_DISTANCE = 28;

const MIN_PITCH = 0.15;
const MAX_PITCH = 1.45;
const MIN_DISTANCE = 8;
const MAX_DISTANCE = 80;

const ARROW_YAW_SPEED = 1.8;
const ARROW_PITCH_SPEED = 1.2;
const MIDDLE_MOUSE_SENSITIVITY = 0.004;
const ZOOM_SPEED = 0.08;

const FOCUS_HEIGHT = 0.6;
/** Higher = snappier follow; lower = smoother camera glide. */
const FOCUS_SMOOTH_RATE = 10;

export class OsrsOrbitCamera {
  readonly camera: PerspectiveCamera;
  private yaw = DEFAULT_YAW;
  private pitch = DEFAULT_PITCH;
  private distance = DEFAULT_DISTANCE;
  private readonly focusTarget = new Vector3();
  private readonly focusCurrent = new Vector3();
  private focusInitialized = false;
  private readonly scratch = new Vector3();
  private middleMouseDragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private arrowLeft = false;
  private arrowRight = false;
  private arrowUp = false;
  private arrowDown = false;

  constructor(aspect: number) {
    this.camera = new PerspectiveCamera(50, aspect, 0.1, 500);
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  setFocus(tileX: number, tileY: number): void {
    const pos = tileToWorld3(tileX, tileY, FOCUS_HEIGHT);
    this.focusTarget.set(pos.x, pos.y, pos.z);
    if (!this.focusInitialized) {
      this.focusCurrent.copy(this.focusTarget);
      this.focusInitialized = true;
    }
  }

  update(deltaSeconds: number): void {
    const focusBlend = 1 - Math.exp(-FOCUS_SMOOTH_RATE * deltaSeconds);
    this.focusCurrent.lerp(this.focusTarget, focusBlend);
    if (this.arrowLeft) {
      this.yaw -= ARROW_YAW_SPEED * deltaSeconds;
    }
    if (this.arrowRight) {
      this.yaw += ARROW_YAW_SPEED * deltaSeconds;
    }
    if (this.arrowUp) {
      this.pitch = Math.max(MIN_PITCH, this.pitch - ARROW_PITCH_SPEED * deltaSeconds);
    }
    if (this.arrowDown) {
      this.pitch = Math.min(MAX_PITCH, this.pitch + ARROW_PITCH_SPEED * deltaSeconds);
    }

    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);
    const cosYaw = Math.cos(this.yaw);
    const sinYaw = Math.sin(this.yaw);

    this.scratch.set(
      this.distance * cosPitch * cosYaw,
      this.distance * sinPitch,
      this.distance * cosPitch * sinYaw,
    );

    this.camera.position.copy(this.focusCurrent).add(this.scratch);
    this.camera.lookAt(this.focusCurrent);
  }

  handleKeyDown(code: string): boolean {
    switch (code) {
      case 'ArrowLeft':
        this.arrowLeft = true;
        return true;
      case 'ArrowRight':
        this.arrowRight = true;
        return true;
      case 'ArrowUp':
        this.arrowUp = true;
        return true;
      case 'ArrowDown':
        this.arrowDown = true;
        return true;
      default:
        return false;
    }
  }

  handleKeyUp(code: string): boolean {
    switch (code) {
      case 'ArrowLeft':
        this.arrowLeft = false;
        return true;
      case 'ArrowRight':
        this.arrowRight = false;
        return true;
      case 'ArrowUp':
        this.arrowUp = false;
        return true;
      case 'ArrowDown':
        this.arrowDown = false;
        return true;
      default:
        return false;
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 1) {
      return;
    }
    event.preventDefault();
    this.middleMouseDragging = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.middleMouseDragging) {
      return;
    }
    const dx = event.clientX - this.lastPointerX;
    const dy = event.clientY - this.lastPointerY;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;

    this.yaw += dx * MIDDLE_MOUSE_SENSITIVITY;
    this.pitch = Math.max(
      MIN_PITCH,
      Math.min(MAX_PITCH, this.pitch + dy * MIDDLE_MOUSE_SENSITIVITY),
    );
  }

  onPointerUp(event: PointerEvent): void {
    if (event.button === 1) {
      this.endMiddleMouseDrag();
    }
  }

  onPointerCancel(): void {
    this.endMiddleMouseDrag();
  }

  private endMiddleMouseDrag(): void {
    this.middleMouseDragging = false;
  }

  onWheel(deltaY: number): void {
    const factor = 1 + deltaY * ZOOM_SPEED * 0.001;
    this.distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, this.distance * factor));
  }

  /** Radians to rotate the minimap compass needle so north stays world-up on screen. */
  getCompassRotationRadians(): number {
    return CAMERA_YAW_NORTH - this.yaw;
  }

  snapNorth(): void {
    this.yaw = CAMERA_YAW_NORTH;
  }
}

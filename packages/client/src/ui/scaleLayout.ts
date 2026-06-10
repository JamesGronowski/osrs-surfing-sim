import { FIXED_FRAME_HEIGHT, FIXED_FRAME_WIDTH } from './fixedLayout.js';

const SCALE_MARGIN_PX = 32;
const MIN_SCALE = 0.5;

/** Largest scale that fits the window while preserving the fixed-frame aspect ratio. */
export function computeDisplayScale(): number {
  const maxW = window.innerWidth - SCALE_MARGIN_PX;
  const maxH = window.innerHeight - SCALE_MARGIN_PX;
  return Math.max(MIN_SCALE, Math.min(maxW / FIXED_FRAME_WIDTH, maxH / FIXED_FRAME_HEIGHT));
}

export function applyDisplayScale(shell: HTMLElement, inner: HTMLElement): number {
  const scale = computeDisplayScale();
  shell.style.width = `${FIXED_FRAME_WIDTH * scale}px`;
  shell.style.height = `${FIXED_FRAME_HEIGHT * scale}px`;
  inner.style.transform = `scale(${scale})`;
  inner.style.transformOrigin = 'top left';
  return scale;
}

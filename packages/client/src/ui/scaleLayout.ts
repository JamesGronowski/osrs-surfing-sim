import { FIXED_FRAME_HEIGHT, FIXED_FRAME_WIDTH } from './fixedLayout.js';

const SCALE_MARGIN_PX = 32;

/** Integer upscale like RuneLite "integer scaling" — keeps OSRS pixels crisp. */
export function computeIntegerScale(): number {
  const maxW = window.innerWidth - SCALE_MARGIN_PX;
  const maxH = window.innerHeight - SCALE_MARGIN_PX;
  return Math.max(1, Math.floor(Math.min(maxW / FIXED_FRAME_WIDTH, maxH / FIXED_FRAME_HEIGHT)));
}

export function applyIntegerScale(shell: HTMLElement, inner: HTMLElement): number {
  const scale = computeIntegerScale();
  shell.style.width = `${FIXED_FRAME_WIDTH * scale}px`;
  shell.style.height = `${FIXED_FRAME_HEIGHT * scale}px`;
  inner.style.transform = `scale(${scale})`;
  inner.style.transformOrigin = 'top left';
  return scale;
}

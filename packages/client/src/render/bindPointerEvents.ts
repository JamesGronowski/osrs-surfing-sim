import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from '../ui/fixedLayout.js';

export function bindPointerEvents(
  canvas: HTMLCanvasElement,
  onMove: (worldX: number, worldY: number) => void,
  onClick: (worldX: number, worldY: number) => void,
  screenToWorld: (x: number, y: number) => { x: number; y: number },
): () => void {
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
    if (event.button !== 0) {
      return;
    }
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

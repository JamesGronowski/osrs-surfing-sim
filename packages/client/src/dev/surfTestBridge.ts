import type {
  GameSimulation,
  SimulationSnapshot,
  SpeedState,
  TrickPrepareSlot,
} from '@osrs-surfing/engine';

export interface SurfTestControls {
  pause: () => void;
  resume: () => void;
  renderFrame: () => void;
  afterTick?: () => void;
}

export interface SurfTestApi {
  clickWorld: (x: number, y: number) => void;
  setSpeedState: (state: SpeedState) => void;
  prepareTrick: (slot: TrickPrepareSlot) => void;
  clearTrickPrepare: () => void;
  advanceTicks: (count?: number) => void;
  getSnapshot: () => SimulationSnapshot;
  consumeDialogue: () => string[];
  tickMs: number;
  pause: () => void;
  resume: () => void;
  setTideFrozen: (frozen: boolean) => void;
  setMovementFrozen: (frozen: boolean) => void;
  renderFrame: () => void;
}

declare global {
  interface Window {
    __surfTest?: SurfTestApi;
  }
}

export function installSurfTestBridge(
  simulation: GameSimulation,
  controls: SurfTestControls,
): void {
  if (!import.meta.env.DEV) {
    return;
  }

  window.__surfTest = {
    clickWorld: (x, y) => simulation.clickWorld(x, y),
    setSpeedState: (state) => simulation.setSpeedState(state),
    prepareTrick: (slot) => simulation.prepareTrick(slot),
    clearTrickPrepare: () => simulation.clearTrickPrepare(),
    advanceTicks: (count = 1) => {
      for (let i = 0; i < count; i += 1) {
        simulation.tick();
        controls.afterTick?.();
      }
    },
    getSnapshot: () => simulation.getSnapshot(),
    consumeDialogue: () => simulation.consumeDialogue(),
    tickMs: simulation.tickMs,
    pause: controls.pause,
    resume: controls.resume,
    setTideFrozen: (frozen) => simulation.setTideFrozen(frozen),
    setMovementFrozen: (frozen) => simulation.setMovementFrozen(frozen),
    renderFrame: controls.renderFrame,
  };
}

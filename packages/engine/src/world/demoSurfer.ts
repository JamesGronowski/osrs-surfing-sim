import {
  DEMO_SURFER_TIDE_SPIN_TICKS,
  DEMO_SURFER_TIDE_SPIN_TURN_RATE,
  computeDemoSurferAi,
  shouldStartTideSpin,
  tideSpinTargetHeading,
} from '../ai/demoSurferAi.js';
import { DEFAULT_SURFBOARD_STATS } from '../constants/movement.js';
import type { HeadingIndex } from '../movement/heading.js';
import {
  createSurfboard,
  tickSurfboard,
  type SurfboardState,
  type SurfboardStats,
} from '../movement/surfboard.js';
import type { WorldMap } from './collision.js';
import {
  advanceTrickPrepare,
  findTrickZoneAt,
  type TideState,
  type TrickPrepareState,
  type TrickZone,
} from './features.js';
import {
  createTrickAnimationState,
  tickTrickAnimation,
  toTrickAnimationSnapshot,
  type TrickAnimationSnapshot,
  type TrickAnimationState,
} from './trickAnimation.js';

export interface DemoSurferConfig {
  id: string;
  name: string;
  startX: number;
  startY: number;
  startHeading: HeadingIndex;
}

export interface DemoSurferSnapshot {
  id: string;
  name: string;
  surfboard: SurfboardState;
  trickPrepare: TrickPrepareState | null;
  trickAnimation: TrickAnimationSnapshot | null;
  /** 0–1 progress through an active tide spin, or null when not spinning. */
  tideSpinProgress: number | null;
}

interface DemoSurferRuntime {
  config: DemoSurferConfig;
  surfboard: SurfboardState;
  trickPrepare: TrickPrepareState | null;
  trickAnimation: TrickAnimationState | null;
  activeTrickZoneId: string | null;
  tideSpinTicksRemaining: number;
  stats: SurfboardStats;
}

export function createDemoSurfer(
  config: DemoSurferConfig,
  stats?: SurfboardStats,
): DemoSurferRuntime {
  const board = createSurfboard(config.startX, config.startY, config.startHeading);
  return {
    config,
    surfboard: {
      ...board,
      speedState: 'riding',
    },
    trickPrepare: null,
    trickAnimation: null,
    activeTrickZoneId: null,
    tideSpinTicksRemaining: 0,
    stats: stats ?? { ...DEFAULT_SURFBOARD_STATS },
  };
}

function tideSpinProgress(runtime: DemoSurferRuntime): number | null {
  if (runtime.tideSpinTicksRemaining <= 0) {
    return null;
  }
  return 1 - runtime.tideSpinTicksRemaining / DEMO_SURFER_TIDE_SPIN_TICKS;
}

export function toDemoSurferSnapshot(runtime: DemoSurferRuntime): DemoSurferSnapshot {
  return {
    id: runtime.config.id,
    name: runtime.config.name,
    surfboard: { ...runtime.surfboard, position: { ...runtime.surfboard.position } },
    trickPrepare: runtime.trickPrepare ? { ...runtime.trickPrepare } : null,
    trickAnimation: toTrickAnimationSnapshot(runtime.trickAnimation),
    tideSpinProgress: tideSpinProgress(runtime),
  };
}

function resolveDemoTrickEntry(
  runtime: DemoSurferRuntime,
  zone: TrickZone,
  map: WorldMap,
): DemoSurferRuntime {
  const trickAnimation = createTrickAnimationState(
    map,
    zone,
    runtime.surfboard.position,
    runtime.surfboard.currentHeading,
  );

  return {
    ...runtime,
    trickPrepare: null,
    trickAnimation,
    activeTrickZoneId: null,
    tideSpinTicksRemaining: 0,
    surfboard: {
      ...runtime.surfboard,
      speedState: 'riding',
      intendedHeading: trickAnimation.endHeading,
      isRotating: false,
    },
  };
}

function tickTideSpin(runtime: DemoSurferRuntime, map: WorldMap): DemoSurferRuntime {
  const spinStats = { ...runtime.stats, turnRateDegPerTick: DEMO_SURFER_TIDE_SPIN_TURN_RATE };
  const moveResult = tickSurfboard(
    runtime.surfboard,
    map,
    {
      lieDown: true,
      setIntendedHeading: tideSpinTargetHeading(runtime.surfboard.currentHeading),
    },
    spinStats,
  );

  return {
    ...runtime,
    surfboard: moveResult.state,
    tideSpinTicksRemaining: Math.max(0, runtime.tideSpinTicksRemaining - 1),
    trickPrepare: advanceTrickPrepare(runtime.trickPrepare),
    activeTrickZoneId: null,
  };
}

export function tickDemoSurfer(
  runtime: DemoSurferRuntime,
  map: WorldMap,
  trickZones: TrickZone[],
  tide: TideState | null,
): DemoSurferRuntime {
  if (runtime.trickAnimation) {
    const result = tickTrickAnimation(runtime.trickAnimation);
    return {
      ...runtime,
      trickAnimation: result.state,
      surfboard: {
        ...runtime.surfboard,
        position: result.position,
        currentHeading: result.heading,
        intendedHeading: result.heading,
        isRotating: false,
      },
      trickPrepare: advanceTrickPrepare(runtime.trickPrepare),
    };
  }

  if (runtime.tideSpinTicksRemaining > 0) {
    return tickTideSpin(runtime, map);
  }

  if (tide && shouldStartTideSpin(runtime.surfboard.position, runtime.surfboard, tide)) {
    return tickTideSpin({ ...runtime, tideSpinTicksRemaining: DEMO_SURFER_TIDE_SPIN_TICKS }, map);
  }

  const ai = computeDemoSurferAi({
    surfboard: runtime.surfboard,
    trickPrepare: runtime.trickPrepare,
    trickZones,
    tide,
    map,
  });

  const { prepareSlot, ...surfInput } = ai;
  let next: DemoSurferRuntime = runtime;

  if (prepareSlot !== undefined) {
    next = {
      ...next,
      trickPrepare: { slot: prepareSlot, ticksSincePrepare: 0 },
    };
  }

  const moveResult = tickSurfboard(next.surfboard, map, surfInput, next.stats);
  next = {
    ...next,
    surfboard: moveResult.state,
    trickPrepare: advanceTrickPrepare(next.trickPrepare),
  };

  if (next.surfboard.speedState !== 'seated') {
    const zone = findTrickZoneAt(trickZones, next.surfboard.position, tide);
    if (zone && next.activeTrickZoneId !== zone.id) {
      return resolveDemoTrickEntry({ ...next, activeTrickZoneId: zone.id }, zone, map);
    }
    if (!zone) {
      return { ...next, activeTrickZoneId: null };
    }
    return next;
  }

  return { ...next, activeTrickZoneId: null };
}

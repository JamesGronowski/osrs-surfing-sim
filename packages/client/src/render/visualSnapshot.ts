import {
  interpolateHeadingIndex,
  trickAnimationPositionAtProgress,
  type DemoSurferSnapshot,
  type HeadingIndex,
  type SimulationSnapshot,
  type SurfboardState,
  type TrickAnimationSnapshot,
  type WorldPos,
} from '@osrs-surfing/engine';

export interface DisplayTrickAnimation extends TrickAnimationSnapshot {
  progress: number;
}

export type DisplayDemoSurferSnapshot = Omit<DemoSurferSnapshot, 'trickAnimation'> & {
  trickAnimation: DisplayTrickAnimation | null;
};

export type DisplaySimulationSnapshot = Omit<
  SimulationSnapshot,
  'trickAnimation' | 'demoSurfers'
> & {
  trickAnimation: DisplayTrickAnimation | null;
  demoSurfers: DisplayDemoSurferSnapshot[];
};

interface EntityMotionSegment {
  segmentStart: WorldPos;
  segmentEnd: WorldPos;
  headingStart: HeadingIndex;
  headingEnd: HeadingIndex;
  intendedHeadingStart: HeadingIndex;
  intendedHeadingEnd: HeadingIndex;
  trickProgressStart: number;
  trickProgressEnd: number;
}

function lerpPosition(from: WorldPos, to: WorldPos, t: number): WorldPos {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

function positionDistance(a: WorldPos, b: WorldPos): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function trickAnimationProgress(animation: TrickAnimationSnapshot | null): number {
  if (!animation) {
    return 0;
  }
  return animation.ticksElapsed / animation.ticksTotal;
}

function createEntityMotionSegment(
  surfboard: SurfboardState,
  trickAnimation: TrickAnimationSnapshot | null,
): EntityMotionSegment {
  const position = { ...surfboard.position };
  return {
    segmentStart: position,
    segmentEnd: position,
    headingStart: surfboard.currentHeading,
    headingEnd: surfboard.currentHeading,
    intendedHeadingStart: surfboard.intendedHeading,
    intendedHeadingEnd: surfboard.intendedHeading,
    trickProgressStart: trickAnimationProgress(trickAnimation),
    trickProgressEnd: trickAnimationProgress(trickAnimation),
  };
}

function onEntitySimulationTick(
  segment: EntityMotionSegment,
  beforeSurfboard: SurfboardState,
  afterSurfboard: SurfboardState,
  beforeTrick: TrickAnimationSnapshot | null,
  afterTrick: TrickAnimationSnapshot | null,
): void {
  segment.segmentStart = { ...beforeSurfboard.position };
  segment.segmentEnd = { ...afterSurfboard.position };
  segment.headingStart = beforeSurfboard.currentHeading;
  segment.headingEnd = afterSurfboard.currentHeading;
  segment.intendedHeadingStart = beforeSurfboard.intendedHeading;
  segment.intendedHeadingEnd = afterSurfboard.intendedHeading;
  segment.trickProgressStart = trickAnimationProgress(beforeTrick);
  segment.trickProgressEnd = trickAnimationProgress(afterTrick);
}

function ensureEntitySegmentSynced(
  segment: EntityMotionSegment,
  surfboard: SurfboardState,
  trickAnimation: TrickAnimationSnapshot | null,
): void {
  if (trickAnimation) {
    return;
  }

  const simPos = surfboard.position;
  const segmentLength = positionDistance(segment.segmentStart, segment.segmentEnd);
  const simToEnd = positionDistance(simPos, segment.segmentEnd);

  if (simToEnd > Math.max(0.2, segmentLength * 0.5 + 0.05)) {
    const position = { ...simPos };
    segment.segmentStart = position;
    segment.segmentEnd = position;
    segment.headingStart = surfboard.currentHeading;
    segment.headingEnd = surfboard.currentHeading;
    segment.intendedHeadingStart = surfboard.intendedHeading;
    segment.intendedHeadingEnd = surfboard.intendedHeading;
    segment.trickProgressStart = 0;
    segment.trickProgressEnd = 0;
  }
}

interface InterpolatedSurfEntity {
  surfboard: SurfboardState;
  trickAnimation: DisplayTrickAnimation | null;
}

function interpolateSurfEntity(
  segment: EntityMotionSegment,
  surfboard: SurfboardState,
  trickAnimation: TrickAnimationSnapshot | null,
  tickBlend: number,
): InterpolatedSurfEntity {
  const t = clamp01(tickBlend);
  const trickProgress = trickAnimation
    ? segment.trickProgressStart + (segment.trickProgressEnd - segment.trickProgressStart) * t
    : 0;

  const position =
    trickAnimation !== null
      ? trickAnimationPositionAtProgress(trickAnimation, trickProgress)
      : lerpPosition(segment.segmentStart, segment.segmentEnd, t);

  const displayTrick: DisplayTrickAnimation | null = trickAnimation
    ? {
        ...trickAnimation,
        progress: trickProgress,
      }
    : null;

  return {
    surfboard: {
      ...surfboard,
      position,
      currentHeading: interpolateHeadingIndex(segment.headingStart, segment.headingEnd, t),
      intendedHeading: interpolateHeadingIndex(
        segment.intendedHeadingStart,
        segment.intendedHeadingEnd,
        t,
      ),
    },
    trickAnimation: displayTrick,
  };
}

/**
 * Linearly interpolates rider positions over exactly one tick period (600 ms).
 * Player and demo surfer each keep their own motion segment; tick blend is
 * wall-clock time since the last simulation step (0 at arrival, 1 just before the next tick).
 */
export class SurfboardMotionInterpolator {
  private readonly player = createEntityMotionSegment(
    {
      position: { x: 0, y: 0 },
      currentHeading: 0,
      intendedHeading: 0,
      speedState: 'seated',
      isRotating: false,
    },
    null,
  );
  private readonly demoSurfers = new Map<string, EntityMotionSegment>();

  reset(snapshot: SimulationSnapshot): void {
    onEntitySimulationTick(
      this.player,
      snapshot.surfboard,
      snapshot.surfboard,
      snapshot.trickAnimation,
      snapshot.trickAnimation,
    );
    this.demoSurfers.clear();
    for (const surfer of snapshot.demoSurfers) {
      this.demoSurfers.set(
        surfer.id,
        createEntityMotionSegment(surfer.surfboard, surfer.trickAnimation),
      );
    }
  }

  onSimulationTick(before: SimulationSnapshot, after: SimulationSnapshot): void {
    onEntitySimulationTick(
      this.player,
      before.surfboard,
      after.surfboard,
      before.trickAnimation,
      after.trickAnimation,
    );

    const liveIds = new Set<string>();
    for (const surfer of after.demoSurfers) {
      liveIds.add(surfer.id);
      let segment = this.demoSurfers.get(surfer.id);
      if (!segment) {
        segment = createEntityMotionSegment(surfer.surfboard, surfer.trickAnimation);
        this.demoSurfers.set(surfer.id, segment);
      }
      const beforeSurfer = before.demoSurfers.find((entry) => entry.id === surfer.id);
      onEntitySimulationTick(
        segment,
        beforeSurfer?.surfboard ?? surfer.surfboard,
        surfer.surfboard,
        beforeSurfer?.trickAnimation ?? null,
        surfer.trickAnimation,
      );
    }
    for (const id of this.demoSurfers.keys()) {
      if (!liveIds.has(id)) {
        this.demoSurfers.delete(id);
      }
    }
  }

  ensureSynced(snapshot: SimulationSnapshot): void {
    ensureEntitySegmentSynced(this.player, snapshot.surfboard, snapshot.trickAnimation);
    for (const surfer of snapshot.demoSurfers) {
      const segment = this.demoSurfers.get(surfer.id);
      if (segment) {
        ensureEntitySegmentSynced(segment, surfer.surfboard, surfer.trickAnimation);
      }
    }
  }

  buildDisplaySnapshot(
    snapshot: SimulationSnapshot,
    tidePhaseFrom: number | null,
    tickBlend: number,
  ): DisplaySimulationSnapshot {
    const player = interpolateSurfEntity(
      this.player,
      snapshot.surfboard,
      snapshot.trickAnimation,
      tickBlend,
    );

    let displayTide = snapshot.tide;
    if (snapshot.tide && tidePhaseFrom !== null) {
      const t = clamp01(tickBlend);
      const phaseRadians = tidePhaseFrom + snapshot.tide.advancePerTick * t;
      displayTide = { ...snapshot.tide, phaseRadians };
    }

    const demoSurfers: DisplayDemoSurferSnapshot[] = snapshot.demoSurfers.map((surfer) => {
      const segment = this.demoSurfers.get(surfer.id);
      if (!segment) {
        return { ...surfer, trickAnimation: trickAnimationWithProgress(surfer.trickAnimation) };
      }
      const interpolated = interpolateSurfEntity(
        segment,
        surfer.surfboard,
        surfer.trickAnimation,
        tickBlend,
      );
      return {
        ...surfer,
        surfboard: interpolated.surfboard,
        trickAnimation: interpolated.trickAnimation,
      };
    });

    return {
      ...snapshot,
      surfboard: player.surfboard,
      trickAnimation: player.trickAnimation,
      tide: displayTide,
      demoSurfers,
    };
  }
}

function trickAnimationWithProgress(
  animation: TrickAnimationSnapshot | null,
): DisplayTrickAnimation | null {
  if (!animation) {
    return null;
  }
  return { ...animation, progress: trickAnimationProgress(animation) };
}

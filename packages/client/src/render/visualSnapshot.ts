import {
  DEGREES_PER_HEADING,
  headingToDegrees,
  interpolateHeadingIndex,
  type HeadingIndex,
  type SimulationSnapshot,
  type WorldPos,
} from '@osrs-surfing/engine';

function headingDeltaDegrees(from: HeadingIndex, to: HeadingIndex): number {
  const fromDeg = headingToDegrees(from);
  const toDeg = headingToDegrees(to);
  let delta = toDeg - fromDeg;
  if (delta > 180) {
    delta -= 360;
  }
  if (delta < -180) {
    delta += 360;
  }
  return delta;
}

/** Integrates surfboard motion at constant velocity between simulation ticks. */
export class SurfboardMotionInterpolator {
  private displayPosition: WorldPos = { x: 0, y: 0 };
  private displayCurrentHeading = 0;
  private displayIntendedHeading = 0;
  private velocityPerMs: WorldPos = { x: 0, y: 0 };
  private currentHeadingVelocityDegPerMs = 0;
  private intendedHeadingVelocityDegPerMs = 0;

  reset(snapshot: SimulationSnapshot): void {
    this.displayPosition = { ...snapshot.surfboard.position };
    this.displayCurrentHeading = snapshot.surfboard.currentHeading;
    this.displayIntendedHeading = snapshot.surfboard.intendedHeading;
    this.velocityPerMs = { x: 0, y: 0 };
    this.currentHeadingVelocityDegPerMs = 0;
    this.intendedHeadingVelocityDegPerMs = 0;
  }

  onSimulationTick(before: SimulationSnapshot, after: SimulationSnapshot, tickMs: number): void {
    this.displayPosition = { ...before.surfboard.position };
    this.displayCurrentHeading = before.surfboard.currentHeading;
    this.displayIntendedHeading = before.surfboard.intendedHeading;

    const dt = tickMs;
    this.velocityPerMs = {
      x: (after.surfboard.position.x - before.surfboard.position.x) / dt,
      y: (after.surfboard.position.y - before.surfboard.position.y) / dt,
    };
    this.currentHeadingVelocityDegPerMs =
      headingDeltaDegrees(before.surfboard.currentHeading, after.surfboard.currentHeading) / dt;
    this.intendedHeadingVelocityDegPerMs =
      headingDeltaDegrees(before.surfboard.intendedHeading, after.surfboard.intendedHeading) / dt;
  }

  advance(deltaMs: number): void {
    if (deltaMs <= 0) {
      return;
    }

    this.displayPosition = {
      x: this.displayPosition.x + this.velocityPerMs.x * deltaMs,
      y: this.displayPosition.y + this.velocityPerMs.y * deltaMs,
    };
    this.displayCurrentHeading +=
      (this.currentHeadingVelocityDegPerMs * deltaMs) / DEGREES_PER_HEADING;
    this.displayIntendedHeading +=
      (this.intendedHeadingVelocityDegPerMs * deltaMs) / DEGREES_PER_HEADING;
  }

  buildDisplaySnapshot(
    snapshot: SimulationSnapshot,
    tidePhaseFrom: number | null,
    tickBlend: number,
  ): SimulationSnapshot {
    let displayTide = snapshot.tide;
    if (snapshot.tide && tidePhaseFrom !== null) {
      const t = Math.min(1, Math.max(0, tickBlend));
      const phaseRadians = tidePhaseFrom + snapshot.tide.advancePerTick * t;
      displayTide = { ...snapshot.tide, phaseRadians };
    }

    return {
      ...snapshot,
      surfboard: {
        ...snapshot.surfboard,
        position: { ...this.displayPosition },
        currentHeading: this.displayCurrentHeading,
        intendedHeading: this.displayIntendedHeading,
      },
      tide: displayTide,
    };
  }
}

/** @deprecated Use SurfboardMotionInterpolator for client rendering. */
export function buildDisplaySnapshot(
  snapshot: SimulationSnapshot,
  positionFrom: WorldPos,
  headingFrom: HeadingIndex,
  intendedHeadingFrom: HeadingIndex,
  tidePhaseFrom: number | null,
  tickBlend: number,
): SimulationSnapshot {
  const t = Math.min(1, Math.max(0, tickBlend));
  const target = snapshot.surfboard.position;
  const displayPos: WorldPos = {
    x: positionFrom.x + (target.x - positionFrom.x) * t,
    y: positionFrom.y + (target.y - positionFrom.y) * t,
  };

  const displayCurrentHeading = interpolateHeadingIndex(
    headingFrom,
    snapshot.surfboard.currentHeading,
    t,
  );
  const displayIntendedHeading = interpolateHeadingIndex(
    intendedHeadingFrom,
    snapshot.surfboard.intendedHeading,
    t,
  );

  let displayTide = snapshot.tide;
  if (snapshot.tide && tidePhaseFrom !== null) {
    const phaseRadians = tidePhaseFrom + snapshot.tide.advancePerTick * t;
    displayTide = { ...snapshot.tide, phaseRadians };
  }

  return {
    ...snapshot,
    surfboard: {
      ...snapshot.surfboard,
      position: displayPos,
      currentHeading: displayCurrentHeading,
      intendedHeading: displayIntendedHeading,
    },
    tide: displayTide,
  };
}

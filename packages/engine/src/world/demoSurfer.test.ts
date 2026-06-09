import { describe, expect, it } from 'vitest';

import {
  DEMO_SURFER_RING_DEPTH,
  DEMO_SURFER_SPIN_LEADING_FRACTION,
  demoSurferSpawnOnReef,
} from '../ai/demoSurferAi.js';
import { GameSimulation } from '../game/simulation.js';
import {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
} from './coralParkCoast.js';
import { createTideState } from './features.js';
import { getTile, isTileSurfable } from './collision.js';
import { createDemoSurfer, tickDemoSurfer } from './demoSurfer.js';
import { createCoralParkSlice } from './maps.js';

describe('demoSurfer', () => {
  it('carves a tide spin instead of stopping when the swell is too close', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const spawn = demoSurferSpawnOnReef(0);
    const nearLeadingAngle =
      tide.phaseRadians - tide.sweepRadians * DEMO_SURFER_SPIN_LEADING_FRACTION * 0.45;
    const nearInner = coralParkReefInnerRadius(nearLeadingAngle);
    const nearOuter = coralParkReefOuterRadius(nearLeadingAngle);
    const nearRadius = nearInner + (nearOuter - nearInner) * DEMO_SURFER_RING_DEPTH;
    const nearLeading = {
      x: CORAL_PARK_ISLAND_CX + Math.cos(nearLeadingAngle) * nearRadius,
      y: CORAL_PARK_ISLAND_CY + Math.sin(nearLeadingAngle) * nearRadius,
    };

    let runtime = createDemoSurfer({
      ...arena.demoSurfer!,
      startX: nearLeading.x,
      startY: nearLeading.y,
      startHeading: spawn.heading,
    });
    const beforeHeading = runtime.surfboard.currentHeading;

    runtime = tickDemoSurfer(runtime, arena.map, arena.trickZones, tide);

    expect(runtime.tideSpinTicksRemaining).toBeGreaterThan(0);
    expect(runtime.surfboard.speedState).not.toBe('seated');
    expect(runtime.surfboard.currentHeading).not.toBe(beforeHeading);
  });

  it('rides the reef loop without leaving surfable water', () => {
    const arena = createCoralParkSlice();
    expect(arena.demoSurfer).not.toBeNull();

    const tide = createTideState(arena.tide!);
    let runtime = createDemoSurfer(arena.demoSurfer!);

    for (let i = 0; i < 600; i += 1) {
      runtime = tickDemoSurfer(runtime, arena.map, arena.trickZones, tide);
      const { x, y } = runtime.surfboard.position;
      const tile = getTile(arena.map, Math.floor(x), Math.floor(y));
      expect(tile).not.toBeNull();
      expect(isTileSurfable(tile!)).toBe(true);
    }
  });

  it('appears in simulation snapshots when configured', () => {
    const arena = createCoralParkSlice();
    const sim = new GameSimulation({ arena });

    for (let i = 0; i < 40; i += 1) {
      sim.tick();
    }

    const snapshot = sim.getSnapshot();
    expect(snapshot.demoSurfer).not.toBeNull();
    expect(snapshot.demoSurfer?.name).toBe('Nalu');
    expect(snapshot.demoSurfer?.surfboard.speedState).not.toBe('seated');
  });

  it('rides clockwise and performs trick animations without affecting player progression', () => {
    const arena = createCoralParkSlice();
    const sim = new GameSimulation({ arena });
    const beforeTricks = sim.getSnapshot().progression.session.tricksLanded;
    let trickStarts = 0;
    let unwrap = 0;
    let prevAngle: number | null = null;

    for (let i = 0; i < 1200; i += 1) {
      const before = sim.getSnapshot().demoSurfer?.trickAnimation;
      sim.tick();
      const demo = sim.getSnapshot().demoSurfer;
      if (!demo) {
        break;
      }
      if (!before && demo.trickAnimation) {
        trickStarts += 1;
      }

      const angle = Math.atan2(
        demo.surfboard.position.y - CORAL_PARK_ISLAND_CY,
        demo.surfboard.position.x - CORAL_PARK_ISLAND_CX,
      );
      if (prevAngle !== null) {
        let delta = angle - prevAngle;
        if (delta > Math.PI) {
          delta -= Math.PI * 2;
        }
        if (delta < -Math.PI) {
          delta += Math.PI * 2;
        }
        unwrap += delta;
      }
      prevAngle = angle;
    }

    expect(unwrap).toBeGreaterThan(1);
    expect(trickStarts).toBeGreaterThanOrEqual(3);
    expect(sim.getSnapshot().progression.session.tricksLanded).toBe(beforeTricks);
    expect(sim.getSnapshot().demoSurfer?.surfboard.speedState).not.toBe('seated');
  });
});

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
import { createTideState, isPointInTideSweep, tickTide } from './features.js';
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
      ...arena.demoSurfers[0],
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
    expect(arena.demoSurfers.length).toBeGreaterThanOrEqual(4);

    const tide = createTideState(arena.tide!);
    let runtime = createDemoSurfer(arena.demoSurfers[0]);

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
    expect(snapshot.demoSurfers.map((surfer) => surfer.name)).toEqual([
      'Nalu',
      'Kai',
      'Hina',
      'Tama',
    ]);
    expect(snapshot.demoSurfers[0].surfboard.speedState).not.toBe('seated');
  });

  it('keeps the sector surfer patrolling near the south-west headland', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const kai = arena.demoSurfers.find((surfer) => surfer.id === 'kai')!;
    const behavior = kai.behavior!;
    if (behavior.kind !== 'sector') {
      throw new Error('Kai should patrol a sector');
    }
    let runtime = createDemoSurfer(kai);

    for (let i = 0; i < 1200; i += 1) {
      runtime = tickDemoSurfer(runtime, arena.map, arena.trickZones, tide);
      const { x, y } = runtime.surfboard.position;
      const angle = Math.atan2(y - CORAL_PARK_ISLAND_CY, x - CORAL_PARK_ISLAND_CX);
      let delta = (angle - behavior.centerRadians) % (Math.PI * 2);
      if (delta > Math.PI) {
        delta -= Math.PI * 2;
      }
      if (delta < -Math.PI) {
        delta += Math.PI * 2;
      }
      expect(Math.abs(delta)).toBeLessThan(behavior.halfWidthRadians + 0.4);
    }
  });

  it('lets the explorer roam widely and visit the high-tide band', () => {
    const arena = createCoralParkSlice();
    const tide = createTideState(arena.tide!);
    const tama = arena.demoSurfers.find((surfer) => surfer.id === 'tama')!;
    expect(tama.behavior?.kind).toBe('explorer');
    let runtime = createDemoSurfer(tama);
    let movingTide = tide;

    let visitedSweep = false;
    let maxTravel = 0;

    for (let i = 0; i < 2400; i += 1) {
      movingTide = tickTide(movingTide);
      runtime = tickDemoSurfer(runtime, arena.map, arena.trickZones, movingTide);
      const { x, y } = runtime.surfboard.position;
      const tile = getTile(arena.map, Math.floor(x), Math.floor(y));
      expect(tile).not.toBeNull();
      expect(isTileSurfable(tile!)).toBe(true);
      if (isPointInTideSweep(x, y, movingTide)) {
        visitedSweep = true;
      }
      maxTravel = Math.max(maxTravel, Math.hypot(x - tama.startX, y - tama.startY));
    }

    expect(visitedSweep).toBe(true);
    expect(maxTravel).toBeGreaterThan(80);
  });

  it('rides clockwise and performs trick animations without affecting player progression', () => {
    const arena = createCoralParkSlice();
    const sim = new GameSimulation({ arena });
    const beforeTricks = sim.getSnapshot().progression.session.tricksLanded;
    let trickStarts = 0;
    let unwrap = 0;
    let prevAngle: number | null = null;

    for (let i = 0; i < 2400; i += 1) {
      const before = sim.getSnapshot().demoSurfers[0]?.trickAnimation;
      sim.tick();
      const demo = sim.getSnapshot().demoSurfers[0];
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
    expect(sim.getSnapshot().demoSurfers[0].surfboard.speedState).not.toBe('seated');
  });
});

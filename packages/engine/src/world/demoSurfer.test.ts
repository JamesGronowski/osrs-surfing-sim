import { describe, expect, it } from 'vitest';

import { GameSimulation } from '../game/simulation.js';
import { CORAL_PARK_ISLAND_CX, CORAL_PARK_ISLAND_CY } from './coralParkCoast.js';
import { createTideState } from './features.js';
import { getTile, isTileSurfable } from './collision.js';
import { createDemoSurfer, tickDemoSurfer } from './demoSurfer.js';
import { createCoralParkSlice } from './maps.js';

describe('demoSurfer', () => {
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

    for (let i = 0; i < 5; i += 1) {
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

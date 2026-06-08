import { describe, expect, it } from 'vitest';

import { getTile } from '../world/collision.js';
import { createCoralParkSlice } from '../world/maps.js';
import { GameSimulation } from './simulation.js';

describe('Coral Park gameplay flow', () => {
  it('supports walk, NPC talk, mount, sail, and rhythm trick', () => {
    const arena = createCoralParkSlice();
    for (const zone of arena.trickZones) {
      const tile = getTile(arena.map, Math.floor(zone.center.x), Math.floor(zone.center.y));
      expect(tile).toBe('coral_rideable');
    }

    const sim = new GameSimulation({ arena });

    sim.clickWorld(arena.npcs[0].x, arena.npcs[0].y);
    for (let i = 0; i < 8; i += 1) {
      sim.tick();
    }
    expect(sim.consumeDialogue().some((line) => line.includes('Kaulu'))).toBe(true);

    sim.clickWorld(arena.boardDockX, arena.boardDockY);
    for (let i = 0; i < 100; i += 1) {
      sim.tick();
      if (sim.getSnapshot().boardMounted) {
        break;
      }
    }
    expect(sim.getSnapshot().boardMounted).toBe(true);

    const riderPos = sim.getSnapshot().surfboard.position;
    const rail = arena.trickZones
      .filter((zone) => zone.type === 'rail')
      .sort((a, b) => {
        const da = Math.hypot(a.center.x - riderPos.x, a.center.y - riderPos.y);
        const db = Math.hypot(b.center.x - riderPos.x, b.center.y - riderPos.y);
        return da - db;
      })[0]!;
    sim.setSpeedState('paddling');
    const approachX = rail.center.x + Math.cos(rail.rotationRadians) * 4;
    const approachY = rail.center.y + Math.sin(rail.rotationRadians) * 4;
    sim.clickOcean(approachX, approachY);
    sim.setSpeedState('riding');

    const beforeTricks = sim.getSnapshot().progression.session.tricksLanded;
    let tricked = false;

    for (let i = 0; i < 400; i += 1) {
      const pos = sim.getSnapshot().surfboard.position;
      const dist = Math.hypot(pos.x - rail.center.x, pos.y - rail.center.y);
      if (dist > 10) {
        sim.clickOcean(rail.center.x, rail.center.y);
      } else if (dist > rail.radius) {
        sim.clickOcean(rail.center.x, rail.center.y);
      } else {
        const aheadX = pos.x + Math.cos(rail.rotationRadians) * 4;
        const aheadY = pos.y + Math.sin(rail.rotationRadians) * 4;
        sim.clickOcean(aheadX, aheadY);
      }
      if (dist < 7 && dist > rail.radius * 0.6 && !sim.getSnapshot().trickPrepare) {
        sim.prepareTrick(rail.prepareSlot);
      }
      sim.tick();
      if (sim.getSnapshot().progression.session.tricksLanded > beforeTricks) {
        tricked = true;
        break;
      }
    }

    expect(tricked).toBe(true);
    expect(sim.consumeXpDrops().length).toBeGreaterThan(0);
  });
});

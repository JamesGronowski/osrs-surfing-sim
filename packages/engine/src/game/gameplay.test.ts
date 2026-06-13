import { describe, expect, it } from 'vitest';

import { getTile } from '../world/collision.js';
import { isTrickZoneSubmerged } from '../world/features.js';
import { createCoralParkSlice } from '../world/maps.js';
import { GameSimulation } from './simulation.js';

describe('Coral Park gameplay flow', () => {
  // Random feature layouts can defeat the scripted steering; retry fresh arenas.
  it('supports walk, NPC talk, mount, sail, and rhythm trick', { retry: 2 }, () => {
    const arena = createCoralParkSlice();
    for (const zone of arena.trickZones) {
      const tile = getTile(arena.map, Math.floor(zone.center.x), Math.floor(zone.center.y));
      expect(tile).toBe('coral_rideable');
    }

    const sim = new GameSimulation({ arena });
    sim.setTideFrozen(true);

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

    const tide = sim.getSnapshot().tide;
    expect(tide).not.toBeNull();
    const riderPos = sim.getSnapshot().surfboard.position;
    const railCandidates = arena.trickZones
      .filter(
        (zone) => zone.type === 'rail' && (tide === null || !isTrickZoneSubmerged(zone, tide)),
      )
      .sort((a, b) => {
        const da = Math.hypot(a.center.x - riderPos.x, a.center.y - riderPos.y);
        const db = Math.hypot(b.center.x - riderPos.x, b.center.y - riderPos.y);
        return da - db;
      })
      .slice(0, 3);
    expect(railCandidates.length).toBeGreaterThan(0);
    sim.setSpeedState('paddling');
    sim.setSpeedState('riding');

    const pursueRail = (rail: (typeof railCandidates)[number], ticks: number): boolean => {
      const beforeTricks = sim.getSnapshot().progression.session.tricksLanded;
      let lastPos = { x: Number.NaN, y: Number.NaN };
      for (let i = 0; i < ticks; i += 1) {
        if (sim.getSnapshot().surfboard.speedState === 'seated') {
          sim.setSpeedState('riding');
        }
        const pos = sim.getSnapshot().surfboard.position;
        const stuck = Math.hypot(pos.x - lastPos.x, pos.y - lastPos.y) < 0.05;
        lastPos = { x: pos.x, y: pos.y };
        const dist = Math.hypot(pos.x - rail.center.x, pos.y - rail.center.y);
        // Aim well past the zone: clicking the centre itself sits inside the
        // board's turning circle at ride speed and traps the rider in an orbit.
        // When wedged against land or the swell, fall back to the zone centre.
        const throughX = rail.center.x + ((rail.center.x - pos.x) / Math.max(dist, 1)) * 15;
        const throughY = rail.center.y + ((rail.center.y - pos.y) / Math.max(dist, 1)) * 15;
        if (stuck) {
          sim.clickOcean(rail.center.x, rail.center.y);
        } else {
          sim.clickOcean(throughX, throughY);
        }
        if (dist < 8 && dist > rail.radius * 0.5 && !sim.getSnapshot().trickPrepare) {
          sim.prepareTrick(rail.prepareSlot);
        }
        sim.tick();
        if (sim.getSnapshot().progression.session.tricksLanded > beforeTricks) {
          return true;
        }
      }
      return false;
    };

    // An awkwardly placed rail can defeat the simple steering above; move on
    // to the next nearest one like a player would.
    const tricked = railCandidates.some((rail) => pursueRail(rail, 450));

    expect(tricked).toBe(true);
    expect(sim.consumeXpDrops().length).toBeGreaterThan(0);
  });

  it('keeps combo across many ticks until a trick is bailed', () => {
    const arena = createCoralParkSlice();
    const sim = new GameSimulation({
      arena,
      initialProgression: {
        xp: { agility: 100, sailing: 80 },
        coralTokens: 12,
        unlocked: new Set(),
        session: { tricksLanded: 4, combo: 4, maxCombo: 4 },
      },
    });

    for (let i = 0; i < 200; i += 1) {
      sim.tick();
    }

    expect(sim.getSnapshot().progression.session.combo).toBe(4);
  });

  it('dismounts on sand and leaves the board at that spot', () => {
    const arena = createCoralParkSlice();
    const sim = new GameSimulation({ arena });

    sim.clickWorld(arena.boardDockX, arena.boardDockY);
    for (let i = 0; i < 100; i += 1) {
      sim.tick();
      if (sim.getSnapshot().boardMounted) {
        break;
      }
    }
    expect(sim.getSnapshot().boardMounted).toBe(true);
    expect(sim.getSnapshot().canDismountBoard).toBe(true);

    const boardX = sim.getSnapshot().surfboard.position.x;
    const boardY = sim.getSnapshot().surfboard.position.y;
    expect(sim.tryDismountBoard()).toBeNull();
    const after = sim.getSnapshot();
    expect(after.boardMounted).toBe(false);
    expect(after.boardDockX).toBeCloseTo(boardX);
    expect(after.boardDockY).toBeCloseTo(boardY);
    expect(sim.consumeDialogue().some((line) => line.includes('leave your surfboard'))).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';

import {
  ANIMATION_TEST_ALIGNED_ROW_Y,
  ANIMATION_TEST_COUNTER_ROW_Y,
  ANIMATION_TEST_ZONE_TYPES,
  animationTestZoneCenter,
  createAnimationTestSlice,
} from './animationTestArena.js';
import { getTile, isWorldPointSailingTarget } from './collision.js';

describe('animation test arena', () => {
  const arena = createAnimationTestSlice();

  it('is deterministic: aligned and counter-rotated rows with one zone per type', () => {
    const aligned = arena.trickZones.filter((zone) => zone.rotationRadians === 0);
    const counter = arena.trickZones.filter((zone) => zone.rotationRadians === Math.PI);
    expect(aligned.map((zone) => zone.type)).toEqual(ANIMATION_TEST_ZONE_TYPES);
    expect(counter.map((zone) => zone.type)).toEqual(ANIMATION_TEST_ZONE_TYPES);

    aligned.forEach((zone, index) => {
      expect(zone.center).toEqual(animationTestZoneCenter(index, ANIMATION_TEST_ALIGNED_ROW_Y));
      expect(zone.tricked).toBe(false);
    });
    counter.forEach((zone, index) => {
      expect(zone.center).toEqual(animationTestZoneCenter(index, ANIMATION_TEST_COUNTER_ROW_Y));
      expect(zone.tricked).toBe(false);
    });
  });

  it('has no tide, NPCs, or demo surfers to interfere with captures', () => {
    expect(arena.tide).toBeNull();
    expect(arena.npcs).toEqual([]);
    expect(arena.demoSurfers).toEqual([]);
  });

  it('spawns the player and board dock on the sand pad', () => {
    expect(getTile(arena.map, Math.floor(arena.spawnX), Math.floor(arena.spawnY))).toBe('sand');
    expect(getTile(arena.map, Math.floor(arena.boardDockX), Math.floor(arena.boardDockY))).toBe(
      'sand',
    );
  });

  it('keeps every approach and exit lane on open water', () => {
    for (const zone of arena.trickZones) {
      for (const offset of [-8, -4, 0, 4, 8]) {
        expect(isWorldPointSailingTarget(arena.map, zone.center.x + offset, zone.center.y)).toBe(
          true,
        );
      }
    }
  });
});

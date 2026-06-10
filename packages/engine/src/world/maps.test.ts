import { describe, expect, it } from 'vitest';

import {
  CORAL_PARK_GRASS_EDGE_SURFACE_Y,
  CORAL_PARK_GRASS_PEAK_SURFACE_Y,
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  CORAL_PARK_MAP_HEIGHT,
  CORAL_PARK_MAP_WIDTH,
  CORAL_PARK_SAND_OUTER_SURFACE_Y,
  coralParkGrassRadius,
  coralParkLandSurfaceY,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
  coralParkSandRadius,
  coralParkShallowRadius,
} from './coralParkCoast.js';
import { getTile } from './collision.js';
import { createCoralParkSlice } from './maps.js';

describe('coralParkLandSurfaceY', () => {
  it('peaks at the island centre and stays low on the sand ring', () => {
    const centreY = coralParkLandSurfaceY(CORAL_PARK_ISLAND_CX, CORAL_PARK_ISLAND_CY, 'grass');
    const east = 0;
    const grassEdge = coralParkGrassRadius(east);
    const sandOuter = coralParkSandRadius(east);
    const grassRimY = coralParkLandSurfaceY(
      CORAL_PARK_ISLAND_CX + grassEdge,
      CORAL_PARK_ISLAND_CY,
      'grass',
    );
    const sandShoreY = coralParkLandSurfaceY(
      CORAL_PARK_ISLAND_CX + sandOuter,
      CORAL_PARK_ISLAND_CY,
      'sand',
    );

    expect(centreY).toBeCloseTo(CORAL_PARK_GRASS_PEAK_SURFACE_Y, 5);
    expect(grassRimY).toBeCloseTo(CORAL_PARK_GRASS_EDGE_SURFACE_Y, 5);
    expect(sandShoreY).toBeCloseTo(CORAL_PARK_SAND_OUTER_SURFACE_Y, 5);
    expect(centreY).toBeGreaterThan(grassRimY);
    expect(grassRimY).toBeGreaterThan(sandShoreY);
  });
});

describe('createCoralParkSlice', () => {
  it('places an organic island, sand ring, shallow channel, and wide reef loop', () => {
    const arena = createCoralParkSlice();
    const { map } = arena;
    const east = 0;

    expect(getTile(map, CORAL_PARK_ISLAND_CX, CORAL_PARK_ISLAND_CY)).toBe('grass');
    const beachMid = (coralParkGrassRadius(east) + coralParkSandRadius(east)) * 0.5;
    expect(getTile(map, Math.floor(CORAL_PARK_ISLAND_CX + beachMid), CORAL_PARK_ISLAND_CY)).toBe(
      'sand',
    );
    const shallowMid = (coralParkSandRadius(east) + coralParkShallowRadius(east)) * 0.5;
    expect(getTile(map, Math.floor(CORAL_PARK_ISLAND_CX + shallowMid), CORAL_PARK_ISLAND_CY)).toBe(
      'shallow',
    );
    const reefMid = (coralParkReefInnerRadius(east) + coralParkReefOuterRadius(east)) * 0.5;
    expect(getTile(map, Math.floor(CORAL_PARK_ISLAND_CX + reefMid), CORAL_PARK_ISLAND_CY)).toBe(
      'coral_rideable',
    );
    expect(getTile(map, CORAL_PARK_ISLAND_CX, Math.floor(CORAL_PARK_ISLAND_CY - reefMid))).toBe(
      'coral_rideable',
    );
  });

  it('fills the expanded map with open deep water beyond the reef', () => {
    const arena = createCoralParkSlice();
    const { map } = arena;
    const east = 0;
    const outerReef = coralParkReefOuterRadius(east);

    expect(map.widthTiles).toBe(CORAL_PARK_MAP_WIDTH);
    expect(map.heightTiles).toBe(CORAL_PARK_MAP_HEIGHT);
    expect(getTile(map, 0, 0)).toBe('deep_water');
    expect(getTile(map, map.widthTiles - 1, map.heightTiles - 1)).toBe('deep_water');
    expect(
      getTile(map, Math.ceil(CORAL_PARK_ISLAND_CX + outerReef + 12), CORAL_PARK_ISLAND_CY),
    ).toBe('deep_water');
  });

  it('spawns on the island with the board on the sand ring and spaced reef tricks', () => {
    const arena = createCoralParkSlice();

    expect(mapTile(arena.map, arena.spawnX, arena.spawnY)).toBe('sand');
    expect(mapTile(arena.map, arena.npcs[0].x, arena.npcs[0].y)).toBe('sand');
    expect(mapTile(arena.map, arena.boardDockX, arena.boardDockY)).toBe('sand');
    expect(arena.npcs).toHaveLength(1);
    expect(arena.demoSurfers.map((surfer) => surfer.name)).toEqual(['Nalu', 'Kai', 'Hina', 'Tama']);
    for (const surfer of arena.demoSurfers) {
      expect(mapTile(arena.map, surfer.startX, surfer.startY)).toBe('coral_rideable');
    }
    expect(arena.trickZones.length).toBeGreaterThanOrEqual(12);
    expect(arena.map.widthTiles).toBeGreaterThanOrEqual(560);

    const minGap = minTrickZoneGap(arena.trickZones);
    expect(minGap).toBeGreaterThan(8);
  });
});

function mapTile(
  map: ReturnType<typeof createCoralParkSlice>['map'],
  x: number,
  y: number,
): string | null {
  return getTile(map, Math.floor(x), Math.floor(y));
}

function minTrickZoneGap(zones: ReturnType<typeof createCoralParkSlice>['trickZones']): number {
  let min = Infinity;
  for (let i = 0; i < zones.length; i += 1) {
    for (let j = i + 1; j < zones.length; j += 1) {
      const a = zones[i];
      const b = zones[j];
      const gap =
        Math.hypot(a.center.x - b.center.x, a.center.y - b.center.y) - a.radius - b.radius;
      min = Math.min(min, gap);
    }
  }
  return min;
}

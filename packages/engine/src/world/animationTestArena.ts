import { createWorldMap, setTile } from './collision.js';
import { CORAL_PARK_TRICK_ZONE_RADIUS, TRICK_TYPE_TO_PREPARE_SLOT } from './trickZonePlacement.js';

import type { GameArena } from './maps.js';
import type { TrickFeatureType, TrickZone } from './features.js';

/**
 * Minimal deterministic arena for animation and trick-direction testing:
 * flat open water, no tide, no NPCs or demo surfers, and one zone per
 * feature type on a fixed east-facing row so approaches are reproducible.
 */
export const ANIMATION_TEST_MAP_WIDTH = 120;
export const ANIMATION_TEST_MAP_HEIGHT = 64;

/** Row of zones riding due east (rotation 0). */
export const ANIMATION_TEST_ALIGNED_ROW_Y = 26;
/** Row of counter-rotated zones (axis faces west) to exercise wrong-way entries. */
export const ANIMATION_TEST_COUNTER_ROW_Y = 44;
export const ANIMATION_TEST_ZONE_SPACING = 18;
export const ANIMATION_TEST_FIRST_ZONE_X = 28;

export const ANIMATION_TEST_ZONE_TYPES: TrickFeatureType[] = [
  'rail',
  'brain_coral',
  'tunnel',
  'wall_ride',
  'jump',
];

const SAND_PAD = { minX: 2, maxX: 9, minY: 31, maxY: 39 };

export function animationTestZoneCenter(index: number, rowY: number): { x: number; y: number } {
  return {
    x: ANIMATION_TEST_FIRST_ZONE_X + index * ANIMATION_TEST_ZONE_SPACING,
    y: rowY,
  };
}

function buildZoneRow(rowY: number, rotationRadians: number, idSuffix: string): TrickZone[] {
  return ANIMATION_TEST_ZONE_TYPES.map((type, index) => ({
    id: `anim-${type}${idSuffix}`,
    type,
    prepareSlot: TRICK_TYPE_TO_PREPARE_SLOT[type],
    center: animationTestZoneCenter(index, rowY),
    radius: CORAL_PARK_TRICK_ZONE_RADIUS,
    rotationRadians,
    tricked: false,
  }));
}

export function createAnimationTestSlice(): GameArena {
  const map = createWorldMap(ANIMATION_TEST_MAP_WIDTH, ANIMATION_TEST_MAP_HEIGHT, 'deep_water');

  for (let ty = SAND_PAD.minY; ty <= SAND_PAD.maxY; ty += 1) {
    for (let tx = SAND_PAD.minX; tx <= SAND_PAD.maxX; tx += 1) {
      setTile(map, tx, ty, 'sand');
    }
  }

  return {
    map,
    spawnX: 5.5,
    spawnY: 35.5,
    spawnHeading: 0,
    boardDockX: SAND_PAD.maxX + 0.5,
    boardDockY: 35.5,
    requiresBoardMount: true,
    trickZones: [
      ...buildZoneRow(ANIMATION_TEST_ALIGNED_ROW_Y, 0, ''),
      ...buildZoneRow(ANIMATION_TEST_COUNTER_ROW_Y, Math.PI, '-counter'),
    ],
    tide: null,
    npcs: [],
    demoSurfers: [],
  };
}

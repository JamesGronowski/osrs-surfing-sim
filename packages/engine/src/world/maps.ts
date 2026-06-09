import { createWorldMap, setTile, type WorldMap } from './collision.js';
import {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  CORAL_PARK_MAP_HEIGHT,
  CORAL_PARK_MAP_WIDTH,
  CORAL_PARK_REEF_INNER_MEAN,
  CORAL_PARK_REEF_OUTER_MEAN,
  coralParkGrassRadius,
  coralParkReefInnerRadius,
  coralParkReefOuterRadius,
  coralParkSandRadius,
  coralParkShallowRadius,
  coralParkTileAngle,
  coralParkTileDistance,
} from './coralParkCoast.js';
import { demoSurferSpawnOnReef } from '../ai/demoSurferAi.js';
import type { DemoSurferConfig } from './demoSurfer.js';
import type { TideConfig, TrickZone } from './features.js';
import type { NpcDefinition } from './npc.js';
import {
  CORAL_PARK_TRICK_ZONE_RADIUS,
  isFarEnoughFromZones,
  randomRingDepth,
  randomTrickRotationJitterRadians,
  reefCenterAtAngle,
  RING_DEPTH_SPAWN_ATTEMPTS,
  TRICK_FEATURE_TYPES,
  TRICK_TYPE_TO_PREPARE_SLOT,
  trickSlotAngle,
  trickZoneRotationRadians,
} from './trickZonePlacement.js';

export {
  CORAL_PARK_GRASS_EDGE_SURFACE_Y,
  CORAL_PARK_GRASS_PEAK_SURFACE_Y,
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  CORAL_PARK_MAP_HEIGHT,
  CORAL_PARK_MAP_WIDTH,
  CORAL_PARK_SAND_OUTER_SURFACE_Y,
  coralParkLandElevationKey,
  coralParkLandSurfaceY,
} from './coralParkCoast.js';

export interface GameArena {
  map: WorldMap;
  spawnX: number;
  spawnY: number;
  spawnHeading: number;
  boardDockX: number;
  boardDockY: number;
  requiresBoardMount: boolean;
  trickZones: TrickZone[];
  tide: TideConfig | null;
  npcs: NpcDefinition[];
  demoSurfer: DemoSurferConfig | null;
}

export const CORAL_PARK_TRICK_ZONE_COUNT = 15;

function buildTrickZones(map: WorldMap): TrickZone[] {
  const zones: TrickZone[] = [];

  for (let i = 0; i < CORAL_PARK_TRICK_ZONE_COUNT; i += 1) {
    const positionAngle = trickSlotAngle(i, CORAL_PARK_TRICK_ZONE_COUNT);
    let center: { x: number; y: number } | null = null;
    for (let attempt = 0; attempt < RING_DEPTH_SPAWN_ATTEMPTS; attempt += 1) {
      const candidate = reefCenterAtAngle(map, positionAngle, randomRingDepth());
      if (candidate && isFarEnoughFromZones(candidate, zones)) {
        center = candidate;
        break;
      }
    }
    if (!center) {
      continue;
    }

    const type = TRICK_FEATURE_TYPES[i % TRICK_FEATURE_TYPES.length];
    const counterRide = i % 5 === 0;
    const rotation = trickZoneRotationRadians(positionAngle, counterRide, type);

    zones.push({
      id: `${type}-${i}`,
      type,
      prepareSlot: TRICK_TYPE_TO_PREPARE_SLOT[type],
      center,
      radius: CORAL_PARK_TRICK_ZONE_RADIUS,
      rotationRadians: rotation,
      rotationJitterRadians: randomTrickRotationJitterRadians(),
      tricked: false,
    });
  }

  return zones;
}

export function createCoralParkSlice(): GameArena {
  const width = CORAL_PARK_MAP_WIDTH;
  const height = CORAL_PARK_MAP_HEIGHT;
  const map = createWorldMap(width, height, 'deep_water');

  for (let ty = 0; ty < height; ty += 1) {
    for (let tx = 0; tx < width; tx += 1) {
      const angle = coralParkTileAngle(tx, ty);
      const dist = coralParkTileDistance(tx, ty);
      const grassR = coralParkGrassRadius(angle);
      const sandR = coralParkSandRadius(angle);
      const shallowR = coralParkShallowRadius(angle);
      const reefInnerR = coralParkReefInnerRadius(angle);
      const reefOuterR = coralParkReefOuterRadius(angle);

      if (dist <= grassR) {
        setTile(map, tx, ty, 'grass');
      } else if (dist <= sandR) {
        setTile(map, tx, ty, 'sand');
      } else if (dist <= shallowR) {
        setTile(map, tx, ty, 'shallow');
      } else if (dist >= reefInnerR && dist <= reefOuterR) {
        setTile(map, tx, ty, 'coral_rideable');
      }
    }
  }

  const southAngle = Math.PI / 2;
  const southSandR = coralParkSandRadius(southAngle);
  const boardDockX = CORAL_PARK_ISLAND_CX;
  const boardDockY = CORAL_PARK_ISLAND_CY + southSandR - 1.5;
  const spawnX = boardDockX - 1.2;
  const spawnY = boardDockY - 1.8;
  const guruX = boardDockX + 1.2;
  const guruY = boardDockY - 1.5;
  const demoSurferSpawn = demoSurferSpawnOnReef(-Math.PI / 4);

  return {
    map,
    spawnX,
    spawnY,
    spawnHeading: 4,
    boardDockX,
    boardDockY,
    requiresBoardMount: true,
    tide: {
      centerX: CORAL_PARK_ISLAND_CX,
      centerY: CORAL_PARK_ISLAND_CY,
      innerRadius: CORAL_PARK_REEF_INNER_MEAN,
      outerRadius: CORAL_PARK_REEF_OUTER_MEAN,
      innerRadiusAtAngle: coralParkReefInnerRadius,
      outerRadiusAtAngle: coralParkReefOuterRadius,
      sweepRadians: Math.PI / 1.35,
      advancePerTick: 0.044,
    },
    npcs: [
      {
        id: 'guru',
        name: 'Kaulu the Surf Guru',
        x: guruX,
        y: guruY,
        interactRadius: 0.9,
        dialogue: [
          'Welcome to Coral Park, surfer!',
          'Your board sits on the sand ring — click it when you are ready.',
          'Ride the wide reef loop around the island.',
          'Yellow chevrons show which way to ride through each feature.',
          'Prime a trick button 1–4 ticks before you hit the matching coral.',
          "Tai'ura's tide submerges features — they fade underwater, then fresh coral rises as the swell passes.",
          'Watch Nalu ride the reef loop — she times the swell to hit every feature in the dry zone.',
        ],
      },
    ],
    demoSurfer: {
      id: 'nalu',
      name: 'Nalu',
      startX: demoSurferSpawn.x,
      startY: demoSurferSpawn.y,
      startHeading: demoSurferSpawn.heading,
    },
    trickZones: buildTrickZones(map),
  };
}

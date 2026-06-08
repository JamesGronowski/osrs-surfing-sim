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
import type { TideConfig, TrickZone } from './features.js';
import type { NpcDefinition } from './npc.js';
import {
  clockwiseTangent,
  CORAL_PARK_TRICK_ZONE_RADIUS,
  isFarEnoughFromZones,
  reefCenterAtAngle,
  TRICK_FEATURE_TYPES,
  TRICK_TYPE_TO_PREPARE_SLOT,
} from './trickZonePlacement.js';

export {
  CORAL_PARK_ISLAND_CX,
  CORAL_PARK_ISLAND_CY,
  CORAL_PARK_MAP_HEIGHT,
  CORAL_PARK_MAP_WIDTH,
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
}

const TRICK_RING_POSITIONS = [0.32, 0.62, 0.88];
export const CORAL_PARK_TRICK_ZONE_COUNT = 15;

function buildTrickZones(map: WorldMap): TrickZone[] {
  const zones: TrickZone[] = [];
  const angleStep = (Math.PI * 2) / CORAL_PARK_TRICK_ZONE_COUNT;

  for (let i = 0; i < CORAL_PARK_TRICK_ZONE_COUNT; i += 1) {
    const positionAngle = i * angleStep + 0.22;
    const ringT = TRICK_RING_POSITIONS[i % TRICK_RING_POSITIONS.length];
    const center = reefCenterAtAngle(map, positionAngle, ringT);
    if (!center || !isFarEnoughFromZones(center, zones)) {
      continue;
    }

    const type = TRICK_FEATURE_TYPES[i % TRICK_FEATURE_TYPES.length];
    const counterRide = i % 5 === 0;
    const rotation = counterRide ? positionAngle + Math.PI / 2 : clockwiseTangent(positionAngle);

    zones.push({
      id: `${type}-${i}`,
      type,
      prepareSlot: TRICK_TYPE_TO_PREPARE_SLOT[type],
      center,
      radius: CORAL_PARK_TRICK_ZONE_RADIUS,
      rotationRadians: rotation,
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
  const spawnX = CORAL_PARK_ISLAND_CX - 2;
  const spawnY = CORAL_PARK_ISLAND_CY;
  const boardDockX = CORAL_PARK_ISLAND_CX;
  const boardDockY = CORAL_PARK_ISLAND_CY + southSandR - 1.5;

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
        x: CORAL_PARK_ISLAND_CX,
        y: CORAL_PARK_ISLAND_CY,
        interactRadius: 0.9,
        dialogue: [
          'Welcome to Coral Park, surfer!',
          'Your board sits on the sand ring — click it when you are ready.',
          'Ride the wide reef loop around the island.',
          'Yellow chevrons show which way to ride through each feature.',
          'Prime a trick button 1–4 ticks before you hit the matching coral.',
          "Tai'ura's tide submerges features — new ones wash up wherever the reef dries out.",
        ],
      },
    ],
    trickZones: buildTrickZones(map),
  };
}

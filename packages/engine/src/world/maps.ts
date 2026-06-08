import type { TrickPrepareSlot } from '../constants/tricks.js';
import { createWorldMap, getTile, setTile, type WorldMap } from './collision.js';
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
import type { TideConfig, TrickFeatureType, TrickZone } from './features.js';
import type { NpcDefinition } from './npc.js';

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

const CORAL_PARK_TRICK_ZONE_RADIUS = 4;

const TRICK_TYPES: TrickFeatureType[] = ['rail', 'tunnel', 'jump', 'brain_coral', 'wall_ride'];
const TYPE_TO_SLOT: Record<TrickFeatureType, TrickPrepareSlot> = {
  rail: 0,
  tunnel: 1,
  jump: 2,
  brain_coral: 0,
  wall_ride: 1,
};

const TRICK_RING_POSITIONS = [0.32, 0.62, 0.88];
const TRICK_ZONE_COUNT = 15;
const MIN_TRICK_CENTER_GAP = 12;

/** Clockwise reef ride tangent at a given polar angle. */
function clockwiseTangent(angle: number): number {
  return angle - Math.PI / 2;
}

function reefCenterAtAngle(
  map: WorldMap,
  positionAngle: number,
  ringT: number,
): { x: number; y: number } | null {
  const inner = coralParkReefInnerRadius(positionAngle);
  const outer = coralParkReefOuterRadius(positionAngle);
  for (let t = ringT; t >= 0.18; t -= 0.04) {
    const radius = inner + (outer - inner) * t;
    const x = CORAL_PARK_ISLAND_CX + Math.cos(positionAngle) * radius;
    const y = CORAL_PARK_ISLAND_CY + Math.sin(positionAngle) * radius;
    const tile = getTile(map, Math.floor(x), Math.floor(y));
    if (tile === 'coral_rideable') {
      return { x, y };
    }
  }
  return null;
}

function isFarEnoughFromZones(center: { x: number; y: number }, zones: TrickZone[]): boolean {
  for (const zone of zones) {
    const gap =
      Math.hypot(center.x - zone.center.x, center.y - zone.center.y) -
      CORAL_PARK_TRICK_ZONE_RADIUS * 2;
    if (gap < MIN_TRICK_CENTER_GAP) {
      return false;
    }
  }
  return true;
}

function buildTrickZones(map: WorldMap): TrickZone[] {
  const zones: TrickZone[] = [];
  const angleStep = (Math.PI * 2) / TRICK_ZONE_COUNT;

  for (let i = 0; i < TRICK_ZONE_COUNT; i += 1) {
    const positionAngle = i * angleStep + 0.22;
    const ringT = TRICK_RING_POSITIONS[i % TRICK_RING_POSITIONS.length];
    const center = reefCenterAtAngle(map, positionAngle, ringT);
    if (!center || !isFarEnoughFromZones(center, zones)) {
      continue;
    }

    const type = TRICK_TYPES[i % TRICK_TYPES.length];
    const counterRide = i % 5 === 0;
    const rotation = counterRide ? positionAngle + Math.PI / 2 : clockwiseTangent(positionAngle);

    zones.push({
      id: `${type}-${i}`,
      type,
      prepareSlot: TYPE_TO_SLOT[type],
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
      advancePerTick: 0.022,
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
          "Tai'ura's tide submerges features — they fade out until the swell passes.",
        ],
      },
    ],
    trickZones: buildTrickZones(map),
  };
}

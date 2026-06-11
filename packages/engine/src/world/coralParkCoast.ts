export const CORAL_PARK_MAP_WIDTH = 280;
export const CORAL_PARK_MAP_HEIGHT = 224;
export const CORAL_PARK_ISLAND_CX = CORAL_PARK_MAP_WIDTH / 2;
export const CORAL_PARK_ISLAND_CY = CORAL_PARK_MAP_HEIGHT / 2;

const GRASS_BASE = 20;
const SAND_BASE = 26;
const SHALLOW_BASE = 30;
const REEF_INNER_BASE = 33;
/** Radial thickness of the rideable reef ring (tiles). Original band was 27 tiles. */
const REEF_RING_WIDTH = 36;
const REEF_OUTER_BASE = REEF_INNER_BASE + REEF_RING_WIDTH;

const GRASS_WOBBLE = 8;
const SAND_WOBBLE = 8.25;
const SHALLOW_WOBBLE = 8.5;
const REEF_INNER_WOBBLE = 8.75;
const REEF_OUTER_WOBBLE = 7;

/** Deep bay carved into the north-east coast (radians / tiles). */
const BAY_ANGLE = -0.9;
const BAY_WIDTH = 0.55;
const BAY_DEPTH = 8;

/** Long headland pointing south-west. */
const HEADLAND_ANGLE = 2.3;
const HEADLAND_WIDTH = 0.45;
const HEADLAND_GAIN = 4;

/** Keep a usable island core even where the bay and harmonics align. */
const MIN_GRASS_RADIUS = 7;

function angularFalloff(angle: number, center: number, width: number): number {
  let delta = angle - center;
  while (delta > Math.PI) {
    delta -= Math.PI * 2;
  }
  while (delta < -Math.PI) {
    delta += Math.PI * 2;
  }
  return Math.exp(-(delta * delta) / (2 * width * width));
}

/**
 * Bays and headlands for the island and inner reef edge. Integer angular
 * frequencies keep the coastline seamless across the atan2 wrap at ±π. The
 * same absolute offset shifts every island ring so beach widths stay intact.
 */
function islandShapeOffset(angle: number, wobble: number): number {
  const harmonics =
    0.26 * Math.sin(angle + 0.7) +
    0.5 * Math.sin(angle * 2 + 0.55) +
    0.34 * Math.sin(angle * 3 + 1.85) +
    0.18 * Math.sin(angle * 5 + 0.95) +
    0.08 * Math.sin(angle * 8 + 2.6);
  const offset =
    wobble * harmonics -
    BAY_DEPTH * angularFalloff(angle, BAY_ANGLE, BAY_WIDTH) +
    HEADLAND_GAIN * angularFalloff(angle, HEADLAND_ANGLE, HEADLAND_WIDTH);
  return Math.max(offset, MIN_GRASS_RADIUS - GRASS_BASE);
}

function islandCoastRadius(angle: number, base: number, wobble: number): number {
  return base + islandShapeOffset(angle, wobble);
}

/** Lumpier mix so the outer reef reads differently from the island. */
function outerReefRadius(angle: number, base: number, wobble: number): number {
  return (
    base +
    wobble *
      (0.38 * Math.sin(angle + 2.35) +
        0.27 * Math.sin(angle * 3 + 0.15) +
        0.2 * Math.sin(angle * 6 + 3.05) +
        0.15 * Math.sin(angle * 9 + 1.2))
  );
}

export function coralParkGrassRadius(angle: number): number {
  return islandCoastRadius(angle, GRASS_BASE, GRASS_WOBBLE);
}

export function coralParkSandRadius(angle: number): number {
  return islandCoastRadius(angle, SAND_BASE, SAND_WOBBLE);
}

export function coralParkShallowRadius(angle: number): number {
  return islandCoastRadius(angle, SHALLOW_BASE, SHALLOW_WOBBLE);
}

export function coralParkReefInnerRadius(angle: number): number {
  return islandCoastRadius(angle, REEF_INNER_BASE, REEF_INNER_WOBBLE);
}

export function coralParkReefOuterRadius(angle: number): number {
  return outerReefRadius(angle, REEF_OUTER_BASE, REEF_OUTER_WOBBLE);
}

export function coralParkTileAngle(tx: number, ty: number): number {
  return Math.atan2(ty - CORAL_PARK_ISLAND_CY + 0.5, tx - CORAL_PARK_ISLAND_CX + 0.5);
}

export function coralParkTileDistance(tx: number, ty: number): number {
  return Math.hypot(tx - CORAL_PARK_ISLAND_CX + 0.5, ty - CORAL_PARK_ISLAND_CY + 0.5);
}

/**
 * Island elevation knobs (world Y). Tweak these in `coralParkCoast.ts`:
 * - `CORAL_PARK_GRASS_PEAK_SURFACE_Y` — hill height at the map centre (main dial).
 * - `CORAL_PARK_GRASS_EDGE_SURFACE_Y` — grass rim where sand meets the hill.
 * - `CORAL_PARK_SAND_OUTER_SURFACE_Y` — beach height at the waterline (keep low).
 *
 * In dev, Vite loads engine source directly — save this file and refresh the page.
 * For production builds, run `pnpm --filter @osrs-surfing/engine build` after edits.
 */
export const CORAL_PARK_SAND_OUTER_SURFACE_Y = 0.1;

/** Grass rim where the sand ring meets the hill (world Y). */
export const CORAL_PARK_GRASS_EDGE_SURFACE_Y = 0.25;

/** Island summit at the map centre (world Y). */
export const CORAL_PARK_GRASS_PEAK_SURFACE_Y = 1.8;

/** Cache-bust key for land mesh rebuilds when the knobs above change. */
export function coralParkLandElevationKey(): string {
  return `${CORAL_PARK_SAND_OUTER_SURFACE_Y}|${CORAL_PARK_GRASS_EDGE_SURFACE_Y}|${CORAL_PARK_GRASS_PEAK_SURFACE_Y}`;
}

/** Top surface Y for island grass or sand tiles. */
export function coralParkLandSurfaceY(
  worldX: number,
  worldY: number,
  tile: 'grass' | 'sand',
): number {
  const angle = Math.atan2(worldY - CORAL_PARK_ISLAND_CY, worldX - CORAL_PARK_ISLAND_CX);
  const dist = Math.hypot(worldX - CORAL_PARK_ISLAND_CX, worldY - CORAL_PARK_ISLAND_CY);
  const grassR = coralParkGrassRadius(angle);
  const sandR = coralParkSandRadius(angle);

  if (tile === 'grass') {
    const edgeT = grassR > 0 ? Math.min(1, dist / grassR) : 1;
    const dome = (1 - edgeT) * (1 - edgeT);
    return (
      CORAL_PARK_GRASS_EDGE_SURFACE_Y +
      dome * (CORAL_PARK_GRASS_PEAK_SURFACE_Y - CORAL_PARK_GRASS_EDGE_SURFACE_Y)
    );
  }

  const sandWidth = sandR - grassR;
  const shoreT = sandWidth > 0 ? Math.min(1, Math.max(0, (dist - grassR) / sandWidth)) : 1;
  return (
    CORAL_PARK_GRASS_EDGE_SURFACE_Y +
    shoreT * (CORAL_PARK_SAND_OUTER_SURFACE_Y - CORAL_PARK_GRASS_EDGE_SURFACE_Y)
  );
}

/** Average radii for tide fallback and tests. */
export const CORAL_PARK_REEF_INNER_MEAN = REEF_INNER_BASE;
export const CORAL_PARK_REEF_OUTER_MEAN = REEF_OUTER_BASE;

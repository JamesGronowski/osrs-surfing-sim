export const CORAL_PARK_MAP_WIDTH = 560;
export const CORAL_PARK_MAP_HEIGHT = 448;
export const CORAL_PARK_ISLAND_CX = CORAL_PARK_MAP_WIDTH / 2;
export const CORAL_PARK_ISLAND_CY = CORAL_PARK_MAP_HEIGHT / 2;

const GRASS_BASE = 8;
const SAND_BASE = 17;
const SHALLOW_BASE = 23;
const REEF_INNER_BASE = 25;
const REEF_OUTER_BASE = 64;

const GRASS_WOBBLE = 1.1;
const SAND_WOBBLE = 1.6;
const SHALLOW_WOBBLE = 2;
const REEF_INNER_WOBBLE = 2.4;
const REEF_OUTER_WOBBLE = 5.2;

/** Soft bays and headlands for the island and inner reef edge. */
function islandCoastRadius(angle: number, base: number, wobble: number): number {
  return (
    base +
    wobble *
      (0.44 * Math.sin(angle * 2.2 + 0.55) +
        0.3 * Math.sin(angle * 3.9 + 1.85) +
        0.18 * Math.sin(angle * 6.3 + 0.95) +
        0.12 * Math.sin(angle * 8.7 + 2.6))
  );
}

/** Lumpier, lower-frequency edge so the outer reef reads differently from the island. */
function outerReefRadius(angle: number, base: number, wobble: number): number {
  return (
    base +
    wobble *
      (0.38 * Math.sin(angle * 1.45 + 2.35) +
        0.27 * Math.sin(angle * 3.2 + 0.15) +
        0.2 * Math.sin(angle * 5.6 + 3.05) +
        0.15 * Math.sin(angle * 9.4 + 1.2))
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
export const CORAL_PARK_GRASS_PEAK_SURFACE_Y = 2.4;

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

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

/** Average radii for tide fallback and tests. */
export const CORAL_PARK_REEF_INNER_MEAN = REEF_INNER_BASE;
export const CORAL_PARK_REEF_OUTER_MEAN = REEF_OUTER_BASE;

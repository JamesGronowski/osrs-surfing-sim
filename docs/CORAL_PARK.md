# Coral Park — tide & trick features

Reference for the **Coral Park** arena in the simulator (`createCoralParkSlice`).

## Layout

- Round island at the map centre with grass, sand ring (board dock), shallow water, and an organic **coral_rideable** reef donut.
- **15 trick features** evenly spaced around the reef at fixed slot angles (`trickSlotAngle`).
- Each spawn rolls a **random radial depth** within the reef ring (`REEF_RING_DEPTH_MIN`–`REEF_RING_DEPTH_MAX`).
- Minimum gap between feature centres: `MIN_TRICK_CENTER_GAP` (12 tiles).

## Trick features

| Type          | Prepare button | Slot |
| ------------- | -------------- | ---- |
| `rail`        | Rail (`1`)     | 0    |
| `brain_coral` | Rail (`1`)     | 0    |
| `tunnel`      | Tunnel (`2`)   | 1    |
| `wall_ride`   | Tunnel (`2`)   | 1    |
| `jump`        | Jump (`3`)     | 2    |

- Yellow chevrons show ride direction (clockwise reef tangent; ~20% counter-ride).
- Prime **1–4 ticks** before hitting the feature with the matching button.
- Approach heading must be within `TRICK_APPROACH_TOLERANCE_DEG` (70°) of the feature rotation.
- Features under the tide sweep are **not interactable** (`isTrickZoneSubmerged`).

## Tai'ura's tide

The tide is a rotating submerged arc around the island (`phaseRadians` advances clockwise each tick).

| Term             | Meaning                                |
| ---------------- | -------------------------------------- |
| Leading edge     | `phaseRadians` — high tide front       |
| Trailing edge    | `phase + sweepRadians` — low tide line |
| High-tide centre | `phase + sweep/2`                      |

Coral Park config: `sweepRadians ≈ π/1.35`, `advancePerTick = 0.044`, organic inner/outer radii via `coralParkReefInnerRadius` / `coralParkReefOuterRadius`.

## Feature lifecycle (per slot angle)

For a feature at polar angle θ:

| Phase             | Tide position                                         | Visual                                    | Gameplay |
| ----------------- | ----------------------------------------------------- | ----------------------------------------- | -------- |
| Dry reef          | Before entry                                          | Opaque                                    | Enabled  |
| High tide arrives | Entry → reroll                                        | Fade out (1 → 0)                          | Disabled |
| Reroll            | `HIGH_TIDE_REROLL_PROGRESS` (0.92) along entry→centre | Fully transparent; old purged, new spawns | Disabled |
| Underwater rise   | Reroll → low tide                                     | Fade in (0 → 1) while submerged           | Disabled |
| Low tide          | Trailing edge passes θ                                | Fully opaque                              | Enabled  |

**Important:** Replacements are marked `spawnedAtHighTide` so they are not purged/re-rolled every tick while still in the submerged band.

## Key source files

| File                                                     | Responsibility                                                          |
| -------------------------------------------------------- | ----------------------------------------------------------------------- |
| `packages/engine/src/world/features.ts`                  | Tide geometry, `trickZoneVisualAlpha`, submersion checks, phase helpers |
| `packages/engine/src/world/trickZonePlacement.ts`        | Slot angles, spawn/purge sync, random depth                             |
| `packages/engine/src/world/maps.ts`                      | Arena build, initial features, tide config                              |
| `packages/engine/src/world/coralParkCoast.ts`            | Organic reef radii                                                      |
| `packages/engine/src/game/simulation.ts`                 | `tickTide` + `syncTrickZonesWithTide` each tick                         |
| `packages/client/src/render/three/trickFeatureMeshes.ts` | Renders features with `trickZoneVisualAlpha(zone, tide)`                |

## Changing tide timing

- **Reroll point:** `HIGH_TIDE_REROLL_PROGRESS` in `features.ts` (0 = entry, 1 = centre).
- **Phase helpers:** `highTideEntryPhaseForAngle`, `highTideRerollPhaseForAngle`, `highTideCenterPhaseForAngle`, `lowTidePhaseForAngle`.
- **Sync purge/spawn:** `isPastHighTideReroll` in `syncTrickZonesWithTide`.
- After logic changes, run `pnpm test` and verify visually in the client.

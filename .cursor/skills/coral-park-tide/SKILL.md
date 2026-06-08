---
name: coral-park-tide
description: Edit Coral Park tide sweep, trick feature placement, fade timing, and reroll behaviour. Use when changing high/low tide visuals, feature spawn/purge, reef slot spacing, trickZoneVisualAlpha, syncTrickZonesWithTide, or docs/CORAL_PARK.md.
---

# Coral Park tide & features

## Before editing

1. Read [docs/CORAL_PARK.md](../../../docs/CORAL_PARK.md).
2. Read `packages/engine/src/world/features.ts` (alpha + phase helpers).
3. Read `packages/engine/src/world/trickZonePlacement.ts` (`syncTrickZonesWithTide`).

## Tide phase model

For feature at polar angle θ:

- **Entry:** `highTideEntryPhaseForAngle` — submerged band trailing edge reaches θ.
- **Reroll:** `highTideRerollPhaseForAngle` — fade-out completes; purge + spawn (`HIGH_TIDE_REROLL_PROGRESS`).
- **Centre:** `highTideCenterPhaseForAngle` — middle of high-tide band.
- **Low tide:** `lowTidePhaseForAngle` — leading edge passes θ; feature exposed.

## Checklist for tide/feature changes

```
- [ ] Slot angles unchanged (trickSlotAngle only for spawn position)
- [ ] spawnedAtHighTide prevents purge/re-roll loop underwater
- [ ] trickZoneVisualAlpha(zone, tide) matches intended fade curve
- [ ] isTrickZoneSubmerged gates gameplay (findTrickZoneAt, renderer)
- [ ] TrickFeatureLayer passes tide to trickZoneVisualAlpha
- [ ] Tests updated in features.test.ts / trickZonePlacement.test.ts
- [ ] pnpm validate passes
```

## Fade patterns

**Old feature (not spawnedAtHighTide), submerged:** alpha 1→0 from entry to reroll.

**New feature (spawnedAtHighTide), submerged:** alpha 0→1 from reroll to low tide.

**Exposed:** alpha 1 immediately (no fade-in).

## Adding a feature type

1. Add to `TrickFeatureType` in `features.ts`.
2. Map in `TRICK_TYPE_TO_PREPARE_SLOT` and `TRICK_FEATURE_TYPES` in `trickZonePlacement.ts`.
3. Add client mesh in `trickFeatureMeshes.ts` if needed.

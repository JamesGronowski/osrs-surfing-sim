/** Prepare must land 1–4 ticks before riding through the matching feature. */
export const TRICK_PREPARE_MIN_TICKS = 1;
export const TRICK_PREPARE_MAX_TICKS = 4;

export type TrickPrepareSlot = 0 | 1 | 2;

export const TRICK_PREPARE_SLOT_COUNT = 3;

export const TRICK_STANCE_NAMES = ['Low', 'Medium', 'High'] as const;

export type TrickStanceName = (typeof TRICK_STANCE_NAMES)[number];

export function trickStanceName(slot: TrickPrepareSlot): TrickStanceName {
  return TRICK_STANCE_NAMES[slot];
}

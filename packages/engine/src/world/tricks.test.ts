import { describe, expect, it } from 'vitest';

import { TRICK_PREPARE_MAX_TICKS } from '../constants/tricks.js';
import {
  advanceTrickPrepare,
  isTrickPrepareTimingValid,
  type TrickPrepareState,
} from './features.js';

describe('trick prepare timing', () => {
  const base: TrickPrepareState = { slot: 0, ticksSincePrepare: 0 };

  it('accepts prepares 1–5 ticks old', () => {
    for (let ticks = 1; ticks <= TRICK_PREPARE_MAX_TICKS; ticks += 1) {
      expect(isTrickPrepareTimingValid({ ...base, ticksSincePrepare: ticks })).toBe(true);
    }
  });

  it('rejects same-tick and expired prepares', () => {
    expect(isTrickPrepareTimingValid({ ...base, ticksSincePrepare: 0 })).toBe(false);
    expect(isTrickPrepareTimingValid({ ...base, ticksSincePrepare: 6 })).toBe(false);
  });

  it('expires after the max window', () => {
    let state: TrickPrepareState | null = { ...base, ticksSincePrepare: 0 };
    for (let i = 0; i < TRICK_PREPARE_MAX_TICKS; i += 1) {
      state = advanceTrickPrepare(state);
      expect(state).not.toBeNull();
    }
    state = advanceTrickPrepare(state);
    expect(state).toBeNull();
  });
});

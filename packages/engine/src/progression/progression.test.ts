import { describe, expect, it } from 'vitest';

import {
  awardTrick,
  canPurchaseUnlock,
  createProgressionState,
  purchaseUnlock,
} from './progression.js';
import { UNLOCK_REGISTRY } from './types.js';

describe('progression', () => {
  it('awards xp and tokens with combo multiplier', () => {
    let state = createProgressionState();
    const first = awardTrick(state, 1);
    state = first.state;
    const second = awardTrick(state, 2);

    expect(second.xpGained.agility).toBeGreaterThan(first.xpGained.agility);
    expect(second.state.session.combo).toBe(2);
  });

  it('purchases unlock when requirements met', () => {
    const state = {
      ...createProgressionState(),
      coralTokens: 500,
      xp: { agility: 0, sailing: 200_000 },
    };
    const unlock = UNLOCK_REGISTRY.find((entry) => entry.id === 'taiura_blessing');
    expect(unlock).toBeDefined();
    expect(canPurchaseUnlock(state, unlock!).ok).toBe(true);

    const result = purchaseUnlock(state, 'taiura_blessing');
    expect(result.success).toBe(true);
    expect(result.state.unlocked.has('taiura_blessing')).toBe(true);
  });

  it('blocks earn-only unlock purchases', () => {
    const state = { ...createProgressionState(), coralTokens: 9999 };
    const unlock = UNLOCK_REGISTRY.find((entry) => entry.id === 'teeny_tai');
    expect(canPurchaseUnlock(state, unlock!).ok).toBe(false);
  });
});

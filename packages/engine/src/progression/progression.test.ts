import { describe, expect, it } from 'vitest';

import {
  COMBO_TIERS,
  COMBO_TIER_SIZE,
  comboAfterBail,
  comboTierName,
  comboTierProgress,
  comboXpMultiplier,
} from './combo.js';
import {
  awardTrick,
  canPurchaseUnlock,
  createProgressionState,
  decayCombo,
  deserializeProgressionState,
  purchaseUnlock,
  rollCoralTokenDrop,
  serializeProgressionState,
} from './progression.js';
import { UNLOCK_REGISTRY } from './types.js';

describe('progression', () => {
  it('awards base xp until combo reaches 10, then scales at each decade', () => {
    let state = createProgressionState();

    for (let i = 1; i <= 9; i += 1) {
      const result = awardTrick(state, () => 1);
      state = result.state;
      expect(result.xpGained.agility).toBe(45);
      expect(result.xpGained.sailing).toBe(35);
      expect(result.state.session.combo).toBe(i);
    }

    const atTen = awardTrick(state, () => 1);
    expect(atTen.xpGained.agility).toBe(90);
    expect(atTen.xpGained.sailing).toBe(70);
    expect(atTen.state.session.combo).toBe(10);
  });

  it('caps xp multiplier at dragon tier', () => {
    let state = createProgressionState();
    for (let i = 0; i < 69; i += 1) {
      state = awardTrick(state, () => 1).state;
    }
    const dragon = awardTrick(state, () => 1);
    expect(dragon.state.session.combo).toBe(70);
    expect(comboXpMultiplier(70)).toBe(7);
    expect(dragon.xpGained.agility).toBe(45 * 7);
    expect(comboTierName(70)).toBe('Dragon');
  });

  it('awards coral tokens on a 1/4 roll only', () => {
    const state = createProgressionState();
    const miss = awardTrick(state, () => 0.5);
    expect(miss.tokensGained).toBe(0);

    const hit = awardTrick(state, () => 0);
    expect(hit.tokensGained).toBeGreaterThanOrEqual(6);
    expect(hit.tokensGained).toBeLessThanOrEqual(10);
  });

  it('rolls coral tokens in the 6–10 range when drop succeeds', () => {
    expect(rollCoralTokenDrop(() => 0)).toBe(6);
    let call = 0;
    expect(
      rollCoralTokenDrop(() => {
        call += 1;
        return call === 1 ? 0 : 0.99;
      }),
    ).toBe(10);
    expect(rollCoralTokenDrop(() => 0.25)).toBe(0);
  });

  it('drops coral tokens at roughly the configured rate', () => {
    let drops = 0;
    const trials = 20_000;
    for (let i = 0; i < trials; i += 1) {
      if (rollCoralTokenDrop(Math.random) > 0) {
        drops += 1;
      }
    }
    const rate = drops / trials;
    expect(rate).toBeGreaterThan(0.23);
    expect(rate).toBeLessThan(0.27);
  });

  it('tracks combo tier progress within each decade', () => {
    expect(comboTierProgress(5)).toBe(5);
    expect(comboTierProgress(10)).toBe(10);
    expect(comboTierProgress(23)).toBe(3);
    expect(comboTierName(23)).toBe('Steel');
  });

  it('drops combo to the previous tier start on bail through dragon', () => {
    expect(comboAfterBail(0)).toBe(0);

    for (let combo = 1; combo <= COMBO_TIER_SIZE - 1; combo += 1) {
      expect(comboAfterBail(combo)).toBe(0);
    }

    for (let tierIndex = 1; tierIndex < COMBO_TIERS.length; tierIndex += 1) {
      const tierStart = tierIndex * COMBO_TIER_SIZE;
      const previousTierStart = (tierIndex - 1) * COMBO_TIER_SIZE;
      const tierEnd = tierStart + COMBO_TIER_SIZE - 1;
      const midCombo = tierStart + 5;

      expect(comboTierName(midCombo)).toBe(COMBO_TIERS[tierIndex]);
      expect(comboAfterBail(tierStart)).toBe(previousTierStart);
      expect(comboAfterBail(midCombo)).toBe(previousTierStart);
      expect(comboAfterBail(tierEnd)).toBe(previousTierStart);
    }

    const dragonCap = COMBO_TIERS.length * COMBO_TIER_SIZE;
    const runeTierStart = (COMBO_TIERS.length - 2) * COMBO_TIER_SIZE;
    expect(comboTierName(dragonCap)).toBe('Dragon');
    expect(comboAfterBail(dragonCap)).toBe(runeTierStart);

    for (const combo of [71, 75, 80, 85, 99, 120]) {
      expect(comboTierName(combo)).toBe('Dragon');
      expect(comboAfterBail(combo)).toBe(runeTierStart);
    }
  });

  it('decayCombo preserves tricks landed and max combo', () => {
    const state = {
      ...createProgressionState(),
      session: { tricksLanded: 25, combo: 25, maxCombo: 30 },
    };
    const decayed = decayCombo(state);
    expect(decayed.session.combo).toBe(10);
    expect(decayed.session.tricksLanded).toBe(25);
    expect(decayed.session.maxCombo).toBe(30);
  });

  it('decayCombo from post-cap dragon combo drops to rune tier', () => {
    const state = {
      ...createProgressionState(),
      session: { tricksLanded: 85, combo: 85, maxCombo: 85 },
    };
    const decayed = decayCombo(state);
    expect(decayed.session.combo).toBe(50);
    expect(decayed.session.maxCombo).toBe(85);
  });

  it('purchases unlock when requirements met', () => {
    const state = {
      ...createProgressionState(),
      coralTokens: 1,
    };
    const unlock = UNLOCK_REGISTRY.find((entry) => entry.id === 'surf_guru_board');
    expect(unlock).toBeDefined();
    expect(canPurchaseUnlock(state, unlock!).ok).toBe(true);

    const result = purchaseUnlock(state, 'surf_guru_board');
    expect(result.success).toBe(true);
    expect(result.state.unlocked.has('surf_guru_board')).toBe(true);
    expect(result.state.coralTokens).toBe(0);
  });

  it('blocks earn-only unlock purchases', () => {
    const state = { ...createProgressionState(), coralTokens: 9999 };
    const unlock = UNLOCK_REGISTRY.find((entry) => entry.id === 'teeny_tai');
    expect(canPurchaseUnlock(state, unlock!).ok).toBe(false);
  });

  it('blocks demo-disabled unlock purchases', () => {
    const state = {
      ...createProgressionState(),
      coralTokens: 9999,
      xp: { agility: 1_000_000, sailing: 1_000_000 },
    };
    for (const id of ['taiura_blessing', 'ebb_and_flow', 'living_coral'] as const) {
      const unlock = UNLOCK_REGISTRY.find((entry) => entry.id === id);
      expect(unlock).toBeDefined();
      const check = canPurchaseUnlock(state, unlock!);
      expect(check.ok).toBe(false);
      expect(check.reason).toBe('Disabled for this demo');
    }
  });

  it('purchases rosewood board when ironwood is owned and requirements met', () => {
    const state = {
      ...createProgressionState(),
      coralTokens: 1,
      unlocked: new Set(['surf_guru_board' as const]),
    };
    const result = purchaseUnlock(state, 'rosewood_board');
    expect(result.success).toBe(true);
    expect(result.state.unlocked.has('rosewood_board')).toBe(true);
    expect(result.state.coralTokens).toBe(0);
  });

  it('blocks rosewood board until ironwood is owned', () => {
    const state = {
      ...createProgressionState(),
      coralTokens: 250,
    };
    const check = canPurchaseUnlock(
      state,
      UNLOCK_REGISTRY.find((entry) => entry.id === 'rosewood_board')!,
    );
    expect(check.ok).toBe(false);
    expect(check.reason).toBe('Requires Ironwood Board');
  });

  it('drops Teeny Tai on a 1/500 trick roll', () => {
    let call = 0;
    const random = () => {
      call += 1;
      return call === 2 ? 0 : 1;
    };
    const result = awardTrick(createProgressionState(), random);
    expect(result.unlockGained).toBe('teeny_tai');
    expect(result.state.unlocked.has('teeny_tai')).toBe(true);
  });

  it('does not drop Teeny Tai when already owned', () => {
    const state = {
      ...createProgressionState(),
      unlocked: new Set(['teeny_tai' as const]),
    };
    const result = awardTrick(state, () => 0);
    expect(result.unlockGained).toBeNull();
    expect(result.state.unlocked.has('teeny_tai')).toBe(true);
  });

  it('misses Teeny Tai when roll is above drop chance', () => {
    let call = 0;
    const random = () => {
      call += 1;
      return call === 2 ? 0.01 : 1;
    };
    const result = awardTrick(createProgressionState(), random);
    expect(result.unlockGained).toBeNull();
    expect(result.state.unlocked.has('teeny_tai')).toBe(false);
  });

  it('round-trips progression through serialization', () => {
    const state = awardTrick(
      {
        ...createProgressionState(),
        coralTokens: 42,
        unlocked: new Set(['coral_rail_cosmetic']),
        session: { tricksLanded: 7, combo: 3, maxCombo: 12 },
      },
      () => 1,
    ).state;

    const restored = deserializeProgressionState(serializeProgressionState(state));
    expect(restored).toEqual(state);
  });

  it('rejects invalid serialized progression', () => {
    expect(deserializeProgressionState(null)).toBeNull();
    expect(deserializeProgressionState({ xp: { agility: -1, sailing: 0 } })).toBeNull();
    expect(
      deserializeProgressionState({
        xp: { agility: 10, sailing: 20 },
        coralTokens: 5,
        unlocked: ['not_a_real_unlock'],
        session: { tricksLanded: 1, combo: 1, maxCombo: 1 },
      }),
    ).toBeNull();
  });
});

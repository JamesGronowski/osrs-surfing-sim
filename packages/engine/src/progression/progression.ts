import type { ProgressionState, UnlockDefinition, UnlockId } from './types.js';
import { UNLOCK_REGISTRY } from './types.js';

export const TRICK_XP_AGILITY = 45;
export const TRICK_XP_SAILING = 35;
export const TRICK_TOKEN_BASE = 10;
export const COMBO_TIMEOUT_TICKS = 8;

export function createProgressionState(): ProgressionState {
  return {
    xp: { agility: 0, sailing: 0 },
    coralTokens: 0,
    unlocked: new Set(),
    session: { tricksLanded: 0, combo: 0, maxCombo: 0 },
  };
}

export function agilityLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function sailingLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 120)) + 1;
}

export function canPurchaseUnlock(
  state: ProgressionState,
  unlock: UnlockDefinition,
): { ok: boolean; reason?: string } {
  if (unlock.earnOnly) {
    return { ok: false, reason: 'Earned through gameplay only' };
  }
  if (state.unlocked.has(unlock.id)) {
    return { ok: false, reason: 'Already unlocked' };
  }
  if (unlock.tokenCost !== null && state.coralTokens < unlock.tokenCost) {
    return { ok: false, reason: 'Not enough Coral Tokens' };
  }
  if (unlock.minAgilityLevel && agilityLevel(state.xp.agility) < unlock.minAgilityLevel) {
    return { ok: false, reason: `Requires Agility ${unlock.minAgilityLevel}` };
  }
  if (unlock.minSailingLevel && sailingLevel(state.xp.sailing) < unlock.minSailingLevel) {
    return { ok: false, reason: `Requires Sailing ${unlock.minSailingLevel}` };
  }
  return { ok: true };
}

export function purchaseUnlock(
  state: ProgressionState,
  unlockId: UnlockId,
): { state: ProgressionState; success: boolean; reason?: string } {
  const unlock = UNLOCK_REGISTRY.find((entry) => entry.id === unlockId);
  if (!unlock) {
    return { state, success: false, reason: 'Unknown unlock' };
  }

  const check = canPurchaseUnlock(state, unlock);
  if (!check.ok) {
    return { state, success: false, reason: check.reason };
  }

  const next: ProgressionState = {
    ...state,
    coralTokens:
      unlock.tokenCost !== null ? state.coralTokens - unlock.tokenCost : state.coralTokens,
    unlocked: new Set([...state.unlocked, unlockId]),
  };

  return { state: next, success: true };
}

export interface TrickResult {
  state: ProgressionState;
  xpGained: { agility: number; sailing: number };
  tokensGained: number;
}

export function awardTrick(state: ProgressionState, comboMultiplier = 1): TrickResult {
  const combo = state.session.combo + 1;
  const xpGained = {
    agility: TRICK_XP_AGILITY * comboMultiplier,
    sailing: TRICK_XP_SAILING * comboMultiplier,
  };
  const tokensGained = TRICK_TOKEN_BASE * comboMultiplier;

  const next: ProgressionState = {
    ...state,
    xp: {
      agility: state.xp.agility + xpGained.agility,
      sailing: state.xp.sailing + xpGained.sailing,
    },
    coralTokens: state.coralTokens + tokensGained,
    session: {
      tricksLanded: state.session.tricksLanded + 1,
      combo,
      maxCombo: Math.max(state.session.maxCombo, combo),
    },
  };

  return { state: next, xpGained, tokensGained };
}

export function decayCombo(state: ProgressionState): ProgressionState {
  if (state.session.combo === 0) {
    return state;
  }
  return {
    ...state,
    session: { ...state.session, combo: 0 },
  };
}

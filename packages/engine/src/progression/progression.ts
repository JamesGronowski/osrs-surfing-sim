import { comboAfterBail, comboXpMultiplier } from './combo.js';
import type { ProgressionState, UnlockDefinition, UnlockId } from './types.js';
import { UNLOCK_REGISTRY } from './types.js';

export * from './combo.js';

export const TRICK_XP_AGILITY = 45;
export const TRICK_XP_SAILING = 35;

export const CORAL_TOKEN_DROP_CHANCE = 1 / 4;
export const CORAL_TOKEN_MIN = 6;
export const CORAL_TOKEN_MAX = 10;
export const TEENY_TAI_DROP_CHANCE = 1 / 500;

export interface SerializedProgressionState {
  xp: ProgressionState['xp'];
  coralTokens: number;
  unlocked: UnlockId[];
  session: ProgressionState['session'];
}

const VALID_UNLOCK_IDS = new Set<UnlockId>(UNLOCK_REGISTRY.map((entry) => entry.id));

export function createProgressionState(): ProgressionState {
  return {
    xp: { agility: 0, sailing: 0 },
    coralTokens: 0,
    unlocked: new Set(),
    session: { tricksLanded: 0, combo: 0, maxCombo: 0 },
  };
}

export function cloneProgressionState(state: ProgressionState): ProgressionState {
  return {
    xp: { ...state.xp },
    coralTokens: state.coralTokens,
    unlocked: new Set(state.unlocked),
    session: { ...state.session },
  };
}

export function serializeProgressionState(state: ProgressionState): SerializedProgressionState {
  return {
    xp: { ...state.xp },
    coralTokens: state.coralTokens,
    unlocked: [...state.unlocked],
    session: { ...state.session },
  };
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function deserializeProgressionState(data: unknown): ProgressionState | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Partial<SerializedProgressionState>;
  if (
    !record.xp ||
    typeof record.xp !== 'object' ||
    !isNonNegativeNumber(record.xp.agility) ||
    !isNonNegativeNumber(record.xp.sailing) ||
    !isNonNegativeNumber(record.coralTokens) ||
    !record.session ||
    typeof record.session !== 'object' ||
    !isNonNegativeNumber(record.session.tricksLanded) ||
    !isNonNegativeNumber(record.session.combo) ||
    !isNonNegativeNumber(record.session.maxCombo) ||
    !Array.isArray(record.unlocked)
  ) {
    return null;
  }

  const unlocked: UnlockId[] = [];
  for (const id of record.unlocked) {
    if (typeof id !== 'string' || !VALID_UNLOCK_IDS.has(id as UnlockId)) {
      return null;
    }
    unlocked.push(id as UnlockId);
  }

  return {
    xp: { agility: record.xp.agility, sailing: record.xp.sailing },
    coralTokens: record.coralTokens,
    unlocked: new Set(unlocked),
    session: {
      tricksLanded: record.session.tricksLanded,
      combo: record.session.combo,
      maxCombo: record.session.maxCombo,
    },
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
  if (unlock.demoDisabled) {
    return { ok: false, reason: 'Disabled for this demo' };
  }
  if (unlock.earnOnly) {
    return { ok: false, reason: 'Earned through gameplay only (1/500 from successful tricks)' };
  }
  if (state.unlocked.has(unlock.id)) {
    return { ok: false, reason: 'Already unlocked' };
  }
  if (unlock.requiresUnlock && !state.unlocked.has(unlock.requiresUnlock)) {
    const required = UNLOCK_REGISTRY.find((entry) => entry.id === unlock.requiresUnlock);
    return { ok: false, reason: `Requires ${required?.name ?? unlock.requiresUnlock}` };
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
  unlockGained: UnlockId | null;
}

export function rollCoralTokenDrop(random: () => number = Math.random): number {
  if (random() >= CORAL_TOKEN_DROP_CHANCE) {
    return 0;
  }
  const span = CORAL_TOKEN_MAX - CORAL_TOKEN_MIN + 1;
  const amountIndex = Math.floor(random() * span);
  return CORAL_TOKEN_MIN + amountIndex;
}

export function awardTrick(
  state: ProgressionState,
  random: () => number = Math.random,
): TrickResult {
  const combo = state.session.combo + 1;
  const xpMultiplier = comboXpMultiplier(combo);
  const xpGained = {
    agility: TRICK_XP_AGILITY * xpMultiplier,
    sailing: TRICK_XP_SAILING * xpMultiplier,
  };
  const tokensGained = rollCoralTokenDrop(random);

  let unlockGained: UnlockId | null = null;
  const unlocked = new Set(state.unlocked);
  if (!unlocked.has('teeny_tai') && random() < TEENY_TAI_DROP_CHANCE) {
    unlocked.add('teeny_tai');
    unlockGained = 'teeny_tai';
  }

  const next: ProgressionState = {
    ...state,
    xp: {
      agility: state.xp.agility + xpGained.agility,
      sailing: state.xp.sailing + xpGained.sailing,
    },
    coralTokens: state.coralTokens + tokensGained,
    unlocked,
    session: {
      tricksLanded: state.session.tricksLanded + 1,
      combo,
      maxCombo: Math.max(state.session.maxCombo, combo),
    },
  };

  return { state: next, xpGained, tokensGained, unlockGained };
}

export function decayCombo(state: ProgressionState): ProgressionState {
  const combo = comboAfterBail(state.session.combo);
  if (combo === state.session.combo) {
    return state;
  }
  return {
    ...state,
    session: { ...state.session, combo },
  };
}

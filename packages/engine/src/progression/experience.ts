/** OSRS max skill XP (200M with one decimal place stored as integer). */
export const MAX_SKILL_XP = 200_000_000;

/** OSRS max combat/non-combat skill level. */
export const MAX_SKILL_LEVEL = 99;

/**
 * Total XP required to reach `level` (level 1 = 0 XP).
 * Formula from https://oldschool.runescape.wiki/w/Experience
 */
export function xpForLevel(level: number): number {
  if (level <= 1) {
    return 0;
  }

  let points = 0;
  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    points += Math.floor(currentLevel + 300 * 2 ** (currentLevel / 7));
  }

  return Math.floor(points / 4);
}

/** Highest level whose threshold is not above `xp`. */
export function levelForXp(xp: number): number {
  const clampedXp = Math.max(0, Math.min(MAX_SKILL_XP, xp));

  for (let level = MAX_SKILL_LEVEL; level >= 1; level -= 1) {
    if (clampedXp >= xpForLevel(level)) {
      return level;
    }
  }

  return 1;
}

export interface SkillXpProgress {
  level: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  percent: number;
}

/** XP bar fill for the current level toward the next. */
export function skillXpProgress(xp: number): SkillXpProgress {
  const level = levelForXp(xp);
  const currentThreshold = xpForLevel(level);
  const nextThreshold = level >= MAX_SKILL_LEVEL ? currentThreshold : xpForLevel(level + 1);
  const xpIntoLevel = xp - currentThreshold;
  const xpToNextLevel = Math.max(1, nextThreshold - currentThreshold);
  const percent =
    level >= MAX_SKILL_LEVEL ? 100 : Math.min(100, (xpIntoLevel / xpToNextLevel) * 100);

  return {
    level,
    xpIntoLevel,
    xpToNextLevel,
    percent,
  };
}

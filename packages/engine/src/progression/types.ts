export interface SkillXp {
  agility: number;
  sailing: number;
}

export interface SessionStats {
  tricksLanded: number;
  combo: number;
  maxCombo: number;
}

export type UnlockId =
  | 'teeny_tai'
  | 'taiura_blessing'
  | 'ebb_and_flow'
  | 'living_coral'
  | 'coral_rail_cosmetic'
  | 'surf_guru_board';

export interface UnlockDefinition {
  id: UnlockId;
  name: string;
  description: string;
  tokenCost: number | null;
  minAgilityLevel?: number;
  minSailingLevel?: number;
  earnOnly?: boolean;
}

export interface ProgressionState {
  xp: SkillXp;
  coralTokens: number;
  unlocked: Set<UnlockId>;
  session: SessionStats;
}

export const UNLOCK_REGISTRY: UnlockDefinition[] = [
  {
    id: 'teeny_tai',
    name: 'Teeny Tai',
    description: "Miniature wave spirit pet resembling Tai'ura.",
    tokenCost: null,
    earnOnly: true,
  },
  {
    id: 'taiura_blessing',
    name: "Tai'ura's Blessing",
    description: 'Coral blessing for ship combat ammo recovery.',
    tokenCost: 500,
    minSailingLevel: 40,
  },
  {
    id: 'ebb_and_flow',
    name: 'Ebb and Flow',
    description: 'Lunar spell — weapon swap grants a boosted attack.',
    tokenCost: 750,
    minSailingLevel: 60,
  },
  {
    id: 'living_coral',
    name: 'Living Coral',
    description: '20% chance to double grinding output.',
    tokenCost: 400,
    minAgilityLevel: 50,
  },
  {
    id: 'coral_rail_cosmetic',
    name: 'Coral Rail Trim',
    description: 'Cosmetic surfboard rail glow.',
    tokenCost: 150,
  },
  {
    id: 'surf_guru_board',
    name: 'Ironwood Board',
    description: 'Tier-2 surfboard cosmetic from the guru.',
    tokenCost: 300,
    minAgilityLevel: 30,
  },
];

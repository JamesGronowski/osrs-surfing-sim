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
  | 'surf_guru_board'
  | 'rosewood_board';

export interface UnlockDefinition {
  id: UnlockId;
  name: string;
  description: string;
  tokenCost: number | null;
  minAgilityLevel?: number;
  minSailingLevel?: number;
  earnOnly?: boolean;
  demoDisabled?: boolean;
  requiresUnlock?: UnlockId;
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
    description: 'Cute jellyfish spirit in a shimmering water bubble — earned from tricks.',
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
    demoDisabled: true,
  },
  {
    id: 'living_coral',
    name: 'Living Coral',
    description: '20% chance to double grinding output.',
    tokenCost: 400,
    minAgilityLevel: 50,
    demoDisabled: true,
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
    description: 'Ironwood hull — faster ride speed and darker deck.',
    tokenCost: 250,
    minAgilityLevel: 30,
  },
  {
    id: 'rosewood_board',
    name: 'Rosewood Board',
    description: 'Rosewood hull — fastest ride speed and rich deck finish.',
    tokenCost: 250,
    requiresUnlock: 'surf_guru_board',
  },
];

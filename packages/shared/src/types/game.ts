export interface GameRound {
  id: string;
  roundNumber: number;
  startDate: string;
  endDate: string;
  currentGameDay: number;
  totalGameDays: number;
  isActive: boolean;
  tokenRewardPool: number;
}

export interface RobberyDefinition {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  staminaCost: number;
  baseDifficulty: number;
  minRewardMoney: number;
  maxRewardMoney: number;
  minRewardRespect: number;
  maxRewardRespect: number;
  tokenReward: number;
  cooldownSeconds: number;
  isGangRobbery: boolean;
  minGangMembers: number;
  imageUrl: string | null;
  sortOrder: number;
}

export interface RobberyResult {
  success: boolean;
  moneyEarned: number;
  respectEarned: number;
  tokensEarned: number;
  wasCaught: boolean;
  message: string;
}

export interface DrugDefinition {
  id: string;
  name: string;
  description: string;
  staminaRestore: number;
  addictionRate: number;
  buyPrice: number;
  sellPrice: number;
  ticketsRequired: number;
  levelRequired: number;
  imageUrl: string | null;
}

export interface AssaultResult {
  attackerWon: boolean;
  damageDealt: number;
  moneyStolen: number;
  respectGained: number;
  respectLost: number;
  attackerCaught: boolean;
  message: string;
}

export type HospitalType = 'HEAL' | 'DETOX' | 'METHADONE' | 'PLASTIC_SURGERY';

export type CasinoGame = 'SLOTS' | 'BLACKJACK' | 'DICE' | 'ROULETTE' | 'COIN_FLIP';

export type ItemType = 'WEAPON_MELEE' | 'WEAPON_RANGED' | 'ARMOR' | 'ACCESSORY' | 'VEHICLE' | 'TOOL' | 'CONSUMABLE';

export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  levelRequired: number;
  price: number;
  tokenPrice: number;
  stats: Record<string, number>;
  imageUrl: string | null;
  isTokenOnly: boolean;
}

export type StakingTier = 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';

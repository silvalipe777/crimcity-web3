export const GAME_CONFIG = {
  ROUND_DURATION_REAL_DAYS: 39,
  GAME_DAYS_PER_ROUND: 156,
  MINUTES_PER_GAME_DAY: 360,
  DEFAULT_STAMINA: 100,
  DEFAULT_HEALTH: 100,
  DEFAULT_TICKETS: 200,
  TICKETS_PER_DAY: 100,
  MAX_TICKETS: 400,
  DEFAULT_MONEY: 500,
  MAX_ADDICTION: 100,
  PRISON_BASE_MINUTES: 5,
  ROBBERY_COOLDOWN_SECONDS: 30,
  ASSAULT_COOLDOWN_SECONDS: 60,
  XP_PER_LEVEL_BASE: 100,
  XP_LEVEL_MULTIPLIER: 1.5,
} as const;

export const STAKING_TIERS = {
  NONE: { min: 0, staminaBonus: 0, robberyBonus: 0, prisonReduction: 0, respectBonus: 0 },
  BRONZE: { min: 100, staminaBonus: 0.05, robberyBonus: 0, prisonReduction: 0, respectBonus: 0 },
  SILVER: { min: 500, staminaBonus: 0.10, robberyBonus: 0.05, prisonReduction: 0, respectBonus: 0 },
  GOLD: { min: 2000, staminaBonus: 0.20, robberyBonus: 0.10, prisonReduction: 0.10, respectBonus: 0 },
  DIAMOND: { min: 10000, staminaBonus: 0.30, robberyBonus: 0.15, prisonReduction: 0.20, respectBonus: 0.10 },
} as const;

export const PROFESSION_BONUSES = {
  GANGSTER: { robberyBonus: 0.05, assaultBonus: 0.05, description: 'Jack of all trades' },
  ROBBER: { robberyBonus: 0.20, ticketsPerDay: 120, maxTickets: 380, description: 'Master thief' },
  DEALER: { drugProductionBonus: 0.25, drugPriceBonus: 0.15, description: 'Drug lord' },
  HITMAN: { assaultBonus: 0.25, prisonReduction: 0.15, description: 'Professional killer' },
  BROKER: { marketplaceFeeReduction: 0.20, casinoBonus: 0.10, description: 'Money expert' },
  BUSINESSMAN: { moneyBonus: 0.20, shopDiscount: 0.10, description: 'Business mogul' },
  PIMP: { nightlifeBonus: 0.20, charismaBonus: 0.15, description: 'Street manager' },
} as const;

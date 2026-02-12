import { GAME_CONFIG, STAKING_TIERS } from '../constants/game';
import type { StakingTier } from '../types/game';

export function calculateLevel(experience: number): number {
  let level = 1;
  let xpNeeded: number = GAME_CONFIG.XP_PER_LEVEL_BASE;
  let totalXp = 0;
  while (totalXp + xpNeeded <= experience) {
    totalXp += xpNeeded;
    level++;
    xpNeeded = Math.floor(GAME_CONFIG.XP_PER_LEVEL_BASE * Math.pow(GAME_CONFIG.XP_LEVEL_MULTIPLIER, level - 1));
  }
  return level;
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.floor(GAME_CONFIG.XP_PER_LEVEL_BASE * Math.pow(GAME_CONFIG.XP_LEVEL_MULTIPLIER, currentLevel - 1));
}

export function calculateRobberySuccess(
  baseDifficulty: number,
  playerLevel: number,
  strength: number,
  agility: number,
  intelligence: number,
  equipmentBonus: number,
  professionBonus: number,
  stakingBonus: number,
): number {
  const levelFactor = 1 + (playerLevel * 0.02);
  const statFactor = 1 + ((strength + agility + intelligence) / 300);
  const successRate = baseDifficulty * levelFactor * statFactor * (1 + equipmentBonus) * (1 + professionBonus) * (1 + stakingBonus);
  return Math.min(0.95, Math.max(0.05, successRate));
}

export function calculateAssaultDamage(
  attackerStrength: number,
  attackerWeaponAttack: number,
  defenderDefense: number,
  defenderArmor: number,
): number {
  const baseDamage = attackerStrength * 0.5 + attackerWeaponAttack;
  const reduction = defenderDefense * 0.3 + defenderArmor * 0.5;
  const damage = Math.max(1, baseDamage - reduction);
  const variance = 0.8 + Math.random() * 0.4;
  return Math.floor(damage * variance);
}

export function calculatePrisonTime(crimeLevel: number, professionReduction: number, stakingReduction: number): number {
  const baseMinutes = GAME_CONFIG.PRISON_BASE_MINUTES + (crimeLevel * 2);
  return Math.max(1, Math.floor(baseMinutes * (1 - professionReduction) * (1 - stakingReduction)));
}

export function calculateBribeCost(remainingMinutes: number, playerLevel: number): number {
  return Math.floor(remainingMinutes * 10 * (1 + playerLevel * 0.1));
}

export function getStakingTier(amountStaked: number): StakingTier {
  if (amountStaked >= STAKING_TIERS.DIAMOND.min) return 'DIAMOND';
  if (amountStaked >= STAKING_TIERS.GOLD.min) return 'GOLD';
  if (amountStaked >= STAKING_TIERS.SILVER.min) return 'SILVER';
  if (amountStaked >= STAKING_TIERS.BRONZE.min) return 'BRONZE';
  return 'NONE';
}

export function getStakingBonuses(tier: StakingTier) {
  return STAKING_TIERS[tier];
}

export function calculateDrugPrice(basePrice: number, gameDay: number, volatility: number = 0.3): number {
  const sineFactor = Math.sin(gameDay * 0.4) * volatility;
  const randomFactor = (Math.random() - 0.5) * 0.1;
  return Math.max(1, Math.floor(basePrice * (1 + sineFactor + randomFactor)));
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

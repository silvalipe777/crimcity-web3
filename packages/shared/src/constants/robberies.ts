export interface RobberySeed {
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
  sortOrder: number;
}

export const ROBBERIES: RobberySeed[] = [
  { name: 'Mug a Drunk', description: 'Easy target stumbling out of a bar', levelRequired: 1, staminaCost: 5, baseDifficulty: 0.85, minRewardMoney: 10, maxRewardMoney: 50, minRewardRespect: 1, maxRewardRespect: 3, tokenReward: 0.1, cooldownSeconds: 15, isGangRobbery: false, minGangMembers: 1, sortOrder: 1 },
  { name: 'Steal a Bicycle', description: 'Quick grab from a bike rack', levelRequired: 1, staminaCost: 8, baseDifficulty: 0.80, minRewardMoney: 20, maxRewardMoney: 80, minRewardRespect: 2, maxRewardRespect: 5, tokenReward: 0.15, cooldownSeconds: 20, isGangRobbery: false, minGangMembers: 1, sortOrder: 2 },
  { name: 'Rob a Street Vendor', description: 'Shake down a hot dog stand', levelRequired: 2, staminaCost: 10, baseDifficulty: 0.75, minRewardMoney: 50, maxRewardMoney: 150, minRewardRespect: 3, maxRewardRespect: 8, tokenReward: 0.25, cooldownSeconds: 25, isGangRobbery: false, minGangMembers: 1, sortOrder: 3 },
  { name: 'Pickpocket Tourists', description: 'Work the tourist district', levelRequired: 3, staminaCost: 12, baseDifficulty: 0.70, minRewardMoney: 80, maxRewardMoney: 250, minRewardRespect: 5, maxRewardRespect: 12, tokenReward: 0.4, cooldownSeconds: 30, isGangRobbery: false, minGangMembers: 1, sortOrder: 4 },
  { name: 'Break Into a Car', description: 'Smash and grab from parked cars', levelRequired: 4, staminaCost: 15, baseDifficulty: 0.65, minRewardMoney: 150, maxRewardMoney: 400, minRewardRespect: 8, maxRewardRespect: 18, tokenReward: 0.6, cooldownSeconds: 30, isGangRobbery: false, minGangMembers: 1, sortOrder: 5 },
  { name: 'Rob a Gas Station', description: 'Hold up the night shift clerk', levelRequired: 5, staminaCost: 18, baseDifficulty: 0.60, minRewardMoney: 250, maxRewardMoney: 600, minRewardRespect: 10, maxRewardRespect: 25, tokenReward: 0.8, cooldownSeconds: 35, isGangRobbery: false, minGangMembers: 1, sortOrder: 6 },
  { name: 'Steal Electronics', description: 'Hit an electronics store after hours', levelRequired: 6, staminaCost: 20, baseDifficulty: 0.55, minRewardMoney: 400, maxRewardMoney: 900, minRewardRespect: 15, maxRewardRespect: 30, tokenReward: 1.0, cooldownSeconds: 40, isGangRobbery: false, minGangMembers: 1, sortOrder: 7 },
  { name: 'Rob a Liquor Store', description: 'Armed robbery on a corner store', levelRequired: 8, staminaCost: 22, baseDifficulty: 0.50, minRewardMoney: 600, maxRewardMoney: 1500, minRewardRespect: 20, maxRewardRespect: 40, tokenReward: 1.5, cooldownSeconds: 45, isGangRobbery: false, minGangMembers: 1, sortOrder: 8 },
  { name: 'Hijack a Delivery Truck', description: 'Intercept a cargo delivery', levelRequired: 10, staminaCost: 25, baseDifficulty: 0.45, minRewardMoney: 1000, maxRewardMoney: 2500, minRewardRespect: 25, maxRewardRespect: 50, tokenReward: 2.0, cooldownSeconds: 50, isGangRobbery: false, minGangMembers: 1, sortOrder: 9 },
  { name: 'Jewelry Store Heist', description: 'Sophisticated smash-and-grab', levelRequired: 12, staminaCost: 28, baseDifficulty: 0.40, minRewardMoney: 2000, maxRewardMoney: 5000, minRewardRespect: 35, maxRewardRespect: 70, tokenReward: 3.0, cooldownSeconds: 55, isGangRobbery: false, minGangMembers: 1, sortOrder: 10 },
  { name: 'Art Gallery Robbery', description: 'Steal priceless paintings', levelRequired: 14, staminaCost: 30, baseDifficulty: 0.35, minRewardMoney: 3500, maxRewardMoney: 8000, minRewardRespect: 45, maxRewardRespect: 90, tokenReward: 4.0, cooldownSeconds: 60, isGangRobbery: false, minGangMembers: 1, sortOrder: 11 },
  { name: 'Armored Car Robbery', description: 'Hit a money transport', levelRequired: 16, staminaCost: 35, baseDifficulty: 0.30, minRewardMoney: 5000, maxRewardMoney: 12000, minRewardRespect: 60, maxRewardRespect: 120, tokenReward: 5.0, cooldownSeconds: 90, isGangRobbery: true, minGangMembers: 2, sortOrder: 12 },
  { name: 'Casino Vault Break-in', description: 'Ocean\'s style casino heist', levelRequired: 18, staminaCost: 40, baseDifficulty: 0.25, minRewardMoney: 8000, maxRewardMoney: 20000, minRewardRespect: 80, maxRewardRespect: 160, tokenReward: 8.0, cooldownSeconds: 120, isGangRobbery: true, minGangMembers: 3, sortOrder: 13 },
  { name: 'Bank Robbery', description: 'Full-scale bank heist', levelRequired: 20, staminaCost: 45, baseDifficulty: 0.20, minRewardMoney: 15000, maxRewardMoney: 40000, minRewardRespect: 100, maxRewardRespect: 200, tokenReward: 12.0, cooldownSeconds: 180, isGangRobbery: true, minGangMembers: 4, sortOrder: 14 },
  { name: 'Federal Reserve Heist', description: 'The ultimate score', levelRequired: 25, staminaCost: 50, baseDifficulty: 0.15, minRewardMoney: 30000, maxRewardMoney: 80000, minRewardRespect: 150, maxRewardRespect: 300, tokenReward: 20.0, cooldownSeconds: 300, isGangRobbery: true, minGangMembers: 5, sortOrder: 15 },
];

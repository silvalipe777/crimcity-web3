import type { ItemType, ItemRarity } from '../types/game';

export interface ItemSeed {
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  levelRequired: number;
  price: number;
  tokenPrice: number;
  stats: Record<string, number>;
  isTokenOnly: boolean;
}

export const ITEMS: ItemSeed[] = [
  // Melee Weapons
  { name: 'Pocket Knife', description: 'Small but sharp', type: 'WEAPON_MELEE', rarity: 'COMMON', levelRequired: 1, price: 50, tokenPrice: 0, stats: { attack: 3 }, isTokenOnly: false },
  { name: 'Baseball Bat', description: 'Classic street weapon', type: 'WEAPON_MELEE', rarity: 'COMMON', levelRequired: 2, price: 120, tokenPrice: 0, stats: { attack: 6 }, isTokenOnly: false },
  { name: 'Machete', description: 'Intimidating blade', type: 'WEAPON_MELEE', rarity: 'UNCOMMON', levelRequired: 5, price: 350, tokenPrice: 0, stats: { attack: 12 }, isTokenOnly: false },
  { name: 'Katana', description: 'Ancient warrior blade', type: 'WEAPON_MELEE', rarity: 'RARE', levelRequired: 10, price: 1500, tokenPrice: 5, stats: { attack: 22, agility: 3 }, isTokenOnly: false },
  { name: 'Chainsaw', description: 'Terrifying melee weapon', type: 'WEAPON_MELEE', rarity: 'EPIC', levelRequired: 15, price: 5000, tokenPrice: 15, stats: { attack: 35, strength: 5 }, isTokenOnly: false },

  // Ranged Weapons
  { name: 'Pistol', description: '9mm handgun', type: 'WEAPON_RANGED', rarity: 'COMMON', levelRequired: 3, price: 200, tokenPrice: 0, stats: { attack: 8 }, isTokenOnly: false },
  { name: 'Shotgun', description: 'Close-range devastation', type: 'WEAPON_RANGED', rarity: 'UNCOMMON', levelRequired: 6, price: 600, tokenPrice: 0, stats: { attack: 16 }, isTokenOnly: false },
  { name: 'SMG', description: 'Rapid-fire submachine gun', type: 'WEAPON_RANGED', rarity: 'UNCOMMON', levelRequired: 8, price: 1000, tokenPrice: 0, stats: { attack: 20, agility: 2 }, isTokenOnly: false },
  { name: 'AK-47', description: 'Reliable assault rifle', type: 'WEAPON_RANGED', rarity: 'RARE', levelRequired: 12, price: 3000, tokenPrice: 8, stats: { attack: 30 }, isTokenOnly: false },
  { name: 'Sniper Rifle', description: 'Long-range precision', type: 'WEAPON_RANGED', rarity: 'EPIC', levelRequired: 18, price: 8000, tokenPrice: 20, stats: { attack: 45, intelligence: 5 }, isTokenOnly: false },
  { name: 'Golden Desert Eagle', description: 'Legendary golden handgun', type: 'WEAPON_RANGED', rarity: 'LEGENDARY', levelRequired: 22, price: 0, tokenPrice: 50, stats: { attack: 40, charisma: 10, respect: 5 }, isTokenOnly: true },

  // Armor
  { name: 'Leather Jacket', description: 'Basic street protection', type: 'ARMOR', rarity: 'COMMON', levelRequired: 1, price: 80, tokenPrice: 0, stats: { defense: 3 }, isTokenOnly: false },
  { name: 'Kevlar Vest', description: 'Bulletproof protection', type: 'ARMOR', rarity: 'UNCOMMON', levelRequired: 5, price: 500, tokenPrice: 0, stats: { defense: 10 }, isTokenOnly: false },
  { name: 'Tactical Armor', description: 'Military-grade protection', type: 'ARMOR', rarity: 'RARE', levelRequired: 10, price: 2000, tokenPrice: 6, stats: { defense: 20, strength: 2 }, isTokenOnly: false },
  { name: 'Titanium Suit', description: 'Experimental combat suit', type: 'ARMOR', rarity: 'EPIC', levelRequired: 16, price: 6000, tokenPrice: 18, stats: { defense: 35, agility: -2, strength: 5 }, isTokenOnly: false },
  { name: 'Shadow Armor', description: 'Mythical black armor', type: 'ARMOR', rarity: 'LEGENDARY', levelRequired: 20, price: 0, tokenPrice: 40, stats: { defense: 45, agility: 5, stealth: 10 }, isTokenOnly: true },

  // Accessories
  { name: 'Gold Chain', description: 'Street cred bling', type: 'ACCESSORY', rarity: 'COMMON', levelRequired: 1, price: 100, tokenPrice: 0, stats: { charisma: 3 }, isTokenOnly: false },
  { name: 'Dark Sunglasses', description: 'Look menacing', type: 'ACCESSORY', rarity: 'COMMON', levelRequired: 2, price: 60, tokenPrice: 0, stats: { charisma: 2, intelligence: 1 }, isTokenOnly: false },
  { name: 'Diamond Watch', description: 'Expensive timepiece', type: 'ACCESSORY', rarity: 'RARE', levelRequired: 8, price: 2500, tokenPrice: 7, stats: { charisma: 8, respect: 3 }, isTokenOnly: false },
  { name: 'Skull Ring', description: 'Intimidating jewelry', type: 'ACCESSORY', rarity: 'EPIC', levelRequired: 14, price: 4000, tokenPrice: 12, stats: { charisma: 5, strength: 5, attack: 3 }, isTokenOnly: false },

  // Vehicles
  { name: 'Stolen Bicycle', description: 'Gets you around', type: 'VEHICLE', rarity: 'COMMON', levelRequired: 1, price: 30, tokenPrice: 0, stats: { agility: 2 }, isTokenOnly: false },
  { name: 'Motorcycle', description: 'Fast escape vehicle', type: 'VEHICLE', rarity: 'UNCOMMON', levelRequired: 5, price: 800, tokenPrice: 0, stats: { agility: 8 }, isTokenOnly: false },
  { name: 'Muscle Car', description: 'Fast and furious', type: 'VEHICLE', rarity: 'RARE', levelRequired: 10, price: 3000, tokenPrice: 10, stats: { agility: 12, charisma: 3 }, isTokenOnly: false },
  { name: 'Armored SUV', description: 'Mobile fortress', type: 'VEHICLE', rarity: 'EPIC', levelRequired: 15, price: 8000, tokenPrice: 25, stats: { defense: 10, agility: 8 }, isTokenOnly: false },
  { name: 'Lambo', description: 'When lambo? Now.', type: 'VEHICLE', rarity: 'LEGENDARY', levelRequired: 20, price: 0, tokenPrice: 60, stats: { agility: 20, charisma: 15, respect: 10 }, isTokenOnly: true },

  // Tools
  { name: 'Lockpick Set', description: 'Basic lock picking tools', type: 'TOOL', rarity: 'COMMON', levelRequired: 2, price: 100, tokenPrice: 0, stats: { robberyBonus: 3 }, isTokenOnly: false },
  { name: 'Hacking Device', description: 'Electronic bypass tool', type: 'TOOL', rarity: 'UNCOMMON', levelRequired: 7, price: 700, tokenPrice: 0, stats: { robberyBonus: 8, intelligence: 3 }, isTokenOnly: false },
  { name: 'EMP Device', description: 'Disable electronics and alarms', type: 'TOOL', rarity: 'RARE', levelRequired: 12, price: 2500, tokenPrice: 8, stats: { robberyBonus: 15 }, isTokenOnly: false },
  { name: 'Master Skeleton Key', description: 'Opens any lock', type: 'TOOL', rarity: 'EPIC', levelRequired: 18, price: 6000, tokenPrice: 20, stats: { robberyBonus: 25 }, isTokenOnly: false },
];

export type Profession =
  | 'GANGSTER'
  | 'ROBBER'
  | 'DEALER'
  | 'HITMAN'
  | 'BROKER'
  | 'BUSINESSMAN'
  | 'PIMP';

export interface PlayerStats {
  level: number;
  experience: number;
  respect: number;
  money: number;
  tokenBalance: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  tickets: number;
  addiction: number;
  strength: number;
  defense: number;
  intelligence: number;
  charisma: number;
  agility: number;
}

export interface Player extends PlayerStats {
  id: string;
  walletAddress: string;
  username: string;
  avatarUrl: string | null;
  profession: Profession;
  professionLevel: number;
  professionXp: number;
  isInPrison: boolean;
  prisonUntil: string | null;
  isInHospital: boolean;
  hospitalUntil: string | null;
  lastRobberyAt: string | null;
  lastAssaultAt: string | null;
  roundId: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export interface PlayerPublic {
  id: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  respect: number;
  profession: Profession;
  professionLevel: number;
  gangTag: string | null;
  isOnline: boolean;
}

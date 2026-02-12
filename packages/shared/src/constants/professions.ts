import type { Profession } from '../types/player';

export interface ProfessionInfo {
  name: Profession;
  displayName: string;
  description: string;
  icon: string;
  levelRequired: number;
  bonuses: Record<string, number>;
}

export const PROFESSIONS: ProfessionInfo[] = [
  {
    name: 'GANGSTER',
    displayName: 'Gangster',
    description: 'Jack of all trades. Small bonuses to everything.',
    icon: '🔫',
    levelRequired: 1,
    bonuses: { robberySuccess: 0.05, assaultDamage: 0.05, moneyEarned: 0.05 },
  },
  {
    name: 'ROBBER',
    displayName: 'Robber',
    description: 'Master thief. Major robbery bonuses and extra nightclub tickets.',
    icon: '🎭',
    levelRequired: 3,
    bonuses: { robberySuccess: 0.20, ticketsPerDay: 20, maxTickets: 180 },
  },
  {
    name: 'DEALER',
    displayName: 'Dealer',
    description: 'Drug lord. Better drug prices and production speed.',
    icon: '💊',
    levelRequired: 5,
    bonuses: { drugProduction: 0.25, drugPrice: 0.15 },
  },
  {
    name: 'HITMAN',
    displayName: 'Hitman',
    description: 'Professional killer. Devastating in combat, reduced prison time.',
    icon: '🎯',
    levelRequired: 7,
    bonuses: { assaultDamage: 0.25, prisonReduction: 0.15 },
  },
  {
    name: 'BROKER',
    displayName: 'Broker',
    description: 'Money expert. Lower marketplace fees and casino edge.',
    icon: '📈',
    levelRequired: 8,
    bonuses: { marketplaceFee: -0.20, casinoEdge: 0.10 },
  },
  {
    name: 'BUSINESSMAN',
    displayName: 'Businessman',
    description: 'Business mogul. Earn more money from everything.',
    icon: '💼',
    levelRequired: 10,
    bonuses: { moneyEarned: 0.20, shopDiscount: 0.10 },
  },
  {
    name: 'PIMP',
    displayName: 'Pimp',
    description: 'Street manager. Better nightlife perks and charisma.',
    icon: '🎩',
    levelRequired: 6,
    bonuses: { staminaRecovery: 0.20, charismaBonus: 0.15 },
  },
];

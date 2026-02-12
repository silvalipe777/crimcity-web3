import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const HOSPITAL_PRICES = {
  HEAL: { baseCost: 50, perHp: 2 },
  DETOX: { baseCost: 100, perPercent: 5 },
  METHADONE: { baseCost: 500, flatReduction: 30 },
  PLASTIC_SURGERY: { baseCost: 2000 },
};

export class HospitalService {
  static getServices(player: { health: number; maxHealth: number; addiction: number; level: number }) {
    const healCost = HOSPITAL_PRICES.HEAL.baseCost + (player.maxHealth - player.health) * HOSPITAL_PRICES.HEAL.perHp;
    const detoxCost = HOSPITAL_PRICES.DETOX.baseCost + player.addiction * HOSPITAL_PRICES.DETOX.perPercent;

    return [
      {
        type: 'HEAL',
        name: 'Medical Treatment',
        description: 'Restore your health to full',
        cost: Math.floor(healCost),
        effect: `Restore ${player.maxHealth - player.health} HP`,
        available: player.health < player.maxHealth,
      },
      {
        type: 'DETOX',
        name: 'Detox Program',
        description: 'Reduce your drug addiction by 15%',
        cost: Math.floor(detoxCost),
        effect: 'Reduce addiction by 15%',
        available: player.addiction > 0,
      },
      {
        type: 'METHADONE',
        name: 'Methadone Treatment',
        description: 'Aggressive treatment to reduce addiction by 30%',
        cost: HOSPITAL_PRICES.METHADONE.baseCost,
        effect: 'Reduce addiction by 30%',
        available: player.addiction > 15 && player.level >= 5,
      },
      {
        type: 'PLASTIC_SURGERY',
        name: 'Plastic Surgery',
        description: 'Change your appearance and reduce wanted level',
        cost: HOSPITAL_PRICES.PLASTIC_SURGERY.baseCost,
        effect: 'Reset appearance',
        available: player.level >= 10,
      },
    ];
  }

  static async heal(playerId: string) {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new AppError('Player not found', 404);
    if (player.isInPrison) throw new AppError('You are in prison!', 400);
    if (player.health >= player.maxHealth) throw new AppError('You are already at full health', 400);

    const cost = HOSPITAL_PRICES.HEAL.baseCost + (player.maxHealth - player.health) * HOSPITAL_PRICES.HEAL.perHp;
    if (player.money < cost) throw new AppError('Not enough money', 400);

    const healthRestored = player.maxHealth - player.health;

    await prisma.$transaction(async (tx) => {
      await tx.player.update({
        where: { id: playerId },
        data: { health: player.maxHealth, money: { decrement: cost } },
      });
      await tx.hospitalVisit.create({
        data: { playerId, type: 'HEAL', cost, healthRestored },
      });
    });

    return { cost, healthRestored, message: `Healed ${healthRestored} HP for $${cost}` };
  }

  static async detox(playerId: string) {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new AppError('Player not found', 404);
    if (player.isInPrison) throw new AppError('You are in prison!', 400);
    if (player.addiction <= 0) throw new AppError('You have no addiction', 400);

    const cost = HOSPITAL_PRICES.DETOX.baseCost + player.addiction * HOSPITAL_PRICES.DETOX.perPercent;
    if (player.money < cost) throw new AppError('Not enough money', 400);

    const reduction = Math.min(15, player.addiction);

    await prisma.$transaction(async (tx) => {
      await tx.player.update({
        where: { id: playerId },
        data: { addiction: player.addiction - reduction, money: { decrement: cost } },
      });
      await tx.hospitalVisit.create({
        data: { playerId, type: 'DETOX', cost, addictionReduced: reduction },
      });
    });

    return { cost, addictionReduced: reduction, message: `Reduced addiction by ${reduction}% for $${Math.floor(cost)}` };
  }
}

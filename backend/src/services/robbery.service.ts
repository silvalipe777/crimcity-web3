import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { calculateRobberySuccess, randomBetween, calculatePrisonTime, calculateBribeCost } from '../../../packages/shared/src/utils/formulas';

export class RobberyService {
  static async getAvailableRobberies(playerLevel: number) {
    return prisma.robberyDefinition.findMany({
      where: { levelRequired: { lte: playerLevel } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async getAllRobberies() {
    return prisma.robberyDefinition.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async attemptRobbery(playerId: string, robberyId: string) {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stakingPosition: true,
        inventory: { include: { item: true }, where: { isEquipped: true } },
      },
    });

    if (!player) throw new AppError('Player not found', 404);
    if (player.isInPrison) throw new AppError('You are in prison!', 400);
    if (player.isInHospital) throw new AppError('You are in the hospital!', 400);

    const robbery = await prisma.robberyDefinition.findUnique({ where: { id: robberyId } });
    if (!robbery) throw new AppError('Robbery not found', 404);

    if (player.level < robbery.levelRequired) {
      throw new AppError(`You need level ${robbery.levelRequired} for this robbery`, 400);
    }

    if (player.stamina < robbery.staminaCost) {
      throw new AppError('Not enough stamina! Go to a nightclub to refill.', 400);
    }

    // Check cooldown
    if (player.lastRobberyAt) {
      const cooldownEnd = new Date(player.lastRobberyAt.getTime() + robbery.cooldownSeconds * 1000);
      if (new Date() < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd.getTime() - Date.now()) / 1000);
        throw new AppError(`Cooldown active. Wait ${remaining} seconds.`, 400);
      }
    }

    // Calculate bonuses
    const equipmentBonus = player.inventory.reduce((sum, inv) => {
      const stats = typeof inv.item.stats === 'string' ? JSON.parse(inv.item.stats) : inv.item.stats;
      const robberyBonus = (stats as Record<string, number>)['robberyBonus'] || 0;
      return sum + robberyBonus / 100;
    }, 0);

    const professionBonus = player.profession === 'ROBBER' ? 0.20 : (player.profession === 'GANGSTER' ? 0.05 : 0);
    const stakingBonus = player.stakingPosition
      ? getStakingRobberyBonus(player.stakingPosition.tier)
      : 0;

    // Calculate success
    const successRate = calculateRobberySuccess(
      robbery.baseDifficulty,
      player.level,
      player.strength,
      player.agility,
      player.intelligence,
      equipmentBonus,
      professionBonus,
      stakingBonus,
    );

    const roll = Math.random();
    const success = roll <= successRate;

    let moneyEarned = 0;
    let respectEarned = 0;
    let tokensEarned = 0;
    let wasCaught = false;
    let message = '';

    if (success) {
      moneyEarned = randomBetween(robbery.minRewardMoney, robbery.maxRewardMoney);
      respectEarned = randomBetween(robbery.minRewardRespect, robbery.maxRewardRespect);
      tokensEarned = robbery.tokenReward;

      // Apply profession bonus to money
      if (player.profession === 'BUSINESSMAN') {
        moneyEarned = Math.floor(moneyEarned * 1.20);
      }

      message = `Successfully robbed "${robbery.name}"! Earned $${moneyEarned} and ${respectEarned} respect.`;
    } else {
      // 30% chance of being caught on failure
      wasCaught = Math.random() < 0.3;
      message = wasCaught
        ? `Failed to rob "${robbery.name}" and got caught by the police!`
        : `Failed to rob "${robbery.name}". Better luck next time.`;
    }

    // Experience gained regardless of success
    const xpGained = success ? robbery.staminaCost * 2 : Math.floor(robbery.staminaCost * 0.5);

    // Update player in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create robbery attempt
      await tx.robberyAttempt.create({
        data: {
          playerId,
          robberyId,
          success,
          moneyEarned,
          respectEarned,
          tokensEarned,
          wasCaught,
        },
      });

      const updateData: Record<string, unknown> = {
        stamina: player.stamina - robbery.staminaCost,
        lastRobberyAt: new Date(),
        experience: player.experience + xpGained,
      };

      if (success) {
        updateData.money = player.money + moneyEarned;
        updateData.respect = player.respect + respectEarned;
      }

      if (wasCaught) {
        const prisonMinutes = calculatePrisonTime(
          robbery.sortOrder,
          player.profession === 'HITMAN' ? 0.15 : 0,
          stakingBonus > 0 ? getStakingPrisonReduction(player.stakingPosition!.tier) : 0,
        );
        const prisonUntil = new Date(Date.now() + prisonMinutes * 60 * 1000);
        updateData.isInPrison = true;
        updateData.prisonUntil = prisonUntil;

        await tx.prisonRecord.create({
          data: {
            playerId,
            reason: `Caught during "${robbery.name}"`,
            sentenceEnd: prisonUntil,
            bribeCost: calculateBribeCost(prisonMinutes, player.level),
          },
        });
      }

      const updatedPlayer = await tx.player.update({
        where: { id: playerId },
        data: updateData,
      });

      return updatedPlayer;
    });

    return {
      success,
      moneyEarned,
      respectEarned,
      tokensEarned,
      wasCaught,
      message,
      updatedStats: {
        stamina: result.stamina,
        money: result.money,
        respect: result.respect,
        experience: result.experience,
        level: result.level,
        isInPrison: result.isInPrison,
      },
    };
  }

  static async getHistory(playerId: string, page: number = 1, pageSize: number = 20) {
    const [items, total] = await Promise.all([
      prisma.robberyAttempt.findMany({
        where: { playerId },
        include: { robbery: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.robberyAttempt.count({ where: { playerId } }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}

function getStakingRobberyBonus(tier: string): number {
  const bonuses: Record<string, number> = { NONE: 0, BRONZE: 0, SILVER: 0.05, GOLD: 0.10, DIAMOND: 0.15 };
  return bonuses[tier] || 0;
}

function getStakingPrisonReduction(tier: string): number {
  const reductions: Record<string, number> = { NONE: 0, BRONZE: 0, SILVER: 0, GOLD: 0.10, DIAMOND: 0.20 };
  return reductions[tier] || 0;
}

import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class PrisonService {
  static async getStatus(playerId: string) {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: { isInPrison: true, prisonUntil: true, money: true, level: true },
    });

    if (!player) throw new AppError('Player not found', 404);

    if (!player.isInPrison || !player.prisonUntil) {
      return { inPrison: false, timeRemaining: 0, bribeCost: 0 };
    }

    const now = new Date();
    if (now >= player.prisonUntil) {
      // Auto-release
      await prisma.player.update({
        where: { id: playerId },
        data: { isInPrison: false, prisonUntil: null },
      });
      return { inPrison: false, timeRemaining: 0, bribeCost: 0 };
    }

    const remainingMs = player.prisonUntil.getTime() - now.getTime();
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    const bribeCost = remainingMinutes * 10 * (1 + player.level * 0.1);

    return {
      inPrison: true,
      timeRemaining: remainingMs,
      timeRemainingMinutes: remainingMinutes,
      prisonUntil: player.prisonUntil.toISOString(),
      bribeCost: Math.floor(bribeCost),
    };
  }

  static async bribe(playerId: string) {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new AppError('Player not found', 404);
    if (!player.isInPrison) throw new AppError('You are not in prison', 400);

    const now = new Date();
    if (player.prisonUntil && now >= player.prisonUntil) {
      await prisma.player.update({
        where: { id: playerId },
        data: { isInPrison: false, prisonUntil: null },
      });
      return { cost: 0, message: 'Your sentence is already over. You are free!' };
    }

    const remainingMs = player.prisonUntil!.getTime() - now.getTime();
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    const bribeCost = Math.floor(remainingMinutes * 10 * (1 + player.level * 0.1));

    if (player.money < bribeCost) {
      throw new AppError(`Not enough money to bribe. Need $${bribeCost}`, 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.player.update({
        where: { id: playerId },
        data: {
          isInPrison: false,
          prisonUntil: null,
          money: { decrement: bribeCost },
        },
      });
      await tx.prisonRecord.updateMany({
        where: { playerId, escaped: false },
        data: { escaped: true, escapedAt: new Date() },
      });
    });

    return { cost: bribeCost, message: `Bribed your way out for $${bribeCost}!` };
  }
}

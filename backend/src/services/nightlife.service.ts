import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class NightlifeService {
  static async getDrugs(playerLevel: number) {
    return prisma.drugDefinition.findMany({
      where: { levelRequired: { lte: playerLevel } },
      orderBy: { staminaRestore: 'asc' },
    });
  }

  static async useDrug(playerId: string, drugId: string, quantity: number = 1) {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new AppError('Player not found', 404);
    if (player.isInPrison) throw new AppError('You are in prison!', 400);

    const drug = await prisma.drugDefinition.findUnique({ where: { id: drugId } });
    if (!drug) throw new AppError('Drug not found', 404);

    if (player.level < drug.levelRequired) {
      throw new AppError(`You need level ${drug.levelRequired} for this drug`, 400);
    }

    const totalTickets = drug.ticketsRequired * quantity;
    if (player.tickets < totalTickets) {
      throw new AppError(`Not enough tickets. Need ${totalTickets}, have ${player.tickets}`, 400);
    }

    // Check drug inventory
    const drugInv = await prisma.drugInventory.findUnique({
      where: { playerId_drugId: { playerId, drugId } },
    });

    if (!drugInv || drugInv.quantity < quantity) {
      throw new AppError('You don\'t have enough of this drug. Buy some first.', 400);
    }

    const staminaRestored = Math.min(
      drug.staminaRestore * quantity,
      player.maxStamina - player.stamina
    );
    const addictionIncrease = drug.addictionRate * quantity;
    const newAddiction = Math.min(100, player.addiction + addictionIncrease);

    const result = await prisma.$transaction(async (tx) => {
      // Update drug inventory
      await tx.drugInventory.update({
        where: { playerId_drugId: { playerId, drugId } },
        data: { quantity: { decrement: quantity } },
      });

      // Update player stats
      return tx.player.update({
        where: { id: playerId },
        data: {
          stamina: player.stamina + staminaRestored,
          tickets: player.tickets - totalTickets,
          addiction: newAddiction,
          lastDrugUseAt: new Date(),
        },
      });
    });

    return {
      staminaRestored,
      addictionIncrease,
      newStamina: result.stamina,
      newTickets: result.tickets,
      newAddiction: result.addiction,
      message: `Used ${quantity}x ${drug.name}. Restored ${staminaRestored} stamina.`,
    };
  }

  static async buyDrug(playerId: string, drugId: string, quantity: number = 1) {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new AppError('Player not found', 404);

    const drug = await prisma.drugDefinition.findUnique({ where: { id: drugId } });
    if (!drug) throw new AppError('Drug not found', 404);

    const totalCost = drug.buyPrice * quantity;
    if (player.money < totalCost) {
      throw new AppError(`Not enough money. Need $${totalCost}, have $${player.money}`, 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.player.update({
        where: { id: playerId },
        data: { money: { decrement: totalCost } },
      });

      await tx.drugInventory.upsert({
        where: { playerId_drugId: { playerId, drugId } },
        update: { quantity: { increment: quantity } },
        create: { playerId, drugId, quantity },
      });
    });

    return {
      drugName: drug.name,
      quantity,
      totalCost,
      message: `Bought ${quantity}x ${drug.name} for $${totalCost}`,
    };
  }

  static async sellDrug(playerId: string, drugId: string, quantity: number = 1) {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new AppError('Player not found', 404);

    const drug = await prisma.drugDefinition.findUnique({ where: { id: drugId } });
    if (!drug) throw new AppError('Drug not found', 404);

    const drugInv = await prisma.drugInventory.findUnique({
      where: { playerId_drugId: { playerId, drugId } },
    });

    if (!drugInv || drugInv.quantity < quantity) {
      throw new AppError('Not enough drugs to sell', 400);
    }

    const totalEarned = drug.sellPrice * quantity;

    await prisma.$transaction(async (tx) => {
      await tx.drugInventory.update({
        where: { playerId_drugId: { playerId, drugId } },
        data: { quantity: { decrement: quantity } },
      });

      await tx.player.update({
        where: { id: playerId },
        data: { money: { increment: totalEarned } },
      });
    });

    return {
      drugName: drug.name,
      quantity,
      totalEarned,
      message: `Sold ${quantity}x ${drug.name} for $${totalEarned}`,
    };
  }
}

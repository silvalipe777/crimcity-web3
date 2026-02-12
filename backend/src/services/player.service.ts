import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class PlayerService {
  static async getPlayer(playerId: string) {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        gangMembership: {
          include: { gang: { select: { name: true, tag: true } } },
        },
        stakingPosition: true,
      },
    });

    if (!player) throw new AppError('Player not found', 404);
    return player;
  }

  static async getPublicProfile(playerId: string) {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        level: true,
        respect: true,
        profession: true,
        professionLevel: true,
        strength: true,
        defense: true,
        gangMembership: {
          include: { gang: { select: { tag: true } } },
        },
        createdAt: true,
      },
    });

    if (!player) throw new AppError('Player not found', 404);
    return player;
  }

  static async updateProfile(playerId: string, data: { username?: string; avatarUrl?: string }) {
    if (data.username) {
      const existing = await prisma.player.findFirst({
        where: { username: data.username, id: { not: playerId } },
      });
      if (existing) throw new AppError('Username already taken', 400);
    }

    return prisma.player.update({
      where: { id: playerId },
      data,
    });
  }

  static async getInventory(playerId: string) {
    return prisma.inventoryItem.findMany({
      where: { playerId },
      include: { item: true },
      orderBy: { item: { type: 'asc' } },
    });
  }

  static async getDrugInventory(playerId: string) {
    return prisma.drugInventory.findMany({
      where: { playerId },
      include: { drug: true },
    });
  }

  static async getNotifications(playerId: string, page: number = 1, pageSize: number = 20) {
    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where: { playerId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notification.count({ where: { playerId } }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  static async markNotificationsRead(playerId: string) {
    await prisma.notification.updateMany({
      where: { playerId, isRead: false },
      data: { isRead: true },
    });
  }
}

import { Router, Response } from 'express';
import { prisma } from '../config/database';

const router = Router();

router.get('/players', async (_req, res: Response) => {
  try {
    const page = parseInt(_req.query.page as string) || 1;
    const pageSize = 50;

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          level: true,
          respect: true,
          profession: true,
          gangMembership: { include: { gang: { select: { tag: true } } } },
        },
        orderBy: { respect: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.player.count(),
    ]);

    const ranked = players.map((p, i) => ({
      rank: (page - 1) * pageSize + i + 1,
      ...p,
      gangTag: p.gangMembership?.gang?.tag || null,
    }));

    res.json({ success: true, data: { items: ranked, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/gangs', async (_req, res: Response) => {
  try {
    const gangs = await prisma.gang.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { respect: 'desc' },
      take: 50,
    });

    const ranked = gangs.map((g, i) => ({
      rank: i + 1,
      ...g,
      memberCount: g._count.members,
    }));

    res.json({ success: true, data: ranked });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

export default router;

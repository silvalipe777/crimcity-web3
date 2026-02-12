import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  playerId?: string;
  player?: {
    id: string;
    walletAddress: string;
    username: string;
  };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { playerId: string; walletAddress: string };

    const player = await prisma.player.findUnique({
      where: { id: decoded.playerId },
      select: { id: true, walletAddress: true, username: true },
    });

    if (!player) {
      return res.status(401).json({ success: false, error: 'Player not found' });
    }

    req.playerId = player.id;
    req.player = player;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

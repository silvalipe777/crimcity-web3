import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'crimcity-super-secret-jwt-key-change-in-production';

export function generateToken(playerId: string, walletAddress: string): string {
  return jwt.sign({ playerId, walletAddress }, JWT_SECRET, { expiresIn: '7d' });
}

export async function getPlayerFromRequest(request: Request): Promise<{ id: string; walletAddress: string; username: string } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { playerId: string; walletAddress: string };

    const player = await prisma.player.findUnique({
      where: { id: decoded.playerId },
      select: { id: true, walletAddress: true, username: true },
    });

    return player;
  } catch {
    return null;
  }
}

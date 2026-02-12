import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import crypto from 'crypto';

export class AuthService {
  static generateToken(playerId: string, walletAddress: string): string {
    return jwt.sign(
      { playerId, walletAddress },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  // Dev login - simple username-based auth (no wallet required)
  static async devLogin(username: string) {
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 20) {
      throw new AppError('Username must be between 2 and 20 characters.', 400);
    }

    // Use username as a fake wallet address for dev purposes
    const fakeWallet = `dev_${trimmed}_${crypto.createHash('md5').update(trimmed).digest('hex').slice(0, 8)}`;

    const player = await prisma.player.upsert({
      where: { walletAddress: fakeWallet },
      update: {
        lastLoginAt: new Date(),
      },
      create: {
        walletAddress: fakeWallet,
        username: trimmed,
        nonce: null,
      },
    });

    const token = this.generateToken(player.id, fakeWallet);
    const isNewPlayer = !player.lastRobberyAt;

    return { token, player, isNewPlayer };
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AppError } from '@/lib/errors';
import { generateToken, getPlayerFromRequest } from '@/lib/auth-server';
import { calculateRobberySuccess, randomBetween, calculatePrisonTime, calculateBribeCost } from '../../../../../../packages/shared/src/utils/formulas';
import crypto from 'crypto';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function error(message: string, status = 400) {
  return json({ success: false, error: message }, status);
}

async function requireAuth(req: NextRequest) {
  const player = await getPlayerFromRequest(req);
  if (!player) throw new AppError('Unauthorized', 401);
  return player;
}

// ============ ROUTE HANDLER ============

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const route = path.join('/');

    // ---- ROBBERY ----
    if (route === 'robbery') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      const allRobberies = await prisma.robberyDefinition.findMany({ orderBy: { sortOrder: 'asc' } });
      const data = allRobberies.map(r => ({
        ...r,
        available: r.levelRequired <= (player?.level || 1),
        locked: r.levelRequired > (player?.level || 1),
      }));
      return json({ success: true, data });
    }

    if (route === 'robbery/history') {
      const auth = await requireAuth(req);
      const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
      const pageSize = 20;
      const [items, total] = await Promise.all([
        prisma.robberyAttempt.findMany({
          where: { playerId: auth.id },
          include: { robbery: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.robberyAttempt.count({ where: { playerId: auth.id } }),
      ]);
      return json({ success: true, data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
    }

    // ---- PLAYER ----
    if (route === 'player/me') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({
        where: { id: auth.id },
        include: {
          gangMembership: { include: { gang: { select: { name: true, tag: true } } } },
          stakingPosition: true,
        },
      });
      if (!player) return error('Player not found', 404);
      return json({ success: true, data: player });
    }

    if (route === 'player/me/inventory') {
      const auth = await requireAuth(req);
      const inventory = await prisma.inventoryItem.findMany({
        where: { playerId: auth.id },
        include: { item: true },
        orderBy: { item: { type: 'asc' } },
      });
      return json({ success: true, data: inventory });
    }

    if (route === 'player/me/drugs') {
      const auth = await requireAuth(req);
      const drugs = await prisma.drugInventory.findMany({
        where: { playerId: auth.id },
        include: { drug: true },
      });
      return json({ success: true, data: drugs });
    }

    if (route === 'player/me/notifications') {
      const auth = await requireAuth(req);
      const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
      const pageSize = 20;
      const [items, total] = await Promise.all([
        prisma.notification.findMany({
          where: { playerId: auth.id },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.notification.count({ where: { playerId: auth.id } }),
      ]);
      return json({ success: true, data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
    }

    if (path[0] === 'player' && path.length === 2 && path[1] !== 'me') {
      const playerId = path[1];
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        select: {
          id: true, username: true, avatarUrl: true, level: true, respect: true,
          profession: true, professionLevel: true, strength: true, defense: true,
          gangMembership: { include: { gang: { select: { tag: true } } } },
          createdAt: true,
        },
      });
      if (!player) return error('Player not found', 404);
      return json({ success: true, data: player });
    }

    // ---- NIGHTLIFE ----
    if (route === 'nightlife/drugs') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      const drugs = await prisma.drugDefinition.findMany({
        where: { levelRequired: { lte: player?.level || 1 } },
        orderBy: { staminaRestore: 'asc' },
      });
      const inventory = await prisma.drugInventory.findMany({
        where: { playerId: auth.id },
      });
      const data = drugs.map(drug => ({
        ...drug,
        owned: inventory.find(i => i.drugId === drug.id)?.quantity || 0,
      }));
      return json({ success: true, data });
    }

    // ---- HOSPITAL ----
    if (route === 'hospital/services') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      if (!player) return error('Player not found', 404);
      const healCost = 50 + (player.maxHealth - player.health) * 2;
      const detoxCost = 100 + player.addiction * 5;
      const services = [
        { type: 'HEAL', name: 'Medical Treatment', description: 'Restore your health to full', cost: Math.floor(healCost), effect: `Restore ${player.maxHealth - player.health} HP`, available: player.health < player.maxHealth },
        { type: 'DETOX', name: 'Detox Program', description: 'Reduce your drug addiction by 15%', cost: Math.floor(detoxCost), effect: 'Reduce addiction by 15%', available: player.addiction > 0 },
        { type: 'METHADONE', name: 'Methadone Treatment', description: 'Aggressive treatment to reduce addiction by 30%', cost: 500, effect: 'Reduce addiction by 30%', available: player.addiction > 15 && player.level >= 5 },
        { type: 'PLASTIC_SURGERY', name: 'Plastic Surgery', description: 'Change your appearance', cost: 2000, effect: 'Reset appearance', available: player.level >= 10 },
      ];
      return json({ success: true, data: services });
    }

    // ---- PRISON ----
    if (route === 'prison/status') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({
        where: { id: auth.id },
        select: { isInPrison: true, prisonUntil: true, money: true, level: true },
      });
      if (!player) return error('Player not found', 404);
      if (!player.isInPrison || !player.prisonUntil) {
        return json({ success: true, data: { inPrison: false, timeRemaining: 0, bribeCost: 0 } });
      }
      const now = new Date();
      if (now >= player.prisonUntil) {
        await prisma.player.update({ where: { id: auth.id }, data: { isInPrison: false, prisonUntil: null } });
        return json({ success: true, data: { inPrison: false, timeRemaining: 0, bribeCost: 0 } });
      }
      const remainingMs = player.prisonUntil.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      const bribeCost = Math.floor(remainingMinutes * 10 * (1 + player.level * 0.1));
      return json({ success: true, data: { inPrison: true, timeRemaining: remainingMs, timeRemainingMinutes: remainingMinutes, prisonUntil: player.prisonUntil.toISOString(), bribeCost } });
    }

    // ---- RANKING ----
    if (route === 'ranking/players') {
      const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
      const pageSize = 50;
      const [players, total] = await Promise.all([
        prisma.player.findMany({
          select: {
            id: true, username: true, avatarUrl: true, level: true, respect: true, profession: true,
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
      return json({ success: true, data: { items: ranked, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
    }

    if (route === 'ranking/gangs') {
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
      return json({ success: true, data: ranked });
    }

    return error('Not found', 404);
  } catch (err) {
    if (err instanceof AppError) return error(err.message, err.statusCode);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return error(message, 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const route = path.join('/');
    const body = await req.json().catch(() => ({}));

    // ---- AUTH ----
    if (route === 'auth/login') {
      const username = (body.username || '').trim();
      if (!username || username.length < 2 || username.length > 20) {
        return error('Username must be between 2 and 20 characters.');
      }
      const fakeWallet = `dev_${username}_${crypto.createHash('md5').update(username).digest('hex').slice(0, 8)}`;
      const player = await prisma.player.upsert({
        where: { walletAddress: fakeWallet },
        update: { lastLoginAt: new Date() },
        create: { walletAddress: fakeWallet, username, nonce: null },
      });
      const token = generateToken(player.id, fakeWallet);
      const isNewPlayer = !player.lastRobberyAt;
      return json({ success: true, data: { token, player, isNewPlayer } });
    }

    // ---- ROBBERY ATTEMPT ----
    if (path[0] === 'robbery' && path[2] === 'attempt') {
      const auth = await requireAuth(req);
      const robberyId = path[1];
      const player = await prisma.player.findUnique({
        where: { id: auth.id },
        include: {
          stakingPosition: true,
          inventory: { include: { item: true }, where: { isEquipped: true } },
        },
      });
      if (!player) return error('Player not found', 404);
      if (player.isInPrison) return error('You are in prison!');
      if (player.isInHospital) return error('You are in the hospital!');

      const robbery = await prisma.robberyDefinition.findUnique({ where: { id: robberyId } });
      if (!robbery) return error('Robbery not found', 404);
      if (player.level < robbery.levelRequired) return error(`You need level ${robbery.levelRequired} for this robbery`);
      if (player.stamina < robbery.staminaCost) return error('Not enough stamina! Go to a nightclub to refill.');

      if (player.lastRobberyAt) {
        const cooldownEnd = new Date(player.lastRobberyAt.getTime() + robbery.cooldownSeconds * 1000);
        if (new Date() < cooldownEnd) {
          const remaining = Math.ceil((cooldownEnd.getTime() - Date.now()) / 1000);
          return error(`Cooldown active. Wait ${remaining} seconds.`);
        }
      }

      const equipmentBonus = player.inventory.reduce((sum, inv) => {
        const stats = typeof inv.item.stats === 'string' ? JSON.parse(inv.item.stats) : inv.item.stats;
        return sum + ((stats as Record<string, number>)['robberyBonus'] || 0) / 100;
      }, 0);
      const professionBonus = player.profession === 'ROBBER' ? 0.20 : (player.profession === 'GANGSTER' ? 0.05 : 0);
      const stakingTier = player.stakingPosition?.tier || 'NONE';
      const stakingBonusMap: Record<string, number> = { NONE: 0, BRONZE: 0, SILVER: 0.05, GOLD: 0.10, DIAMOND: 0.15 };
      const stakingBonus = stakingBonusMap[stakingTier] || 0;

      const successRate = calculateRobberySuccess(robbery.baseDifficulty, player.level, player.strength, player.agility, player.intelligence, equipmentBonus, professionBonus, stakingBonus);
      const success = Math.random() <= successRate;

      let moneyEarned = 0, respectEarned = 0, tokensEarned = 0, wasCaught = false, message = '';

      if (success) {
        moneyEarned = randomBetween(robbery.minRewardMoney, robbery.maxRewardMoney);
        respectEarned = randomBetween(robbery.minRewardRespect, robbery.maxRewardRespect);
        tokensEarned = robbery.tokenReward;
        if (player.profession === 'BUSINESSMAN') moneyEarned = Math.floor(moneyEarned * 1.20);
        message = `Successfully robbed "${robbery.name}"! Earned $${moneyEarned} and ${respectEarned} respect.`;
      } else {
        wasCaught = Math.random() < 0.3;
        message = wasCaught ? `Failed and got caught by police!` : `Failed to rob "${robbery.name}". Better luck next time.`;
      }

      const xpGained = success ? robbery.staminaCost * 2 : Math.floor(robbery.staminaCost * 0.5);

      const result = await prisma.$transaction(async (tx) => {
        await tx.robberyAttempt.create({
          data: { playerId: auth.id, robberyId, success, moneyEarned, respectEarned, tokensEarned, wasCaught },
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
          const prisonReductionMap: Record<string, number> = { NONE: 0, BRONZE: 0, SILVER: 0, GOLD: 0.10, DIAMOND: 0.20 };
          const prisonMinutes = calculatePrisonTime(robbery.sortOrder, player.profession === 'HITMAN' ? 0.15 : 0, prisonReductionMap[stakingTier] || 0);
          const prisonUntil = new Date(Date.now() + prisonMinutes * 60 * 1000);
          updateData.isInPrison = true;
          updateData.prisonUntil = prisonUntil;
          await tx.prisonRecord.create({
            data: { playerId: auth.id, reason: `Caught during "${robbery.name}"`, sentenceEnd: prisonUntil, bribeCost: calculateBribeCost(prisonMinutes, player.level) },
          });
        }
        return tx.player.update({ where: { id: auth.id }, data: updateData });
      });

      return json({
        success: true,
        data: { success: success, moneyEarned, respectEarned, tokensEarned, wasCaught, message, updatedStats: { stamina: result.stamina, money: result.money, respect: result.respect, experience: result.experience, level: result.level, isInPrison: result.isInPrison } },
      });
    }

    // ---- NIGHTLIFE ----
    if (route === 'nightlife/use-drug') {
      const auth = await requireAuth(req);
      const drugId = body.drugId;
      const quantity = body.quantity || 1;
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      if (!player) return error('Player not found', 404);
      if (player.isInPrison) return error('You are in prison!');
      const drug = await prisma.drugDefinition.findUnique({ where: { id: drugId } });
      if (!drug) return error('Drug not found', 404);
      if (player.level < drug.levelRequired) return error(`You need level ${drug.levelRequired} for this drug`);
      const totalTickets = drug.ticketsRequired * quantity;
      if (player.tickets < totalTickets) return error(`Not enough tickets. Need ${totalTickets}, have ${player.tickets}`);
      const drugInv = await prisma.drugInventory.findUnique({ where: { playerId_drugId: { playerId: auth.id, drugId } } });
      if (!drugInv || drugInv.quantity < quantity) return error("You don't have enough of this drug. Buy some first.");
      const staminaRestored = Math.min(drug.staminaRestore * quantity, player.maxStamina - player.stamina);
      const addictionIncrease = drug.addictionRate * quantity;
      const newAddiction = Math.min(100, player.addiction + addictionIncrease);
      const result = await prisma.$transaction(async (tx) => {
        await tx.drugInventory.update({ where: { playerId_drugId: { playerId: auth.id, drugId } }, data: { quantity: { decrement: quantity } } });
        return tx.player.update({ where: { id: auth.id }, data: { stamina: player.stamina + staminaRestored, tickets: player.tickets - totalTickets, addiction: newAddiction, lastDrugUseAt: new Date() } });
      });
      return json({ success: true, data: { staminaRestored, addictionIncrease, newStamina: result.stamina, newTickets: result.tickets, newAddiction: result.addiction, message: `Used ${quantity}x ${drug.name}. Restored ${staminaRestored} stamina.` } });
    }

    if (route === 'nightlife/buy') {
      const auth = await requireAuth(req);
      const { drugId, quantity = 1 } = body;
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      if (!player) return error('Player not found', 404);
      const drug = await prisma.drugDefinition.findUnique({ where: { id: drugId } });
      if (!drug) return error('Drug not found', 404);
      const totalCost = drug.buyPrice * quantity;
      if (player.money < totalCost) return error(`Not enough money. Need $${totalCost}, have $${player.money}`);
      await prisma.$transaction(async (tx) => {
        await tx.player.update({ where: { id: auth.id }, data: { money: { decrement: totalCost } } });
        await tx.drugInventory.upsert({ where: { playerId_drugId: { playerId: auth.id, drugId } }, update: { quantity: { increment: quantity } }, create: { playerId: auth.id, drugId, quantity } });
      });
      return json({ success: true, data: { drugName: drug.name, quantity, totalCost, message: `Bought ${quantity}x ${drug.name} for $${totalCost}` } });
    }

    if (route === 'nightlife/sell') {
      const auth = await requireAuth(req);
      const { drugId, quantity = 1 } = body;
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      if (!player) return error('Player not found', 404);
      const drug = await prisma.drugDefinition.findUnique({ where: { id: drugId } });
      if (!drug) return error('Drug not found', 404);
      const drugInv = await prisma.drugInventory.findUnique({ where: { playerId_drugId: { playerId: auth.id, drugId } } });
      if (!drugInv || drugInv.quantity < quantity) return error('Not enough drugs to sell');
      const totalEarned = drug.sellPrice * quantity;
      await prisma.$transaction(async (tx) => {
        await tx.drugInventory.update({ where: { playerId_drugId: { playerId: auth.id, drugId } }, data: { quantity: { decrement: quantity } } });
        await tx.player.update({ where: { id: auth.id }, data: { money: { increment: totalEarned } } });
      });
      return json({ success: true, data: { drugName: drug.name, quantity, totalEarned, message: `Sold ${quantity}x ${drug.name} for $${totalEarned}` } });
    }

    // ---- HOSPITAL ----
    if (route === 'hospital/heal') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      if (!player) return error('Player not found', 404);
      if (player.isInPrison) return error('You are in prison!');
      if (player.health >= player.maxHealth) return error('You are already at full health');
      const cost = 50 + (player.maxHealth - player.health) * 2;
      if (player.money < cost) return error('Not enough money');
      const healthRestored = player.maxHealth - player.health;
      await prisma.$transaction(async (tx) => {
        await tx.player.update({ where: { id: auth.id }, data: { health: player.maxHealth, money: { decrement: cost } } });
        await tx.hospitalVisit.create({ data: { playerId: auth.id, type: 'HEAL', cost, healthRestored } });
      });
      return json({ success: true, data: { cost, healthRestored, message: `Healed ${healthRestored} HP for $${cost}` } });
    }

    if (route === 'hospital/detox') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      if (!player) return error('Player not found', 404);
      if (player.isInPrison) return error('You are in prison!');
      if (player.addiction <= 0) return error('You have no addiction');
      const cost = 100 + player.addiction * 5;
      if (player.money < cost) return error('Not enough money');
      const reduction = Math.min(15, player.addiction);
      await prisma.$transaction(async (tx) => {
        await tx.player.update({ where: { id: auth.id }, data: { addiction: player.addiction - reduction, money: { decrement: cost } } });
        await tx.hospitalVisit.create({ data: { playerId: auth.id, type: 'DETOX', cost, addictionReduced: reduction } });
      });
      return json({ success: true, data: { cost, addictionReduced: reduction, message: `Reduced addiction by ${reduction}% for $${Math.floor(cost)}` } });
    }

    // ---- PRISON ----
    if (route === 'prison/bribe') {
      const auth = await requireAuth(req);
      const player = await prisma.player.findUnique({ where: { id: auth.id } });
      if (!player) return error('Player not found', 404);
      if (!player.isInPrison) return error('You are not in prison');
      const now = new Date();
      if (player.prisonUntil && now >= player.prisonUntil) {
        await prisma.player.update({ where: { id: auth.id }, data: { isInPrison: false, prisonUntil: null } });
        return json({ success: true, data: { cost: 0, message: 'Your sentence is already over. You are free!' } });
      }
      const remainingMs = player.prisonUntil!.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      const bribeCost = Math.floor(remainingMinutes * 10 * (1 + player.level * 0.1));
      if (player.money < bribeCost) return error(`Not enough money to bribe. Need $${bribeCost}`);
      await prisma.$transaction(async (tx) => {
        await tx.player.update({ where: { id: auth.id }, data: { isInPrison: false, prisonUntil: null, money: { decrement: bribeCost } } });
        await tx.prisonRecord.updateMany({ where: { playerId: auth.id, escaped: false }, data: { escaped: true, escapedAt: new Date() } });
      });
      return json({ success: true, data: { cost: bribeCost, message: `Bribed your way out for $${bribeCost}!` } });
    }

    // ---- PLAYER UPDATE ----
    if (route === 'player/me') {
      const auth = await requireAuth(req);
      if (body.username) {
        const existing = await prisma.player.findFirst({ where: { username: body.username, id: { not: auth.id } } });
        if (existing) return error('Username already taken');
      }
      const player = await prisma.player.update({
        where: { id: auth.id },
        data: { ...(body.username && { username: body.username }), ...(body.avatarUrl && { avatarUrl: body.avatarUrl }) },
      });
      return json({ success: true, data: player });
    }

    if (route === 'player/me/notifications/read') {
      const auth = await requireAuth(req);
      await prisma.notification.updateMany({ where: { playerId: auth.id, isRead: false }, data: { isRead: true } });
      return json({ success: true, message: 'Notifications marked as read' });
    }

    return error('Not found', 404);
  } catch (err) {
    if (err instanceof AppError) return error(err.message, err.statusCode);
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('API Error:', err);
    return error(message, 500);
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return POST(req, context);
}

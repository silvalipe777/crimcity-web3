import { PrismaClient } from '@prisma/client';
import { ROBBERIES } from '../../packages/shared/src/constants/robberies';
import { DRUGS } from '../../packages/shared/src/constants/drugs';
import { ITEMS } from '../../packages/shared/src/constants/items';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  for (const robbery of ROBBERIES) {
    await prisma.robberyDefinition.upsert({ where: { name: robbery.name }, update: robbery, create: robbery });
  }
  console.log(`  ${ROBBERIES.length} robberies seeded`);

  for (const drug of DRUGS) {
    await prisma.drugDefinition.upsert({ where: { name: drug.name }, update: drug, create: drug });
  }
  console.log(`  ${DRUGS.length} drugs seeded`);

  for (const item of ITEMS) {
    const data = { ...item, stats: JSON.stringify(item.stats) };
    await prisma.itemDefinition.upsert({ where: { name: item.name }, update: data, create: data });
  }
  console.log(`  ${ITEMS.length} items seeded`);

  const existingRound = await prisma.gameRound.findFirst({ where: { isActive: true } });
  if (!existingRound) {
    const now = new Date();
    const endDate = new Date(now.getTime() + 39 * 24 * 60 * 60 * 1000);
    await prisma.gameRound.create({
      data: { roundNumber: 1, startDate: now, endDate, isActive: true, tokenRewardPool: 10000 },
    });
    console.log('  Initial round created');
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

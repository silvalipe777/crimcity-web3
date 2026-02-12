import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const DB_PATH = '/tmp/crimcity.db';
const SEED_DB_PATH = path.join(process.cwd(), 'prisma', 'seed.db');

function ensureDatabase() {
  if (process.env.NODE_ENV === 'development') return; // Dev uses local DB
  if (fs.existsSync(DB_PATH)) return;

  // Copy pre-built seed database to /tmp for Vercel
  if (fs.existsSync(SEED_DB_PATH)) {
    fs.copyFileSync(SEED_DB_PATH, DB_PATH);
  }
}

function getDatabaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return process.env.DATABASE_URL || 'file:./prisma/dev.db';
  }
  ensureDatabase();
  return `file:${DB_PATH}`;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

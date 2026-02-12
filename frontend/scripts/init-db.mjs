import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const seedDb = join(root, 'prisma', 'seed.db');

console.log('Initializing seed database for production...');

// Remove old seed.db if exists
if (existsSync(seedDb)) unlinkSync(seedDb);

// Run Prisma migrate to create the schema
process.env.DATABASE_URL = `file:${seedDb}`;
execSync('npx prisma migrate deploy', { cwd: root, stdio: 'inherit', env: { ...process.env, DATABASE_URL: `file:${seedDb}` } });

// Seed the data using tsx (can handle .ts imports)
console.log('Seeding data...');
execSync(`npx tsx ${join(__dirname, 'seed.ts')}`, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: `file:${seedDb}` },
});

console.log('Seed database ready!');

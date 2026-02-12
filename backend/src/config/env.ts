import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SOLANA_RPC_URL: z.string().default('https://api.devnet.solana.com'),
  SOLANA_NETWORK: z.string().default('devnet'),
  NODE_ENV: z.string().default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

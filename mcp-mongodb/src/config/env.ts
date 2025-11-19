import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DATABASE: z.string().default('college_portal'),
  MCP_SERVER_NAME: z.string().default('mongodb-server'),
  MCP_SERVER_VERSION: z.string().default('1.0.0'),
  MONGODB_MAX_POOL_SIZE: z.string().transform(Number).default('10'),
  MONGODB_MIN_POOL_SIZE: z.string().transform(Number).default('2'),
  MONGODB_CONNECT_TIMEOUT_MS: z.string().transform(Number).default('30000'),
  MONGODB_SOCKET_TIMEOUT_MS: z.string().transform(Number).default('45000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;


import { validateEnv } from './env.js';

validateEnv();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET!,
  databaseUrl: process.env.DATABASE_URL!,
  cookieName: 'access_token',
  cookieMaxAge: 24 * 60 * 60 * 1000, // 24h
} as const;

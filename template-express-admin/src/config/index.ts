import { validateEnv } from './env.js';

validateEnv();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET!,
  databaseUrl: process.env.DATABASE_URL!,
  cookieName: 'access_token',
  cookieMaxAge: 24 * 60 * 60 * 1000, // 24h
  // 开发环境代理时前端 5173、后端 3000，Cookie 需 domain: 'localhost' 才能跨端口带上
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
    ...(process.env.NODE_ENV !== 'production' && { domain: 'localhost' }),
  },
} as const;

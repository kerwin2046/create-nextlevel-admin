import bcrypt from 'bcrypt';
import { prisma } from '../lib/db.js';
import type { User } from '../types/auth.js';
import type { LoginPayload } from '../types/auth.js';
import type { RegisterPayload } from '../types/auth.js';

export async function login(payload: LoginPayload): Promise<User | null> {
  const row = await prisma.user.findUnique({
    where: { username: payload.username },
  });
  if (!row) return null;
  const ok = await bcrypt.compare(payload.password, row.passwordHash);
  if (!ok) return null;
  return {
    id: row.id,
    username: row.username,
    permissions: row.permissions,
  };
}

export async function register(payload: RegisterPayload): Promise<User | null> {
  const row = await prisma.user.create({
    data: { username: payload.username, passwordHash: await bcrypt.hash(payload.password, 10) },
  });
  return {
    id: row.id,
    username: row.username,
    permissions: row.permissions,
  };
}

export const authService = { login, register };

import jwt from 'jsonwebtoken';
import type { JwtPayload, User } from '../types/auth.js';
import { config } from '../config/index.js';

export function signToken(user: User): string {
  const payload: JwtPayload = {
    sub: user.id,
    username: user.username,
    permissions: user.permissions,
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
  return decoded;
}

export function payloadToUser(payload: JwtPayload): User {
  return {
    id: payload.sub,
    username: payload.username,
    permissions: payload.permissions,
  };
}

import type { Request, Response, NextFunction } from 'express';
import { verifyToken, payloadToUser } from '../utils/jwt.js';
import { config } from '../config/index.js';

/** Optional auth: attach user if valid token, else req.user stays undefined */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token =
    req.cookies?.[config.cookieName] ??
    req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    next();
    return;
  }
  try {
    const payload = verifyToken(token);
    req.user = payloadToUser(payload);
  } catch {
    // invalid token, leave req.user undefined
  }
  next();
}

/** Required auth: 401 if no valid token */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token =
    req.cookies?.[config.cookieName] ??
    req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing or invalid token' });
    return;
  }
  try {
    const payload = verifyToken(token);
    req.user = payloadToUser(payload);
    next();
  } catch {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
}

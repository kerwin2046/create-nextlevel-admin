import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '../services/auth.service.js';
import { signToken } from '../utils/jwt.js';
import { config } from '../config/index.js';

const loginSchema = [
  body('username').isString().notEmpty().trim(),
  body('password').isString().notEmpty(),
];

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ code: 'VALIDATION_ERROR', message: result.array().toString() });
      return;
    }
    const { username, password } = req.body as { username: string; password: string };
    const user = await authService.login({ username, password });
    if (!user) {
      res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid username or password' });
      return;
    }
    const token = signToken(user);
    res.cookie(config.cookieName, token, config.cookieOptions);
    res.json({ user });
  },

  logout(_req: Request, res: Response): void {
    res.clearCookie(config.cookieName, {
      path: config.cookieOptions.path,
      domain: config.cookieOptions.domain,
    });
    res.status(200).json({});
  },

  me(req: Request, res: Response): void {
    if (!req.user) {
      res.status(401).json({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
      return;
    }
    res.json(req.user);
  },
};

export { loginSchema };

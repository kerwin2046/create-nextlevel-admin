import { Router } from 'express';
import { authController, loginSchema } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginSchema, authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/me', requireAuth, authController.me.bind(authController));

export const authRoutes = router;

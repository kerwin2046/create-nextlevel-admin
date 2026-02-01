import { Router } from 'express';
import { authController, loginSchema, registerSchema } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router: Router = Router();

router.post('/login', loginSchema, authController.login.bind(authController));
router.post('/register', registerSchema, authController.register.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/me', requireAuth, authController.me.bind(authController));

export const authRoutes: Router = router;

import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
import { validate, authSchemas } from '../middlewares/validation';

const router = Router();

/**
 * POST /api/auth/login
 * Đăng nhập admin
 */
router.post('/login', validate(authSchemas.login), authController.login);

/**
 * GET /api/auth/me
 * Lấy thông tin admin hiện tại (cần auth)
 */
router.get('/me', authenticateToken, authController.getMe);

export default router;

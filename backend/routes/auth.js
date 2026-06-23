import express from 'express';
import { register, login, getMe, logout, updateAvatar } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegister, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me（需要登录）
router.get('/me', authenticateToken, getMe);

// POST /api/auth/logout
router.post('/logout', authenticateToken, logout);

// POST /api/auth/avatar（需要登录）
router.post('/avatar', authenticateToken, updateAvatar);

export default router;

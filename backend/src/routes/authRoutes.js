import express from 'express';
import {
    login,
    logout,
    me,
    refreshToken,
    register,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
    loginSchema,
    refreshTokenSchema,
    registerSchema,
} from '../validations/authValidation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;

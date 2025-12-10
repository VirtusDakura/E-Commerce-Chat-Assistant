import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validators/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';

const router = express.Router();

// Apply rate limiting to auth routes
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);

export default router;

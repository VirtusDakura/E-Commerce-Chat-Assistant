import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../validators/validate.js';
import {
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/userValidator.js';

const router = express.Router();

// All routes are protected (require authentication)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateUserProfile);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;

import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validators/validate.js';
import {
  getAllUsersSchema,
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
} from '../validators/adminValidator.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));
router.use(adminLimiter);

router.get('/users', validate(getAllUsersSchema), getAllUsers);
router.get('/users/:id', validate(getUserByIdSchema), getUserById);
router.put('/users/:id', validate(updateUserSchema), updateUser);
router.delete('/users/:id', validate(deleteUserSchema), deleteUser);

export default router;

import express from 'express';
import {
  createOrGetConversation,
  sendMessage,
  getUserConversations,
  getConversation,
  deleteConversation,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/conversations', protect, createOrGetConversation);
router.get('/conversations', protect, getUserConversations);
router.get('/conversations/:id', protect, getConversation);
router.post('/conversations/:id/messages', protect, sendMessage);
router.delete('/conversations/:id', protect, deleteConversation);

export default router;

import express from 'express';
import {
  chat,
  getConversationHistory,
  getUserConversations,
  deleteConversation,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Main chat endpoint with Gemini AI and Jumia scraping
router.post('/', protect, chat);

// Get conversation history by sessionId
router.get('/conversations/:sessionId', protect, getConversationHistory);

// Get all user conversations (paginated)
router.get('/conversations', protect, getUserConversations);

// Delete conversation by sessionId
router.delete('/conversations/:sessionId', protect, deleteConversation);

export default router;

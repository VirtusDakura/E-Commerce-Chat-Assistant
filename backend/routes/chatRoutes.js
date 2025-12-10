import express from 'express';
import {
  chat,
  getConversationHistory,
  getUserConversations,
  deleteConversation,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validators/validate.js';
import {
  chatMessageSchema,
  getConversationSchema,
  getUserConversationsSchema,
  deleteConversationSchema,
} from '../validators/chatValidator.js';

const router = express.Router();

// Apply rate limiting to all chat routes
router.use(chatLimiter);

// Main chat endpoint with Gemini AI and Jumia scraping
router.post('/', protect, validate(chatMessageSchema), chat);

// Get conversation history by sessionId
router.get('/conversations/:sessionId', protect, validate(getConversationSchema), getConversationHistory);

// Get all user conversations (paginated)
router.get('/conversations', protect, validate(getUserConversationsSchema), getUserConversations);

// Delete conversation by sessionId
router.delete('/conversations/:sessionId', protect, validate(deleteConversationSchema), deleteConversation);

export default router;

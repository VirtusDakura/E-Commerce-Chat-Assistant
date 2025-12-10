import {
  processChat,
  getConversationHistory as getConversationHistoryService,
  getUserConversations as getUserConversationsService,
  deleteConversation as deleteConversationService,
} from '../services/chatService.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { AuthenticationError } from '../errors/index.js';

/**
 * Main Chat Endpoint - Integrates Gemini AI with Jumia Search
 * @route   POST /api/chat
 * @access  Private
 */
export const chat = catchAsync(async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    throw new AuthenticationError('Authentication required');
  }

  const result = await processChat({ userId, message, sessionId });

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * Get conversation history
 * @route   GET /api/chat/conversations/:sessionId
 * @access  Private
 */
export const getConversationHistory = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user?.id || req.user?._id;

  const conversation = await getConversationHistoryService(userId, sessionId);

  res.status(200).json({
    success: true,
    data: conversation,
  });
});

/**
 * Get all user conversations
 * @route   GET /api/chat/conversations
 * @access  Private
 */
export const getUserConversations = catchAsync(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const { page, limit } = req.query;

  const result = await getUserConversationsService(userId, { page, limit });

  res.status(200).json({
    success: true,
    data: result.conversations,
    pagination: result.pagination,
  });
});

/**
 * Delete conversation
 * @route   DELETE /api/chat/conversations/:sessionId
 * @access  Private
 */
export const deleteConversation = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user?.id || req.user?._id;

  await deleteConversationService(userId, sessionId);

  res.status(200).json({
    success: true,
    message: 'Conversation deleted successfully',
  });
});

export default {
  chat,
  getConversationHistory,
  getUserConversations,
  deleteConversation,
};

import { create } from 'zustand';
import { generateId } from '../lib/utils';

const useChatStore = create((set, get) => ({
  // State
  messages: [],
  conversations: [],
  currentConversationId: null,
  isTyping: false,
  isLoading: false,
  error: null,

  // Actions
  addMessage: (message) => {
    const { messages } = get();
    const newMessage = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...message,
    };
    set({ messages: [...messages, newMessage] });
    return newMessage;
  },

  addUserMessage: (content) => {
    return get().addMessage({
      role: 'user',
      type: 'text',
      content,
    });
  },

  addAIMessage: (response) => {
    return get().addMessage({
      role: 'assistant',
      ...response,
    });
  },

  setTyping: (isTyping) => set({ isTyping }),

  clearMessages: () => set({ messages: [] }),

  setCurrentConversation: (conversationId) => {
    set({ currentConversationId: conversationId });
  },

  startNewConversation: () => {
    const newConversationId = generateId();
    const { conversations } = get();
    set({
      currentConversationId: newConversationId,
      messages: [],
      conversations: [
        ...conversations,
        {
          id: newConversationId,
          createdAt: new Date().toISOString(),
          title: 'New Conversation',
        },
      ],
    });
    return newConversationId;
  },

  updateConversationTitle: (conversationId, title) => {
    const { conversations } = get();
    set({
      conversations: conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, title } : conv
      ),
    });
  },

  deleteConversation: (conversationId) => {
    const { conversations, currentConversationId } = get();
    set({
      conversations: conversations.filter((conv) => conv.id !== conversationId),
      ...(currentConversationId === conversationId && {
        currentConversationId: null,
        messages: [],
      }),
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Getters
  getMessages: () => get().messages,
  getIsTyping: () => get().isTyping,
  getCurrentConversation: () => {
    const { conversations, currentConversationId } = get();
    return conversations.find((conv) => conv.id === currentConversationId);
  },
}));

export default useChatStore;

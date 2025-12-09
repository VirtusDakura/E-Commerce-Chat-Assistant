import { create } from 'zustand';
import { generateId } from '../lib/utils';

const useChatStore = create((set, get) => ({
  // State
  messages: [],
  conversations: [],
  currentSessionId: null,
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
      type: response.recommendations?.length > 0 ? 'products' : 'text',
      content: response.reply,
      products: response.recommendations || [],
      action: response.action,
    });
  },

  setSessionId: (sessionId) => set({ currentSessionId: sessionId }),

  setTyping: (isTyping) => set({ isTyping }),

  clearMessages: () => set({ messages: [], currentSessionId: null }),

  setConversations: (conversations) => set({ conversations }),

  startNewConversation: () => {
    set({
      currentSessionId: null,
      messages: [],
    });
  },

  deleteConversation: (sessionId) => {
    const { conversations, currentSessionId } = get();
    set({
      conversations: conversations.filter((conv) => conv.sessionId !== sessionId),
      ...(currentSessionId === sessionId && {
        currentSessionId: null,
        messages: [],
      }),
    });
  },

  loadConversation: (conversation) => {
    // Load messages from a conversation
    const messages = conversation.messages?.map((msg) => ({
      id: msg._id || generateId(),
      role: msg.role,
      type: msg.suggestedProducts?.length > 0 ? 'products' : 'text',
      content: msg.content,
      products: msg.suggestedProducts || [],
      timestamp: msg.metadata?.timestamp || new Date().toISOString(),
    })) || [];

    set({
      currentSessionId: conversation.sessionId,
      messages,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Getters
  getMessages: () => get().messages,
  getIsTyping: () => get().isTyping,
  getSessionId: () => get().currentSessionId,
}));

export default useChatStore;

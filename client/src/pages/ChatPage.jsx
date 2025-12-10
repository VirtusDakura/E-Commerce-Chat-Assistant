import { useRef, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSend, FiShoppingBag, FiMessageSquare, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import {
  ChatBubble,
  TypingIndicator,
  ProductResponse,
} from '../components/chat';
import { useChatStore, useAuthStore } from '../store';
import { chatAPI } from '../services/api';
import { toast } from '../components/ui/Toast';

// Suggestion cards for empty state
const suggestions = [
  {
    icon: '🛒',
    title: 'Find products',
    prompt: 'I need a smartphone under 2000 GHS with good camera',
  },
  {
    icon: '💡',
    title: 'Get recommendations',
    prompt: 'What are the best laptops for students?',
  },
  {
    icon: '��',
    title: 'Compare options',
    prompt: 'Compare wireless earbuds under 500 GHS',
  },
  {
    icon: '🎁',
    title: 'Gift ideas',
    prompt: 'Suggest birthday gifts for a tech lover',
  },
];

const ChatPage = () => {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPromptHandled = useRef(false);
  const pendingPrompt = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const user = useAuthStore((state) => state.user);
  
  const {
    messages,
    isTyping,
    currentSessionId,
    setTyping,
    setSessionId,
    addUserMessage,
    addAIMessage,
    clearMessages,
    startNewConversation,
  } = useChatStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  // Hide sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;
    
    addUserMessage(content);
    setInputValue('');
    setTyping(true);

    try {
      const response = await chatAPI.sendMessage(content, currentSessionId);
      setTyping(false);

      if (response.sessionId && response.sessionId !== currentSessionId) {
        setSessionId(response.sessionId);
        // Refresh history after new conversation
        fetchChatHistory();
      }

      addAIMessage(response);
    } catch (err) {
      setTyping(false);
      const errorMessage = err.response?.data?.message || "I'm sorry, I encountered an error. Please try again.";
      addAIMessage({
        reply: errorMessage,
        recommendations: [],
      });
      toast.error('Error', errorMessage);
    }
  }, [addUserMessage, setTyping, currentSessionId, setSessionId, addAIMessage]);

  // Handle initial prompt from URL
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl && !initialPromptHandled.current) {
      initialPromptHandled.current = true;
      pendingPrompt.current = promptFromUrl;
      setSearchParams({});
      startNewConversation();
    }
  }, [searchParams, setSearchParams, startNewConversation]);

  useEffect(() => {
    if (pendingPrompt.current && messages.length === 0 && !isTyping) {
      const prompt = pendingPrompt.current;
      pendingPrompt.current = null;
      sendMessage(prompt);
    }
  }, [messages.length, isTyping, sendMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleNewChat = () => {
    startNewConversation();
    clearMessages();
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Fetch chat history
  const fetchChatHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const history = await chatAPI.getHistory();
      setChatHistory(history || []);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Load chat history on mount
  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  // Load a specific conversation
  const loadConversation = async (sessionId) => {
    try {
      const conversation = await chatAPI.getConversation(sessionId);
      if (conversation) {
        const formattedMessages = conversation.messages?.map((msg, index) => ({
          id: msg._id || `msg-${index}`,
          role: msg.role,
          type: msg.suggestedProducts?.length > 0 ? 'products' : 'text',
          content: msg.content,
          products: msg.suggestedProducts || [],
          timestamp: msg.metadata?.timestamp || new Date().toISOString(),
        })) || [];
        
        clearMessages();
        setSessionId(sessionId);
        formattedMessages.forEach(msg => {
          if (msg.role === 'user') {
            addUserMessage(msg.content);
          } else {
            addAIMessage({
              reply: msg.content,
              recommendations: msg.products,
            });
          }
        });
      }
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    } catch (err) {
      toast.error('Error', 'Failed to load conversation');
    }
  };

  // Delete a conversation
  const deleteConversation = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteConversation(sessionId);
      setChatHistory(prev => prev.filter(chat => chat.sessionId !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
      toast.success('Deleted', 'Conversation deleted');
    } catch (err) {
      toast.error('Error', 'Failed to delete conversation');
    }
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  return (
    <div className="h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] flex bg-white">
      {/* Sidebar */}
      <div 
        className={`
          ${sidebarOpen ? 'w-72' : 'w-0'} 
          bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden
          fixed md:relative inset-y-0 left-0 z-40
          ${sidebarOpen ? 'md:w-72' : 'md:w-0'}
        `}
        style={{ top: 'inherit' }}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-full w-72">
          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-colors border border-gray-200"
            >
              <FiPlus className="w-5 h-5" />
              <span className="font-medium">New chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <p className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chat History
            </p>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="text-center py-8 px-4">
                <FiMessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.sessionId}
                    onClick={() => loadConversation(chat.sessionId)}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                      ${currentSessionId === chat.sessionId 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <FiMessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="flex-1 text-sm truncate">
                      {chat.title || chat.messages?.[0]?.content?.slice(0, 25) + '...' || 'New conversation'}
                    </span>
                    <button
                      onClick={(e) => deleteConversation(chat.sessionId, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                    >
                      <FiTrash2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-3 left-3 z-20 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200 transition-colors"
        >
          {sidebarOpen ? (
            <FiChevronLeft className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Empty State */}
        {messages.length === 0 && !isTyping ? (
          <div className="flex-1 flex flex-col">
            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  How can I help you shop today?
                </h1>
                <p className="text-gray-500 max-w-md">
                  I can help you find products, compare prices, and get the best deals from Jumia Ghana.
                </p>
              </motion.div>

              {/* Suggestion Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => sendMessage(suggestion.prompt)}
                    className="flex items-start gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left transition-colors group"
                  >
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {suggestion.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {suggestion.prompt}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="p-4">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message ShopSmart AI..."
                      rows={1}
                      className="flex-1 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-400 resize-none focus:outline-none max-h-[200px]"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </form>
                <p className="text-xs text-gray-400 text-center mt-2">
                  ShopSmart AI searches Jumia Ghana to find products for you
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Chat View */
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-6"
                    >
                      {message.role === 'user' ? (
                        <div className="flex justify-end">
                          <div className="flex gap-3 max-w-[85%]">
                            <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md">
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-sm font-medium text-gray-600">
                              {getUserInitials()}
                            </div>
                          </div>
                        </div>
                      ) : message.type === 'products' ? (
                        <ProductResponse message={message} />
                      ) : (
                        <ChatBubble message={message} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <TypingIndicator />
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 bg-white p-4">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message ShopSmart AI..."
                      rows={1}
                      className="flex-1 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-400 resize-none focus:outline-none max-h-[200px]"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

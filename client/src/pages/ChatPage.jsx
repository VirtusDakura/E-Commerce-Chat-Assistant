import { useRef, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  ChatBubble,
  ChatInput,
  TypingIndicator,
  ProductResponse,
  SuggestedPrompts,
} from '../components/chat';
import Button from '../components/ui/Button';
import { useChatStore } from '../store';
import { chatService } from '../services/chatService';
import { toast } from '../components/ui/Toast';

const ChatPage = () => {
  const messagesEndRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPromptHandled = useRef(false);
  const pendingPrompt = useRef(null);
  
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

  const [showSuggestions, setShowSuggestions] = useState(messages.length === 0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Define sendMessage function
  const sendMessage = useCallback(async (content) => {
    // Add user message
    addUserMessage(content);
    setShowSuggestions(false);
    setTyping(true);

    try {
      // Send message to backend with session ID for conversation continuity
      const response = await chatService.sendMessage(content, currentSessionId);
      setTyping(false);

      // Update session ID if new conversation
      if (response.sessionId && response.sessionId !== currentSessionId) {
        setSessionId(response.sessionId);
      }

      // Add AI response
      addAIMessage(response);
    } catch (error) {
      setTyping(false);
      const errorMessage = error.response?.data?.message || "I'm sorry, I encountered an error. Please try again.";
      addAIMessage({
        reply: errorMessage,
        recommendations: [],
      });
      toast.error('Error', errorMessage);
    }
  }, [addUserMessage, setTyping, currentSessionId, setSessionId, addAIMessage]);

  // Handle initial prompt from URL (e.g., from homepage "Try Asking..." cards)
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl && !initialPromptHandled.current) {
      initialPromptHandled.current = true;
      pendingPrompt.current = promptFromUrl;
      // Clear the URL parameter
      setSearchParams({});
      // Start fresh conversation
      startNewConversation();
    }
  }, [searchParams, setSearchParams, startNewConversation]);

  // Process pending prompt after conversation is ready
  useEffect(() => {
    if (pendingPrompt.current && messages.length === 0 && !isTyping) {
      const prompt = pendingPrompt.current;
      pendingPrompt.current = null;
      sendMessage(prompt);
    }
  }, [messages.length, isTyping, sendMessage]);

  const handleSendMessage = (content) => {
    sendMessage(content);
  };

  const handleSuggestionSelect = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleNewChat = () => {
    startNewConversation();
    setShowSuggestions(true);
  };

  return (
    <div className="h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <FiMessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">ShopSmart AI</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FiPlus className="w-4 h-4" />}
            onClick={handleNewChat}
          >
            New Chat
          </Button>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500"
              onClick={clearMessages}
            >
              <FiTrash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to ShopSmart AI
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                I'm your personal shopping assistant. Tell me what you're looking for, 
                and I'll help you find the perfect products!
              </p>
            </motion.div>
          )}

          {/* Suggested Prompts */}
          {showSuggestions && messages.length === 0 && (
            <SuggestedPrompts onSelect={handleSuggestionSelect} />
          )}

          {/* Chat Messages */}
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {message.role === 'user' ? (
                  <ChatBubble message={message} isUser />
                ) : message.type === 'products' ? (
                  <ProductResponse message={message} />
                ) : (
                  <ChatBubble message={message} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        onSend={handleSendMessage}
        isLoading={isTyping}
        placeholder="Ask me anything about products..."
      />
    </div>
  );
};

export default ChatPage;

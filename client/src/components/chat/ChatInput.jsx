import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMic, FiPaperclip } from 'react-icons/fi';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

const ChatInput = ({ onSend, isLoading = false, placeholder = 'Type your message...' }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 p-4 bg-white border-t border-gray-200">
        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
          title="Attach file"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Input Field */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={cn(
              'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl',
              'resize-none overflow-hidden',
              'text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition-all duration-200',
              'max-h-32'
            )}
            style={{
              minHeight: '48px',
              height: 'auto',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
        </div>

        {/* Voice Button */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
          title="Voice input"
        >
          <FiMic className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <motion.div
          animate={{
            scale: message.trim() ? 1 : 0.9,
            opacity: message.trim() ? 1 : 0.5,
          }}
        >
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            size="icon"
            className="rounded-full w-12 h-12"
            animate={false}
          >
            <FiSend className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Helper Text */}
      <div className="px-4 pb-2 text-xs text-gray-400 text-center bg-white">
        Press Enter to send, Shift + Enter for new line
      </div>
    </form>
  );
};

export default ChatInput;

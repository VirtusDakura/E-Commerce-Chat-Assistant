import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import { cn } from '../../lib/utils';
import Avatar from '../ui/Avatar';

const ChatBubble = ({ message, isUser = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-3 max-w-[85%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-white" />
          </div>
        ) : (
          <Avatar
            name="AI"
            size="sm"
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        {message.timestamp && (
          <p
            className={cn(
              'text-xs mt-1',
              isUser ? 'text-blue-200' : 'text-gray-400'
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;

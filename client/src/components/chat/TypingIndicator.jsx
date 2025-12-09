import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 max-w-[85%] mr-auto">
      {/* Avatar */}
      <div className="shrink-0">
        <Avatar
          name="AI"
          size="sm"
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
        />
      </div>

      {/* Typing Bubble */}
      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

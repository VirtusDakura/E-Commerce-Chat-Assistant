import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';

const TypingIndicator = () => {
  return (
    <div className="flex gap-4">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
        <FiShoppingBag className="w-4 h-4 text-white" />
      </div>

      {/* Typing Dots */}
      <div className="flex items-center gap-1 pt-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4],
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
  );
};

export default TypingIndicator;

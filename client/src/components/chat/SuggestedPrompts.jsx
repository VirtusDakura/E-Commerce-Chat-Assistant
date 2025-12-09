import { motion } from 'framer-motion';
import { FiSmartphone, FiMonitor, FiShoppingBag, FiGift } from 'react-icons/fi';

const suggestions = [
  {
    icon: FiSmartphone,
    text: 'I need a phone under 3000 GHS',
    category: 'phones',
  },
  {
    icon: FiMonitor,
    text: 'Find me a laptop for work',
    category: 'laptops',
  },
  {
    icon: FiShoppingBag,
    text: 'Show me fashion items',
    category: 'fashion',
  },
  {
    icon: FiGift,
    text: 'Help me find a gift for someone',
    category: 'gifts',
  },
];

const SuggestedPrompts = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">
        Not sure what to ask? Try one of these:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(suggestion.text)}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
          >
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
              <suggestion.icon className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
              {suggestion.text}
            </span>
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">
        Products are sourced from Jumia Ghana
      </p>
    </div>
  );
};

export default SuggestedPrompts;

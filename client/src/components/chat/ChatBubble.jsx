import { FiShoppingBag } from "react-icons/fi";

const ChatBubble = ({ message }) => {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
        <FiShoppingBag className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;

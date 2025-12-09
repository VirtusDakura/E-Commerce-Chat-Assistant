import React, { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4">
      {messages.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">How can I help you today?</h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm">
            I can help you find products, compare prices, or answer any questions about our catalog.
          </p>
        </div>
      )}

      {messages.map((msg, idx) => (
        <ChatBubble key={idx} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}

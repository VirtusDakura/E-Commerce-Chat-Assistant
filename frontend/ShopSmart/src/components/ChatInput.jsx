import React, { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || disabled) return;
        onSend(text.trim());
        setText("");
    };

    const handleVoiceNote = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            alert("Voice recording would start here. This feature requires browser microphone permission.");
        } else {
            alert("Voice recording stopped.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
                {/* Input Field */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    disabled={disabled}
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-800 placeholder-gray-400"
                />

                {/* Microphone Icon - Inside input on the right */}
                <button
                    type="button"
                    onClick={handleVoiceNote}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isRecording
                        ? 'text-red-600'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                    title="Voice note"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>
            </div>

            {/* Send Button - Separate blue button */}
            <button
                type="submit"
                disabled={!text.trim() || disabled}
                className="px-6 py-3 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-sm shadow-sm"
                style={{ backgroundColor: '#2563EB' }}
            >
                Send
            </button>
        </form>
    );
}

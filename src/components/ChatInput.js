// src/components/ChatInput.js
import React, { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Auto resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() === "") return;
    onSend(message.trim());
    setMessage("");
  };

  // Send on Ctrl+Enter or Cmd+Enter
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-4 space-x-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-3xl mx-auto">
      <textarea
        ref={textareaRef}
        rows={1}
        className="flex-grow resize-none rounded-md border border-gray-300 dark:border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={message.trim() === ""}
      >
        Send
      </button>
    </div>
  );
}

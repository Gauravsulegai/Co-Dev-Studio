// src/components/ChatMessages.js
import React from "react";

export default function ChatMessages({ messages }) {
  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto max-h-[70vh] bg-gray-50 dark:bg-gray-900 rounded-md">
      {messages.length === 0 ? (
        <p className="text-center text-gray-400">No messages yet.</p>
      ) : (
        messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.isUser ? "self-end bg-blue-500 text-white" : "bg-gray-300 text-gray-900"
            }`}
          >
            <p className="font-semibold">{msg.sender}</p>
            <p className="whitespace-pre-wrap">{msg.text}</p>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
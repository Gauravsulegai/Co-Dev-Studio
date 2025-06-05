import React from 'react';

export default function TypingIndicator({ name }) {
  if (!name) return null;
  return (
    <div className="text-sm italic text-gray-600 dark:text-gray-300 mt-1">
      ✏️ {name} is typing...
    </div>
  );
}

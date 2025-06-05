// src/utils/chat.js

export async function sendMessageToDB(messageData) {
  const res = await fetch('/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  });

  return res.json();
}

export async function fetchMessages(roomId) {
  const res = await fetch(`/api/message?roomId=${roomId}`);
  return res.json();
}

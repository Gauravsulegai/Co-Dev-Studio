import { io } from 'socket.io-client';

let socket;

export function initSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL); // e.g., http://localhost...
  }
  return socket;
}

export function emitTyping(roomId, userName) {
  socket?.emit('typing', { roomId, userName });
}

export function onTyping(callback) {
  socket?.on('typing', callback);
}

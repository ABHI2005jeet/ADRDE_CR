import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(userId) {
  const url = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  if (socket?.connected) {
    socket.emit('join', userId);
    return socket;
  }
  socket = io(url, { transports: ['websocket', 'polling'], autoConnect: true });
  socket.on('connect', () => {
    if (userId) socket.emit('join', userId);
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

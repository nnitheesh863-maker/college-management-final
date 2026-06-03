import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
  if (socket?.connected) return socket;

  socket = io('http://127.0.0.1:5001', {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
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

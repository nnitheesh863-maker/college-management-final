import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Notification from '../models/Notification.js';

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    },
    path: '/socket.io',
    transports: ['polling', 'websocket'],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.userName = decoded.name;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const room = `user:${socket.userId}`;
    socket.join(room);
    console.log(`🔌 Socket connected: ${socket.userName} (${socket.userRole}) -> room ${room}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.userName}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export async function createAndEmitNotification({ userId, message, type = 'info', category = 'system', link = '' }) {
  try {
    const notification = await Notification.create({ userId, message, type, category, link });
    const plain = notification.toObject();
    if (io) {
      io.to(`user:${userId}`).emit('new-notification', plain);
    }
    return plain;
  } catch (err) {
    console.error('Failed to create notification:', err.message);
    return null;
  }
}

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { connectSocket, disconnectSocket } from '../services/socket';
import api from '../services/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const addToast = useCallback((notification) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { ...notification, _toastId: id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t._toastId !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t._toastId !== id));
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications?limit=20');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // server may be offline
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      disconnectSocket();
      return;
    }

    const token = localStorage.getItem('token');
    fetchNotifications();

    const socket = connectSocket(token);

    socket.on('new-notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      addToast(notification);
    });

    return () => {
      socket.off('new-notification');
    };
  }, [isAuthenticated, user, fetchNotifications, addToast]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

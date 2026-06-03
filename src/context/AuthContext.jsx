import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredUser, logout as authLogout, login as authLogin, register as authRegister } from '../services/auth';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      api.get('/auth/me').then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authLogin(email, password);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authRegister(userData);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    authLogout();
  }, []);

  const isAuthenticated = !!user;
  const role = user?.role;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

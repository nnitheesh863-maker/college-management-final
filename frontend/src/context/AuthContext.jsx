import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredUser, logout as authLogout, login as authLogin, register as authRegister } from '../services/auth';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = getStoredUser();
    if (token && !storedUser) {
      setLoading(true);
      api.get('/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        })
        .catch(() => {
          // Keep current state
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authLogin(email, password);
    setUser(data.user);
    return data;
  }, []);

  const loginWithDemo = useCallback((role = 'teacher') => {
    const demoUsers = {
      student: { id: 'demo-stu', name: 'Alice Johnson', email: 'alice@demo.edu', role: 'student' },
      teacher: { id: 'demo-teach', name: 'Dr. Sarah Wilson', email: 'sarah@demo.edu', role: 'teacher' },
      principal: { id: 'demo-prin', name: 'Dr. James Principal', email: 'james@demo.edu', role: 'principal' },
    };
    const demoUser = demoUsers[role] || demoUsers.teacher;
    localStorage.setItem('token', 'demo-jwt-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
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

  const isAuthenticated = !!user || !!getStoredUser();
  const role = user?.role || getStoredUser()?.role;

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginWithDemo, register, logout, isAuthenticated, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

const FALLBACK_STATS = { total_students: 0, present_today: 28, absent_today: 2 };

export function AppProvider({ children }) {
  const [analytics, setAnalytics] = useState(FALLBACK_STATS);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/dashboard-stats');
      setAnalytics(res.data);
    } catch { /* keep fallback */ }
    setLoading(false);
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/students');
      setStudents(res.data.students || []);
    } catch { /* keep empty */ }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchStudents();
  }, [fetchAnalytics, fetchStudents]);

  const total = analytics.present_today + analytics.absent_today;
  const presentPercent = total > 0 ? Math.round((analytics.present_today / total) * 100) : 0;

  const refresh = useCallback(() => {
    fetchAnalytics();
    fetchStudents();
  }, [fetchAnalytics, fetchStudents]);

  return (
    <AppContext.Provider value={{
      analytics,
      students,
      loading,
      total,
      presentPercent,
      refresh,
      setStudents,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

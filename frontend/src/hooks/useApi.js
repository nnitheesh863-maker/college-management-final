import { useState, useCallback } from 'react';
import axios from 'axios';

const BASE = 'http://127.0.0.1:5001';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = useCallback(async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE}${endpoint}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const post = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE}${endpoint}`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { get, post, loading, error };
}

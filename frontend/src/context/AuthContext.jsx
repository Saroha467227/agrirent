import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { cancelAllPendingRequests } from '../api/axios';
import {
  clearAuthStorage,
  getAccessToken,
  getDashboardPath,
  getStoredUser,
  normalizeAuthPayload,
  setAuthStorage,
} from '../utils/auth';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  // ── Listen for forced logout from the Axios interceptor ──────
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleForcedLogout);

    return () => {
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, []);

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/login', credentials);
      const authData = normalizeAuthPayload(response.data);

      if (!authData.accessToken || !authData.user) {
        throw new Error('Login response did not include the expected user and token data.');
      }

      setAuthStorage(authData);
      setUser(authData.user);

      return authData.user;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register (auto-login: stores tokens and sets user) ──────
  const register = useCallback(async (formData) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const authData = normalizeAuthPayload(response.data);

      if (!authData.accessToken || !authData.user) {
        throw new Error('Registration response did not include the expected user and token data.');
      }

      setAuthStorage(authData);
      setUser(authData.user);

      return authData.user;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    // 1. Cancel every in-flight API request to prevent stale
    //    responses from overwriting state after sign-out
    cancelAllPendingRequests();

    // 2. Clear persisted auth data
    clearAuthStorage();

    // 3. Reset React state
    setUser(null);
  }, []);

  // ── Context value (memoized to avoid unnecessary re-renders) ─
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && getAccessToken()),
      getDashboardPath,
    }),
    [user, loading, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

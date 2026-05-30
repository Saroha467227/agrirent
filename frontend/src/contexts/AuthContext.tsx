import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { adaptUser } from '@/lib/adapters';
import type { BackendAuthResponse } from '@/lib/adapters';

export type UserRole = 'farmer' | 'renter' | 'both' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  phone?: string;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole, phone: string) => Promise<boolean>;
  googleLogin: (token: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function storeTokens(data: BackendAuthResponse) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // ── Restore session from localStorage on mount ──────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    if (storedUser && accessToken) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(adaptUser(parsed));
      } catch {
        clearTokens();
      }
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const { data } = await api.post<BackendAuthResponse>('/auth/login', { email, password });
      storeTokens(data);
      setUser(adaptUser(data.user));
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      setAuthError(msg);
      return false;
    }
  }, []);

  // ── Signup ────────────────────────────────────────────────────────
  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    phone: string
  ): Promise<boolean> => {
    setAuthError(null);
    try {
      // Map frontend role to backend role
      const backendRole = role === 'renter' ? 'owner' : role === 'both' ? 'farmer' : role;

      const { data } = await api.post<BackendAuthResponse>('/auth/register', {
        name,
        email,
        password,
        role: backendRole,
        phone,
      });
      storeTokens(data);
      setUser(adaptUser(data.user));
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Signup failed. Please try again.';
      setAuthError(msg + (error.response?.data ? ' Details: ' + JSON.stringify(error.response.data) : ''));
      return false;
    }
  }, []);

  // ── Google Login ──────────────────────────────────────────────────
  const googleLogin = useCallback(async (token: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const { data } = await api.post<BackendAuthResponse>('/auth/google', { token });
      storeTokens(data);
      setUser(adaptUser(data.user));
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Google Login failed. Please try again.';
      setAuthError(msg);
      return false;
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      googleLogin,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      authError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

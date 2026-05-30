import axios from 'axios';
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAuthStorage,
} from '../utils/auth';

// ─── Configuration ───────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Auth endpoints that should NEVER trigger the 401 refresh logic.
 * If /auth/login returns 401, that's "wrong password" — not "expired token".
 */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

const isAuthEndpoint = (url = '') =>
  AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

// ─── Primary API client ──────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ─── Isolated client for refresh calls (avoids interceptor loops) ─
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// ─── AbortController registry for cancellation on logout ─────────
let activeControllers = new Set();

/**
 * Cancels every in-flight request made through `api`.
 * Called by AuthContext.logout() to prevent stale responses
 * from arriving after the user has signed out.
 */
export const cancelAllPendingRequests = () => {
  activeControllers.forEach((controller) => {
    controller.abort();
  });
  activeControllers.clear();
};

// ─── Token refresh state ─────────────────────────────────────────
let isRefreshing = false;

/**
 * Queue of requests that received 401 while a refresh was in-flight.
 * Each entry holds { resolve, reject } to be settled once refresh completes.
 */
let failedQueue = [];

const processQueue = (error, newAccessToken = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newAccessToken);
    }
  });
  failedQueue = [];
};

// ─── Request interceptor ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // 1. Attach a per-request AbortController (unless one is already set)
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;
      activeControllers.add(controller);

      // Cleanup when the request settles (success or error)
      const cleanup = () => activeControllers.delete(controller);
      config._abortCleanup = cleanup;
    }

    // 2. Attach the access token
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Cleanup the AbortController reference on success
    response.config._abortCleanup?.();
    return response;
  },
  async (error) => {
    // Cleanup the AbortController reference on error too
    error.config?._abortCleanup?.();

    const originalRequest = error.config;

    // ── Guard clauses (early returns) ──────────────────────────
    // Not a 401 → pass through
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // No config or already retried → pass through
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Auth endpoint (login/register/refresh) → 401 is legitimate, don't retry
    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // No refresh token available → force logout
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthStorage();
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    }

    // ── Enqueue if a refresh is already in-flight ──────────────
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      });
    }

    // ── Initiate refresh ───────────────────────────────────────
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post('/auth/refresh', { refreshToken });

      const nextAccessToken = data.accessToken || data.token;
      const nextRefreshToken = data.refreshToken || data.refresh_token || refreshToken;

      if (!nextAccessToken) {
        throw new Error('Refresh response did not include an access token.');
      }

      // Persist new tokens
      setAuthStorage({
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        user: data.user,
      });

      // Drain the queue — all waiting requests get the new token
      processQueue(null, nextAccessToken);

      // Retry the original request with the fresh token
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — reject every queued request
      processQueue(refreshError, null);
      clearAuthStorage();
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

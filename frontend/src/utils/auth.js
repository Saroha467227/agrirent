export const ACCESS_TOKEN_KEY = 'agrirent_access_token';
export const REFRESH_TOKEN_KEY = 'agrirent_refresh_token';
export const USER_KEY = 'agrirent_user';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAuthStorage = ({ accessToken, refreshToken, user }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    clearAuthStorage();
    return null;
  }
};

export const normalizeAuthPayload = (payload = {}) => {
  const accessToken = payload.accessToken || payload.token || payload.jwt;
  const refreshToken = payload.refreshToken || payload.refresh_token;
  const user =
    payload.user || {
      _id: payload._id,
      id: payload.id || payload._id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };

  return {
    accessToken,
    refreshToken,
    user: user?.email ? user : null,
  };
};

export const getDashboardPath = (role) => {
  switch (role) {
    case 'owner':
      return '/owner/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'farmer':
    default:
      return '/farmer/dashboard';
  }
};

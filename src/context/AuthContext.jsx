import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authApi } from '../services/api.js';
import { checkApiHealth, getAuthToken, setAuthToken } from '../services/apiClient.js';
import { connectSocket, disconnectSocket } from '../services/socketService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('adrde-session-user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(null);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem('adrde-session-user', JSON.stringify(nextUser));
    else localStorage.removeItem('adrde-session-user');
  };

  const bootstrap = useCallback(async () => {
    const online = await checkApiHealth();
    setApiOnline(online);
    const token = getAuthToken();
    if (online && token) {
      try {
        const { user: me } = await authApi.me();
        persistUser(me);
        connectSocket(me.id);
      } catch {
        setAuthToken(null);
        persistUser(null);
      }
    }
  }, []);

  const register = async (payload) => {
    setLoading(true);
    try {
      const online = await checkApiHealth();
      setApiOnline(online);
      if (!online) throw new Error('API unavailable. Start the backend server.');
      const { token, user: registered } = await authApi.register(payload);
      setAuthToken(token);
      persistUser(registered);
      connectSocket(registered.id);
      return registered;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const online = await checkApiHealth();
      setApiOnline(online);
      if (!online) throw new Error('API unavailable. Start the backend server.');
      const { token, user: loggedIn } = await authApi.login(payload);
      setAuthToken(token);
      persistUser(loggedIn);
      connectSocket(loggedIn.id);
      return loggedIn;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    persistUser(null);
    disconnectSocket();
  };

  const updateProfile = async (payload) => {
    const { user: updated } = await authApi.updateProfile(payload);
    persistUser(updated);
    return updated;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      apiOnline,
      bootstrap,
      register,
      login,
      logout,
      updateProfile,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, apiOnline, bootstrap],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

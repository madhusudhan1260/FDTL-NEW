import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService';

const AuthContext = createContext(null);
const STORAGE_KEY = 'fdtl_user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async (email, password) => {
    const { token, user: profile } = await loginRequest(email, password);
    try {
      localStorage.setItem('fdtl_token', token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage unavailable (private mode) — session still works in memory.
    }
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('fdtl_token');
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import * as authApi from '../../api/auth';
import { hasPermission } from './rbac';
import type { User } from '../../types';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: Record<string, unknown>) => Promise<unknown>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await authApi.getCurrentUser();
      setUser(data as User);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (payload: Record<string, unknown>) => {
      const data = (await authApi.login(payload)) as { token?: string; user?: User };
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    },
    []
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const can = useCallback(
    (permission: string) =>
      user?.permissions ? hasPermission(user.permissions, permission) : false,
    [user]
  );

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    reload: loadUser,
    hasPermission: can,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

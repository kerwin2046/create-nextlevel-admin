import { useState, useEffect } from 'react';
import { getCurrentUser, loginApi, logoutApi } from './auth.service';
import type { User } from '@/types';
import type { LoginPayload } from '@/types';
import { AuthContext } from './auth.context';
import { AuthContextType } from './auth.types';

/**
 * 认证提供者组件，管理用户的登录状态和认证相关功能
 *
 * 该组件通过 React Context 提供全局的认证状态管理，包括：
 * - 当前用户信息
 * - 加载状态
 * - 登录/登出功能
 * - 页面刷新时自动恢复登录态
 *
 * @param children - React 子组件，将被包裹在认证上下文中
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 页面刷新时恢复登录态：有 Cookie 则 /me 返回用户，否则 401，置为未登录
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /** 登录 */
  const login = async (payload: LoginPayload) => {
    await loginApi(payload);
    const user = await getCurrentUser();
    setUser(user);
  };
  /** 登出 */
  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={
        { user, loading, isAuthenticated: !!user, login, logout } as unknown as AuthContextType
      }
    >
      {children}
    </AuthContext.Provider>
  );
}

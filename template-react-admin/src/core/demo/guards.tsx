import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/demo/context';

/** 未登录时跳转登录页 */
export function RequireAuth({ children }: { children: ReactNode }) {
  console.log('RequireAuth', children);
  const { user, loading } = useAuth();
  console.log('RequireAuth', user, loading);
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

/** 无某权限时隐藏或跳转 403 */
export function RequirePermission({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) return <>{fallback}</>;
  return <>{children}</>;
}

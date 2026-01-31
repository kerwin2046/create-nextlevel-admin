import { Navigate } from 'react-router-dom'
import { useAuth } from './auth.hooks'
import { AuthContextType } from './auth.types'

/**
 * @description 认证守卫，保护路由访问。未登录时重定向到登录页
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  console.log('AuthGuard', children);
  const { loading, isAuthenticated } = useAuth() as AuthContextType
  console.log('AuthGuard', loading, isAuthenticated);
  // 如果正在加载，返回 null
  // if (loading) return null
  // 如果未认证，重定向到登录页
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

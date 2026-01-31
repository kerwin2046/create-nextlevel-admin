import { Navigate } from 'react-router-dom'
import { useAuth } from './auth.hooks'
import { AuthContextType } from './auth.types'

/**
 * @description 认证守卫，保护路由访问。未登录时重定向到登录页
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth() as AuthContextType

  // 等 /me 请求完成再判断，否则刷新时会误判为未登录直接跳转
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

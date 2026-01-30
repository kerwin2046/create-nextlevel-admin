import { useContext } from 'react'
import { AuthContext } from './auth.context'
import { AuthContextType } from './auth.types'

/**
 * @description 使用认证上下文
 * @example const { user, loading, login, logout } = useAuth()
 */
export function useAuth(): AuthContextType | undefined {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}


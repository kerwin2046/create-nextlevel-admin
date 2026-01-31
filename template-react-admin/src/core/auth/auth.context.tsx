import { AuthContextType } from './auth.types'
import { createContext } from 'react'

/**
 * @description 认证上下文：只提供用户信息、登录、登出。抽象成接口定义 / 合同 / Protocol
 */
export const AuthContext =
  createContext<AuthContextType | undefined>(undefined)

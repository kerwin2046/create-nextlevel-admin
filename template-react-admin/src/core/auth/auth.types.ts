/** 用户信息：与后端约定一致 */
export type User = {
  id: string
  username: string
  role: string
}

/** 认证状态 */
export type AuthState = {
  // 当前用户信息
  user: User | null
  // 加载状态
  loading: boolean
  // 是否已认证
  isAuthenticated: boolean
}

/** 登录参数 */
export type LoginPayload = {
  username: string
  password: string
}

/** 注册参数 */
export type RegisterPayload = {
  username: string
  password: string
}

/** 认证上下文类型 */
export type AuthContextType = AuthState & { // & 表示与 AuthState 合并
  // 登录
  login: (data: LoginPayload) => Promise<void>
  // 登出
  logout: () => Promise<void>
}

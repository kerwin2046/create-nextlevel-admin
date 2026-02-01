/** 用户信息（与后端约定一致） */
export interface User {
  id: string;
  username: string;
  permissions?: string[];
  [key: string]: unknown;
}

/** 登录参数 */
export interface LoginPayload {
  username: string;
  password: string;
}

/** 注册参数 */
export interface RegisterPayload {
  username: string;
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  token?: string;
  user?: User;
  [key: string]: unknown;
}

/** 路由 meta 配置 */
export interface RouteMeta {
  title?: string;
  permissions?: string[];
}


import request from '@/api/client';

/** 登录 */
export const login = (data: Record<string, unknown>) =>
  request.post<unknown>('/auth/login', data);

/** 登出（可选：调用后端登出接口） */
export const logout = () => request.post('/auth/logout').catch(() => {});

/** 获取当前用户信息 */
export const getCurrentUser = () => request.get<unknown>('/auth/me');

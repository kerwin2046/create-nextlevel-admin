import request from '@/api/request';
import { LoginPayload } from '@/types';

export const loginApi = (data: LoginPayload) => request.post('/auth/login', data);

export const logoutApi = () => request.post('/auth/logout');

// mock 获取当前用户信息
export const getCurrentUser = () =>
  request.get('/auth/me').then(res => res.data);

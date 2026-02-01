import request from '@/api/request';
import { LoginPayload, RegisterPayload } from '@/types';

export const loginApi = (data: LoginPayload) => request.post('/auth/login', data);

export const registerApi = (data: RegisterPayload) => request.post('/auth/register', data);

export const logoutApi = () => request.post('/auth/logout');

// mock 获取当前用户信息
export const getCurrentUser = () =>
  request.get('/auth/me').then(res => res.data);

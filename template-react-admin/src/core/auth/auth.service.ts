import request from '@/api/request';
import { LoginPayload } from '@/types';
import { User } from '@/types';

export const loginApi = (data: LoginPayload) => request.post('/auth/login', data);

export const logoutApi = () => request.post('/auth/logout');

// mock 获取当前用户信息
export const getCurrentUser = () =>
  new Promise<User>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: '1',
        username: 'chenyilong916002@gmail.com',
        role: 'admin',
      });
      reject(new Error('Failed to get current user'));
    }, 1000);
  });

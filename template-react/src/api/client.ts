import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE ?? '/api';

export const request = axios.create({
  baseURL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截：注入 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// 响应拦截：统一错误与 401
request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const message =
      (err.response?.data as { message?: string })?.message ??
      err.message ??
      '请求失败';
    return Promise.reject(new Error(message));
  }
);

export default request;

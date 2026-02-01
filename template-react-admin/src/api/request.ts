import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// 刷新 token 锁
let isRefreshing = false;
// 请求队列：refresh 成功后重试、失败则 reject
let queue: Array<{ retry: () => void; reject: (e: unknown) => void }> = [];

request.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// ! 这个拦截器是重点，需要仔细阅读
request.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    // 401 时：login/register/me/refresh 不触发 refresh，直接 reject（登录失败 ≠ token 过期）
    const isAuthUrlNoRefresh = /\/auth\/(login|register|me|refresh)$/.test(original?.url ?? '');
    if (error.response?.status === 401 && !original?._retry && !isAuthUrlNoRefresh) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axios.post('/api/auth/refresh', {}, { withCredentials: true });
          queue.forEach(({ retry }) => retry());
          queue = [];
        } catch {
          queue.forEach(({ reject }) => reject(error));
          queue = [];
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        queue.push({
          retry: () => resolve(request(original)),
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default request;

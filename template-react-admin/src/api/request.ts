import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// 刷新 token 锁
let isRefreshing = false;
// 请求队列
let queue: Function[] = [];

request.interceptors.response.use(
  res => res,
  async error => {
    // 获取原始请求配置
    const original = error.config;
    console.log('original', original);

    // 如果请求状态码为 401 且未重试（/me、/refresh 不触发刷新，避免死循环或无效重试）
    const isAuthCheck = /\/auth\/(me|refresh)$/.test(original.url ?? '');
    if (error.response?.status === 401 && !original._retry && !isAuthCheck) {
      original._retry = true;

      // 如果未刷新 token
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 刷新 token
          await axios.post('/api/auth/refresh', {}, { withCredentials: true });
          // 执行队列中的请求
          queue.forEach(cb => cb());
          // 清空队列
          queue = [];
        } finally {
          // 刷新 token 锁
          isRefreshing = false;
        }
      }

      return new Promise(resolve => {
        // 将请求添加到队列中
        queue.push(() => resolve(request(original)));
      });
    }

    // 返回错误
    return Promise.reject(error);
  }
);

export default request;

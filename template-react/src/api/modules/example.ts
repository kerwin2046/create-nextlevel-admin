import request from '../client';

/** 示例：分页列表 */
export const getExampleList = (params?: Record<string, unknown>) =>
  request.get<unknown>('/example/list', { params });

/** 示例：详情 */
export const getExampleDetail = (id: string) =>
  request.get<unknown>(`/example/${id}`);

/** 示例：创建 */
export const createExample = (data: Record<string, unknown>) =>
  request.post<unknown>('/example', data);

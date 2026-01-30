import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { RequireAuth } from '@/core/auth/guards';
import BasicLayout from '@/layouts/BasicLayout';
import BlankLayout from '@/layouts/BlankLayout';
import type { RouteMeta } from '@/types';

// 占位页面，后续替换为实际页面组件
const Home = () => <div>首页</div>;
const Example = () => <div>示例页</div>;
const Login = () => <div>登录页（占位）</div>;

/** 带 meta 的路由项（RouteObject 交叉 meta/children，用于 RBAC） */
export type RouteObjectWithMeta = RouteObject & {
  meta?: RouteMeta;
  children?: RouteObjectWithMeta[];
};

/** 路由配置。meta.permissions 用于 RBAC，与后端权限码一致（如 user:read）。 */
const routes: RouteObjectWithMeta[] = [
  {
    path: '/login',
    element: <BlankLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Home />, meta: { title: '首页' } },
      {
        path: 'example',
        element: <Example />,
        meta: { title: '示例', permissions: ['example:read'] },
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes as RouteObject[], {
  // v7_startTransition is supported at runtime; types may lag
  // @ts-expect-error - FutureConfig in @types may not include v7_startTransition yet
  future: { v7_startTransition: true },
});
export { routes };
export default router;

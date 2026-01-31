# 给 AI 的说明书（NextLevel Admin 模板）

## 项目是什么

本仓库是基于 **NextLevel Admin 脚手架** 生成的后台/中台/ERP 前端：React 18 + Vite 5 + Ant Design 5 + TypeScript，内置权限、请求、状态等基建。

## 目录与职责

- **src/api/**：请求层。`client.ts` 为 axios 实例与拦截器；`auth.ts` 为登录/登出等；`modules/` 下按业务域拆分接口（如 `user.ts`、`system.ts`）。
- **src/core/auth/**：权限。`context.tsx` 为登录态；`guards.tsx` 为路由/按钮级守卫；`rbac.ts` 为权限判断工具。
- **src/core/state/**：全局状态入口，如 Zustand store（`store.ts`）。
- **src/layouts/**：布局组件（BasicLayout、BlankLayout 等）。
- **src/pages/**：页面与路由配置。`_routes.tsx` 定义路由及 `meta.permissions`。
- **src/types/**：共享 TypeScript 类型（User、RouteMeta 等）。
- **src/components/**：通用组件（`common/`、`business/`）。
- **src/hooks/**：自定义 Hooks。
- **src/utils/**、**src/constants/**：工具与常量。

## 如何新增

- **新页面**：在 `src/pages/` 下新增组件，并在 `_routes.tsx` 中注册路由与 `meta.permissions`。
- **新接口**：在 `src/api/modules/` 下对应域文件（或新建）中增加请求函数，统一使用 `api/client.ts` 导出的实例。
- **新权限**：在路由的 `meta.permissions` 中配置；按钮级用 `RequirePermission` 或 `useAuth().hasPermission`。
- **新类型**：在 `src/types/index.ts` 或对应模块中定义。

## 环境与命令

- 开发：`pnpm run dev`（默认 Vite 端口，如 5173）。
- 构建：`pnpm run build`。
- 代码风格：`pnpm run lint`、`pnpm run format`。

## 常见问题

- **401**：请求拦截器会清空登录态并跳转登录页。
- **baseURL**：在 `src/api/client.ts` 中配置，可通过 `import.meta.env.VITE_API_BASE` 区分环境。

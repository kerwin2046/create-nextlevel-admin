# NextLevel Admin 模板

本目录为 **create-nextlevel-admin** 的模板，可直接拷贝到新项目作为 `frontend/` 使用。

## 使用步骤

1. 将本目录（或除 README 外的全部内容）拷贝到新项目的 `frontend/`。
2. 在 `frontend/` 下执行 `pnpm install`（需 [pnpm](https://pnpm.io/)；`package.json` 已指定 `packageManager`）。
3. 复制 `.env.example` 为 `.env`，按需修改 `VITE_API_BASE`；或直接改 `src/api/client.ts` 中的 baseURL。
4. 在 `src/pages/_routes.tsx` 中配置业务路由与 `meta.permissions`。
5. 在 `src/api/modules/` 下按域添加接口；在 `src/core/auth` 中按需对接后端登录与权限接口；类型定义放在 `src/types/`。

## 命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发（默认端口 5173） |
| `pnpm build` | 类型检查 + 构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm lint` | ESLint 检查 |
| `pnpm format` | Prettier 格式化 |

## 目录与职责

| 目录 | 职责 |
|------|------|
| **src/api/** | 请求层。`client.ts` 为 axios 实例与拦截器；`auth.ts` 为登录/登出等；`modules/` 下按业务域拆分接口。 |
| **src/core/** | 应用级基建。`auth/`：登录态、路由/按钮守卫、RBAC；`state/`：全局 Zustand store。 |
| **src/layouts/** | 布局组件（BasicLayout、BlankLayout）。 |
| **src/pages/** | 页面与路由配置。`_routes.tsx` 定义路由及 `meta.permissions`。 |
| **src/components/** | 通用组件（`common/`）、业务组件（`business/`）。 |
| **src/types/** | 共享 TypeScript 类型。 |
| **src/hooks/** | 自定义 Hooks。 |
| **src/utils/**、**src/constants/** | 工具与常量。 |

## 前端必选库（已内置）

| 库 | 用途 |
|------|------|
| **@tanstack/react-query** | 服务端状态：请求缓存、loading/error、重试、与 axios 配合做列表/详情等。入口已包 `QueryClientProvider`。 |
| **ahooks** | 常用 Hooks：`useRequest`（可替代手写 loading）、`useLocalStorage`、`useDebounceFn` 等，与 antd 生态契合。 |
| **clsx** | 条件 className：`clsx('btn', isActive && 'active')`，体积小、无争议。 |
| **react-hook-form** | 表单状态与校验。配合 **@hookform/resolvers** + **zod** 做 schema 校验，可与 antd Form 控件结合（`Controller`）。 |

其余：react、react-router-dom、axios、antd、zustand、dayjs 等见 `package.json`。

## 当前状态

- **已就绪**：工程结构、请求/权限/状态基建、布局与路由骨架、TypeScript 与规范、React Query / ahooks / clsx。
- **占位**：登录页、首页、示例页为占位组件，需替换为实际页面；侧栏菜单为写死配置，可按需改为从路由配置生成。

## 约定与设计

见仓库根目录 `create-nextlevel-admin/README.md` 及（若存在）`docs/plans/2025-01-30-nextlevel-admin-scaffold-design.md`。

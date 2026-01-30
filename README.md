# create-nextlevel-admin

面向**后台 / 中台 / ERP** 的工程级前端脚手架：统一工程结构、代码风格、业务基建（权限 / 请求 / 状态）与 AI 友好约定。

## 项目定位

- **已具备**：分层目录、请求封装（axios + 拦截器）、权限（AuthContext + 路由守卫 + RBAC）、全局状态（Zustand）、布局骨架、路由配置、TypeScript + 规范（ESLint / Prettier / EditorConfig）及 Cursor 规则。
- **待完善**：登录页/首页为占位，需按业务实现；菜单目前与路由未自动联动；可按需补充测试、路由级权限校验等。

适合作为**种子项目**拷贝后，在约定下扩展业务页面与接口。

## 使用方式

1. **拷贝模板**：将 `template-react/` 目录内容拷贝到新项目的 `frontend/`（或目标目录）。
2. **安装依赖**：在目标目录执行 `pnpm install`（需 [pnpm](https://pnpm.io/)；模板已配置 `packageManager`）。
3. **环境变量**：复制 `.env.example` 为 `.env`，按需修改 `VITE_API_BASE`；或直接改 `src/api/client.ts` 中的 baseURL。
4. **按需修改**：替换项目名、权限配置、路由与菜单等。

（后续可增加 `scripts/generate.js` 一键生成到指定路径。）

## 目录说明

| 路径 | 说明 |
|------|------|
| **template-react/** | 可直接复用的前端工程模板（结构 + 基建 + AI 说明）。 |
| **scripts/** | 可选，生成脚本。 |
| **README.md** | 本说明。 |

## 技术栈（模板默认）

- React 18 + Vite 5 + Ant Design 5 + TypeScript
- axios（请求）、Zustand（全局状态）、**@tanstack/react-query**（服务端状态/缓存）、**ahooks**（常用 Hooks）、**clsx**（条件 className）、**react-hook-form** + **zod**（表单与校验）
- React Router 6
- ESLint + Prettier + EditorConfig

## 模板目录结构（template-react/src）

```
src/
├── api/           # 请求层：client.ts、auth.ts、modules/*.ts
├── core/          # 应用级基建（与业务解耦）
│   ├── auth/      # 权限：Context、守卫、RBAC
│   └── state/     # 全局状态：Zustand store
├── layouts/       # 布局：BasicLayout、BlankLayout
├── pages/         # 页面与路由配置 _routes.tsx
├── components/    # 通用组件 common/、业务组件 business/
├── types/         # 共享 TypeScript 类型
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
└── constants/     # 常量
```

**关于 core/**：仅放整站级、与具体业务弱耦合的模块（如权限、全局 UI 状态）。业务状态与页面逻辑放在页面或各自 Context 中。

## 统一约定摘要

| 维度     | 约定 |
|----------|------|
| 工程结构 | `src/api/`、`src/core/`（auth、state）、`src/layouts/`、`src/pages/` |
| 代码风格 | ESLint + Prettier + EditorConfig，PascalCase 组件、camelCase 非组件 |
| 权限     | AuthContext + 路由守卫 + RBAC（meta.permissions） |
| 请求     | 单 axios 实例 + 拦截器，按域拆分为 `api/modules/*.ts` |
| 状态     | `core/state/store.ts`（Zustand），仅放跨页面/基建相关 |
| AI 友好  | `.cursor/rules/` + `docs/ai/README.md` |
| Git      | `.gitignore`、`.gitattributes`（LF），建议 Conventional Commits |

## Git 规范

- **`.gitignore`**：已配置忽略 `node_modules/`、`dist/`、`.env*.local`、常见编辑器与系统文件。仓库根与 `template-react/` 下各有一份，拷贝模板后新项目即带忽略规则。
- **`.gitattributes`**：仓库根已配置 `* text=auto eol=lf`，统一换行符，便于跨平台协作。
- **提交信息**：建议使用 [Conventional Commits](https://www.conventionalcommits.org/)（如 `feat: 登录页`、`fix: 401 跳转`）。若需强制校验，可自行接入 husky + commitlint。

## 环境与包管理

- **Node**：建议 >= 18（模板 `package.json` 中已声明 `engines.node`）。
- **包管理**：使用 **pnpm**（`packageManager` 已指定）。首次克隆或拷贝后执行 `pnpm install`。未安装 pnpm 时可用 `corepack enable && corepack prepare pnpm@latest --activate`，或见 [pnpm 安装](https://pnpm.io/installation)。
- **环境变量**：模板内提供 `.env.example`，复制为 `.env` 后按需修改 `VITE_API_BASE` 等。

## 许可证

本项目采用 [MIT License](LICENSE)。


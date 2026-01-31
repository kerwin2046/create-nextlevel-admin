# 基于 Express 的后台架构设计

本文档描述与当前 React Admin 前端配套的 Express 后台推荐架构，便于前后端分工与后续扩展。

**开发规范**：目录、分层、命名、错误与响应、鉴权、代码风格等见 **[CONVENTIONS.md](./CONVENTIONS.md)**。AI 与编辑器约定见 `.cursor/rules/nextlevel-express-admin.mdc`。

### 本地运行（Docker + Prisma）

1. 启动 PostgreSQL：`docker compose up -d`
2. 复制 `.env.example` 为 `.env`，填写 `JWT_SECRET`，`DATABASE_URL` 默认即连本机 Docker 库
3. 安装依赖并生成 Prisma Client：`pnpm install`
4. 迁移并播种：`pnpm db:migrate`（首次会建表），`pnpm db:seed`（创建管理员 `admin` / `admin`）
5. 启动服务：`pnpm dev`，默认 `http://localhost:3000`

---

## 1. 整体分层

```
请求 → 中间件(全局) → 路由 → 控制器 → 服务层 → 数据访问/外部调用 → 响应
```

- **路由**：只做 URL 与 HTTP 方法映射，不写业务逻辑。
- **控制器**：解析请求（body/query/params）、校验入参、调用服务、组响应、处理 HTTP 状态码。
- **服务层**：业务逻辑、事务边界、调用数据访问或外部 API。
- **数据访问**：数据库/缓存/文件等，可按模块拆分（如 `user.repository.ts`）。

---

## 2. 目录结构建议

```text
backend/
├── src/
│   ├── app.ts              # 创建 Express 实例、挂载全局中间件、不 listen
│   ├── server.ts           # 启动入口：加载配置、连接 DB、app.listen
│   ├── config/
│   │   ├── index.ts        # 统一配置入口（环境变量等）
│   │   └── env.ts          # 校验必选环境变量
│   ├── middleware/
│   │   ├── auth.ts         # 鉴权：从 cookie/header 取 token，挂 user 到 req
│   │   ├── rbac.ts         # 权限：校验 req.user.permissions 是否包含所需权限
│   │   ├── error.ts        # 统一错误处理（4xx/5xx 格式化输出）
│   │   ├── validate.ts     # 请求体验证（如 express-validator）
│   │   └── requestId.ts    # 可选：请求 ID，便于日志追踪
│   ├── routes/
│   │   ├── index.ts        # 汇总所有路由，挂到 /api
│   │   ├── auth.routes.ts  # /api/auth/*（login, logout, refresh, me）
│   │   └── user.routes.ts  # /api/users/* 等业务路由
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── repositories/       # 或 models/、dal/
│   │   ├── user.repository.ts
│   │   └── ...
│   ├── models/             # 若用 ORM（如 Prisma/TypeORM）
│   │   └── ...
│   ├── types/
│   │   └── express.d.ts    # 扩展 Request：req.user, req.requestId 等
│   └── utils/
│       ├── jwt.ts
│       └── logger.ts
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 3. 与前端约定对齐

前端已使用：

- **BaseURL**：`/api`，且 `withCredentials: true`（带 Cookie）。
- **鉴权接口**：
  - `POST /api/auth/login`（登录）
  - `POST /api/auth/logout`（登出）
  - `POST /api/auth/refresh`（刷新 token）
  - 当前用户信息可由 `GET /api/auth/me` 或登录/refresh 响应里带出。
- **用户模型**：`User { id, username, permissions?: string[] }`，权限用字符串数组（如 `user:read`, `user:write`，或 `*` 表示超级权限）。

后台需保证：

- 所有 API 前缀为 `/api`。
- 登录/刷新后通过 **Cookie** 或 **Header** 下发 access token；若用 Cookie，需设置 `httpOnly`、`sameSite`、`secure`（生产）等，并配合 `/api/auth/refresh` 实现无感刷新。
- 返回的用户对象包含 `id`、`username`、`permissions`，以便前端 RBAC（如 `hasPermission(user.permissions, 'user:write')`）使用。

---

## 4. 鉴权与 RBAC

### 4.1 鉴权流程

1. **登录** `POST /api/auth/login`  
   - 校验用户名/密码 → 生成 access token（短期）与 refresh token（长期）。  
   - 将 refresh token 存库或 Redis，access token 可通过 Cookie 或 body 返回；若用 Cookie，建议 `access_token` 存 Cookie，前端不读 token，只带 Cookie 请求。

2. **刷新** `POST /api/auth/refresh`  
   - 仅接受带 refresh token 的请求（Cookie 或 body）。  
   - 校验 refresh token → 重新生成 access + refresh，同上写 Cookie/返回。

3. **鉴权中间件**  
   - 从 Cookie 或 `Authorization: Bearer <token>` 读取 access token。  
   - 校验并解码，将 `user`（含 `id`, `username`, `permissions`）挂到 `req.user`，供后续中间件和控制器使用。

### 4.2 RBAC 中间件

- 在需要权限的路由上使用，例如：`requirePermission('user:write')`。  
- 从 `req.user.permissions` 判断：  
  - 包含 `*` 或包含所需权限则放行；  
  - 否则返回 403。  
- 与前端 `hasPermission(user.permissions, 'user:write')` 的规则保持一致（字符串数组 + `*`）。

---

## 5. 错误与响应格式

- **统一错误中间件**：放在所有路由之后，根据错误类型设置 status（如 401/403/404/422/500），并返回统一结构，例如：

```json
{
  "code": "UNAUTHORIZED",
  "message": "未登录或 token 已失效",
  "requestId": "uuid"
}
```

- **业务校验**：在服务层抛出自定义错误类型（如 `AppError`），由错误中间件映射为 HTTP 状态码和上述 JSON，便于前端统一处理（如 401 触发刷新、403 提示无权限）。

---

## 6. 安全与运维

- **环境变量**：密钥、DB 连接串、CORS 白名单等全部从环境变量读取，用 `config` 统一导出；`.env.example` 列出必要项，不提交 `.env`。
- **CORS**：仅允许前端域名；若前后端同域可严格限制 origin。
- **限流**：对 `/api/auth/login` 等接口做 rate limit，防止暴力破解。
- **日志**：请求入口与错误处打日志，建议带 `requestId`，便于排查。
- **健康检查**：如 `GET /api/health`，用于负载均衡或容器探针。

---

## 7. 技术选型建议

| 用途       | 建议                     | 说明 |
|------------|--------------------------|------|
| 语言       | TypeScript               | 与前端类型一致，接口契约清晰。 |
| 框架       | Express                  | 轻量、生态成熟。 |
| 校验       | express-validator / zod  | 在控制器或中间件中校验 body/query。 |
| 鉴权       | jsonwebtoken + cookie     | 与前端 withCredentials 配合。 |
| 数据库     | 按需（Prisma / TypeORM / 原生） | 先定接口再选型。 |
| 日志       | pino / winston           | 结构化日志，便于收集。 |

---

## 8. 与前端联调要点

1. **代理**：开发时前端通过 Vite 代理将 `/api` 转发到 Express 端口，避免跨域；生产由 Nginx 等统一转发到后端。
2. **Cookie**：若 token 走 Cookie，后端需设置正确的 `domain`、`path`、`sameSite`，前端保持 `withCredentials: true`。
3. **401 与刷新**：前端已在 401 时调用 `/api/auth/refresh` 并重试请求，后端需保证 refresh 接口在合法 refresh token 下返回新的 token 并写 Cookie，且 401 语义明确（未登录或 access 失效）。

---

按上述分层与约定，可以先把「路由 → 控制器 → 服务 → 鉴权/RBAC」打通，再按业务逐步加模块（用户管理、角色管理等），与当前 React Admin 前端的 auth 与 RBAC 模型保持一致，便于协作与扩展。

# 后台开发规范（template-express-admin）

与 React Admin 前端配套的 Express 后台约定：目录、分层、命名、错误与响应、鉴权、代码风格。

---

## 1. 技术栈与环境

- **运行时**：Node >= 18，包管理 **pnpm**（`packageManager` 已指定）。
- **语言**：TypeScript，ESM（`"type": "module"`）。
- **框架**：Express；鉴权 JWT + cookie-parser；校验 express-validator；日志 pino。

---

## 2. 目录约定

| 路径 | 职责 |
|------|------|
| **src/app.ts** | 创建 Express 实例、挂载全局中间件，不 `listen`。 |
| **src/server.ts** | 启动入口：加载配置、连接 DB、`app.listen`。 |
| **src/config/** | 统一配置（环境变量），`env.ts` 校验必选变量。 |
| **src/middleware/** | 鉴权、RBAC、统一错误、校验、requestId。 |
| **src/routes/** | 路由定义，仅做 URL 映射，挂到 `/api`。 |
| **src/controllers/** | 解析请求、校验入参、调服务、组响应。 |
| **src/services/** | 业务逻辑、事务、调 repository/外部 API。 |
| **src/repositories/** | 数据访问（DB/缓存），按领域拆分。 |
| **src/models/** | ORM 模型（若用 Prisma/TypeORM）。 |
| **src/types/** | 共享类型、`express.d.ts` 扩展 `Request`。 |
| **src/utils/** | 纯工具（jwt、logger 等）。 |

**分层原则**：路由 → 控制器 → 服务 → 数据访问；不在路由/控制器写业务逻辑，不在服务层直接读 `req`/`res`。

---

## 3. 命名约定

- **文件**：kebab-case，按职责后缀。如 `auth.routes.ts`、`auth.controller.ts`、`auth.service.ts`、`user.repository.ts`。
- **路由文件**：`*.routes.ts`；控制器 `*.controller.ts`；服务 `*.service.ts`；数据访问 `*.repository.ts`。
- **变量/函数**：camelCase；类、接口、类型：PascalCase。
- **常量**：全大写下划线或 camelCase 视场景；配置项从 `config` 导出，不散落魔法值。
- **接口路径**：REST 风格，复数资源。如 `GET /api/users`、`GET /api/users/:id`；鉴权 `POST /api/auth/login`、`POST /api/auth/refresh`。

---

## 4. API 与响应格式

- **前缀**：所有接口统一 `/api`，与前端 `baseURL: '/api'` 一致。
- **成功响应**：JSON，结构一致。例如列表 `{ data: T[] }`，单条 `{ data: T }`，可选 `meta`（分页等）。
- **错误响应**：由统一错误中间件输出，格式一致：

```json
{
  "code": "UNAUTHORIZED",
  "message": "未登录或 token 已失效",
  "requestId": "uuid"
}
```

- **HTTP 状态码**：200 成功；201 创建成功；400 参数错误；401 未登录/Token 失效；403 无权限；404 资源不存在；422 业务校验失败；500 服务器错误。
- **与前端约定**：用户模型 `User { id, username, permissions?: string[] }`；登录/刷新返回 `user` 及可选的 `token`；Cookie 存 token 时需 `httpOnly`、`sameSite`、生产环境 `secure`。

---

## 5. 鉴权与 RBAC

- **鉴权中间件**：从 Cookie 或 `Authorization: Bearer <token>` 读取 access token，校验后将 `user`（含 `id`、`username`、`permissions`）挂到 `req.user`。
- **RBAC**：权限为字符串数组（如 `user:read`、`user:write`）；`*` 表示超级权限。中间件 `requirePermission('user:write')` 校验 `req.user.permissions`，不通过则 403。
- **接口**：`POST /api/auth/login`、`POST /api/auth/logout`、`POST /api/auth/refresh`；当前用户可 `GET /api/auth/me` 或由登录/refresh 响应带出。

---

## 6. 错误处理

- **业务错误**：在服务层抛出自定义错误类（如 `AppError`），带 `code`、`status`、`message`；由统一错误中间件捕获并返回上述 JSON 与对应 status。
- **校验错误**：express-validator 等在校验中间件中处理，失败直接返回 400/422 与统一格式。
- **未知错误**：不向客户端暴露堆栈；日志记录完整错误与 `requestId`。

---

## 7. 请求体验证

- 在控制器或路由层使用校验中间件（如 express-validator），对 `body`、`query`、`params` 做规则校验。
- 校验失败时返回 400/422 与统一错误格式，不进入控制器业务逻辑。

---

## 8. 类型与 Request 扩展

- **src/types/express.d.ts**：扩展 `Express.Request`，如 `user`、`requestId`，避免在控制器中到处断言。
- **服务层**：入参、出参使用明确类型；不依赖 `req`/`res`，便于单测与复用。

---

## 9. 配置与环境变量

- 所有敏感与环境相关配置从环境变量读取，由 `config` 统一导出（如 `config.port`、`config.jwtSecret`）。
- `.env.example` 列出必选与可选变量，不提交 `.env`；启动时通过 `env.ts` 校验必选变量，缺失则直接退出并提示。

---

## 10. 代码风格

- **换行与编码**：LF，UTF-8，文件末尾换行；与 EditorConfig、Prettier 一致。
- **引号与分号**：单引号，加分号；缩进 2 空格；行宽建议 100，可在 Prettier 中统一。
- **导入顺序**：先 Node/第三方，再内部模块；同组内按字母或路径排序均可，保持统一。
- **异步**：统一使用 `async/await`；在路由/控制器层用 `try/catch` 或交给统一错误中间件处理。

---

## 11. 日志与安全

- **日志**：请求入口与错误处打日志，建议带上 `requestId`；生产环境不打印敏感信息。
- **CORS**：仅允许前端可信域名。
- **限流**：对登录等敏感接口做 rate limit。
- **健康检查**：提供 `GET /api/health` 供负载均衡或探针使用。

---

## 12. 新增模块时

- **新领域**：在 `routes`、`controllers`、`services`、`repositories` 下增加对应 `*.routes.ts` 等，在 `routes/index.ts` 中挂载到 `/api/xxx`。
- **新中间件**：在 `middleware/` 下新增，在 `app.ts` 中按顺序挂载（如 requestId → cors → cookie-parser → 业务路由 → 错误中间件）。
- **新类型**：放在 `types/` 或对应模块旁，需全局扩展时写入 `express.d.ts`。

以上约定与仓库内 `README.md` 中的架构说明一致，与前端鉴权、RBAC、API 约定对齐，便于协作与 AI 辅助开发。

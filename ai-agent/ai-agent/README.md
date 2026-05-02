# AI Agent

一个统一的多 AI 模型管理平台，提供类 ChatGPT 的流式对话界面，支持配置和管理多种 AI 服务提供商。

## 功能特性

### 核心功能

- **多提供商管理** — 集中管理 OpenAI、Anthropic、DeepSeek、OpenRouter、Groq、Together AI、Ollama、Google AI Studio、Mistral、xAI 等 10+ 个 AI API 提供商。支持一键使用预设配置快速添加。
- **流式对话** — 实时流式聊天界面，支持 Markdown 渲染，支持 OpenAI 兼容和 Anthropic 两种 API 格式的流式代理。
- **会话管理** — 聊天记录自动持久化存储，支持新建、切换、删除会话，流式响应完成后自动保存。
- **国际化** — 完整的中文（zh）和英文（en）支持，根据浏览器语言自动检测或使用存储的偏好设置。
- **主题切换** — 支持亮色 / 暗色 / 跟随系统三种主题模式，通过 CSS 自定义属性实现平滑过渡动画。

### 扩展功能（从 cc-switch 迁移）

- **MCP 服务器管理** — 管理 Model Context Protocol 服务器，支持导入、TOML 配置验证、按应用切换启用状态。
- **自定义提示词** — 类似 CLAUDE.md 的按应用自定义提示词管理，支持启用/禁用和文件导入。
- **技能管理** — 安装、发现、更新、备份和管理跨不同 AI 编码助手的技能。
- **会话历史浏览** — 浏览和搜索存储在本地文件系统中的 AI 编码助手（Claude、Codex、Gemini 等）的聊天记录。
- **工作区 / 每日记忆** — 访问 OpenClaw 工作区文件和 Hermes 每日记忆文件。
- **代理管理** — 自定义和预设代理配置管理。
- **Deep Link 导入** — 通过结构化深度链接请求导入资源（提供商、提示词、MCP 服务器、技能）。
- **代理与故障转移** — 本地代理将流量转发到活跃的提供商，支持健康检查、熔断器和故障转移到备用提供商。
- **用量与费用追踪** — 追踪 Token 用量、费用、成功率和请求日志。
- **设置备份还原** — 应用设置支持备份和恢复。

## 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| React 18 + TypeScript | UI 框架 |
| Vite 7 | 构建工具 / 开发服务器 |
| React Router DOM v6 | 客户端路由 |
| TanStack React Query v5 | 服务端状态管理 |
| Tailwind CSS 3 | 原子化 CSS 样式 |
| Radix UI | 无障碍 UI 组件原语 |
| Framer Motion | 动画效果 |
| react-hook-form + zod | 表单管理和验证 |
| react-markdown | Markdown 消息渲染 |
| i18next + react-i18next | 国际化 |
| sonner | Toast 通知 |
| lucide-react | 图标库 |

### 后端

| 技术 | 用途 |
|------|------|
| Express.js 4 + TypeScript | HTTP 服务框架 |
| tsx | TypeScript 开发运行时（支持热重载） |
| cors | 跨域中间件 |
| uuid | 唯一 ID 生成 |

### 数据存储

所有数据以 **JSON 文件**形式持久化存储在本地文件系统中：

- `~/.ai-agent/` — 提供商、会话、应用设置
- `~/.cc-switch/` — cc-switch 迁移数据（MCP、技能、会话历史等）
- `~/.claude/`、`~/.codex/`、`~/.gemini/` 等 — 各 AI 编码助手本地配置

## 项目结构

```
ai-agent/
├── package.json                 # 根目录：concurrently 编排脚本
├── server/                      # Express 后端
│   └── src/
│       ├── index.ts             # 应用入口，注册所有路由
│       ├── types/               # TypeScript 类型定义
│       ├── config/presets.ts    # 各应用提供商预设
│       ├── routes/              # API 路由
│       ├── services/            # 业务逻辑层
│       ├── middleware/          # Express 中间件
│       └── utils/              # 工具函数
└── client/                      # React 前端
    └── src/
        ├── App.tsx              # 路由配置
        ├── main.tsx             # 应用入口
        ├── pages/               # 页面组件
        ├── components/          # UI 组件
        │   ├── chat/            # 聊天相关组件
        │   ├── providers/       # 提供商管理组件
        │   ├── layout/          # 布局组件
        │   └── ui/              # 基础 UI 组件
        ├── lib/                 # 工具库
        │   ├── api/             # API 调用封装
        │   ├── query/           # React Query hooks
        │   └── schemas/         # Zod 验证 schema
        ├── hooks/               # 自定义 hooks
        ├── i18n/                # 国际化配置和翻译文件
        └── config/              # 前端配置常量
```

## 快速开始

### 环境要求

- Node.js（推荐 18+ 版本）

### 安装依赖

```bash
npm run install:all
```

### 开发模式

同时启动前后端开发服务器：

```bash
npm run dev
```

- 前端开发服务器：`http://localhost:5173`
- 后端 API 服务器：`http://localhost:3001`

也可以分别启动：

```bash
npm run dev:server   # 仅启动后端
npm run dev:client   # 仅启动前端
```

### 生产构建

```bash
npm run build
```

### 生产启动

```bash
npm run start
```

## API 接口

| 路由 | 说明 |
|------|------|
| `GET/POST /api/providers` | 提供商列表 / 创建 |
| `PUT/DELETE /api/providers/:id` | 更新 / 删除提供商 |
| `POST /api/providers/test` | 测试提供商连接 |
| `POST /api/providers/models` | 获取提供商可用模型列表 |
| `POST /api/providers/presets` | 导入预设提供商 |
| `POST /api/chat/completions` | 流式聊天代理 |
| `GET/POST /api/conversations` | 会话列表 / 创建 |
| `PUT/DELETE /api/conversations/:id` | 更新 / 删除会话 |
| `GET/PUT /api/settings` | 获取 / 更新应用设置 |
| `POST /api/settings/backup` | 备份设置 |
| `POST /api/settings/restore` | 恢复设置 |
| `/api/prompts` | 自定义提示词管理 |
| `/api/mcp` | MCP 服务器管理 |
| `/api/skills` | 技能管理 |
| `/api/sessions` | 会话历史浏览 |
| `/api/workspace` | 工作区文件管理 |
| `/api/agents` | 代理配置管理 |
| `/api/openclaw` | OpenClaw 配置 |
| `/api/hermes` | Hermes 记忆管理 |
| `/api/deeplink` | Deep Link 导入 |
| `/api/usage` | 用量与费用追踪 |
| `/api/proxy` | 代理与故障转移 |

## 支持的 AI 提供商

| 提供商 | API 格式 |
|--------|----------|
| OpenAI | OpenAI |
| Anthropic | Anthropic |
| DeepSeek | OpenAI 兼容 |
| OpenRouter | OpenAI 兼容 |
| Groq | OpenAI 兼容 |
| Together AI | OpenAI 兼容 |
| Ollama | OpenAI 兼容 |
| Google AI Studio | OpenAI 兼容 |
| Mistral | OpenAI 兼容 |
| xAI (Grok) | OpenAI 兼容 |
| 自定义 | OpenAI 兼容 或 Anthropic |

## License

MIT

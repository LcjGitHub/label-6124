# 万年历

基于 Next.js 14 + TypeScript + Tailwind CSS 的万年历应用，提供农历查询、干支纪年、节气提醒、节日标注、日期对比、收藏等功能。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **日期处理**: date-fns

## 本地启动

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 http://localhost:6101

### 生产构建与启动

```bash
npm run build
npm run start
```

## 模拟数据生成

项目包含一个 Mock 数据生成脚本，可生成 2020–2030 年的日历数据（农历、干支、节气、节日）：

```bash
npm run generate:mock
```

生成的数据文件位于 `src/mock/calendar-2020-2030.json`。

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (端口 6101) |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 (端口 6101) |
| `npm run lint` | ESLint 代码规范检查 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run ci` | 依次执行 lint → typecheck → build |
| `npm run generate:mock` | 生成模拟日历数据 |

## 持续集成

项目配置了 GitHub Actions CI 流水线 (`.github/workflows/ci.yml`)，在推送或提交 PR 到 `main`/`master` 分支时自动执行：

1. **代码规范检查** (`npm run lint`)
2. **类型检查** (`npm run typecheck`)
3. **项目构建** (`npm run build`)

任何一步失败，流水线将报错退出。同时在 Node.js 18 和 20 两个版本上进行矩阵测试。

## 项目结构

```
src/
├── app/                  # Next.js 页面路由
│   ├── date-compare/     # 日期对比
│   ├── favorites/        # 收藏管理
│   ├── festivals/        # 节日查询
│   ├── lunar-reverse/    # 农历反查
│   └── solar-terms/      # 节气时间线
├── components/           # 通用组件
├── lib/                  # 工具函数与核心逻辑
├── mock/                 # Mock 数据
└── store/                # Zustand 状态管理
scripts/
└── generate-mock-data.mjs  # Mock 数据生成脚本
```

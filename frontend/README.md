# Modbus TCP 控制站 - React 前端

## 技术栈

- Vite 5
- React 18
- React Router 6
- Axios
- Tailwind CSS 3

## 快速开始

```bash
cd frontend
npm install

# 复制环境变量模板
cp .env.example .env

# 启动开发服务器
npm run dev
```

启动后访问：
- 登录页：`http://localhost:5173/login`
- 注册页：`http://localhost:5173/register`
- 受保护页面：`http://localhost:5173/dashboard`

## 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://localhost:3001/api` |

## 目录结构

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js     # Axios 实例与拦截器
│   │   └── auth.js      # 认证相关 API
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 联调说明

1. 先启动后端：`cd backend && npm run dev`
2. 再启动前端：`cd frontend && npm run dev`
3. 前端默认调用 `http://localhost:3001/api`，与后端 CORS 配置一致。

## 后续扩展

- 将 `原型和代码/` 中的 6 个 HTML 页面迁移为 React 组件
- 接入设备连接、实时监控、寄存器读写、历史记录、系统设置等 API
- 增加全局 AuthContext 管理登录状态
- 统一表单校验与错误提示

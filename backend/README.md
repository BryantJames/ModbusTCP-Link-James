# Modbus TCP 控制站 - 后端 API

## 技术栈

- Node.js 18+
- Express 4
- MySQL2
- bcryptjs
- jsonwebtoken
- Zod（参数校验）

## 快速开始

```bash
cd backend
npm install

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 填入实际的数据库信息
# 特别注意：JWT_SECRET 请改成随机长字符串

npm run dev
```

## API 接口

### 健康检查
```bash
GET http://localhost:3001/api/health
```

### 注册
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "username": "james",
  "password": "123456",
  "display_name": "James"
}
```

### 登录
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "username": "james",
  "password": "123456"
}
```

### 获取当前用户信息
```bash
GET http://localhost:3001/api/auth/me
Authorization: Bearer <your-jwt-token>
```

### 登出
```bash
POST http://localhost:3001/api/auth/logout
Authorization: Bearer <your-jwt-token>
```

## 环境变量说明

| 变量 | 说明 | 默认值 |
|---|---|---|
| PORT | 服务端口号 | 3001 |
| JWT_SECRET | JWT 签名密钥 | - |
| JWT_EXPIRES_IN | JWT 有效期 | 24h |
| DB_HOST | MySQL 主机 | localhost |
| DB_PORT | MySQL 端口 | 3306 |
| DB_USER | MySQL 用户名 | root |
| DB_PASSWORD | MySQL 密码 | - |
| DB_NAME | 数据库名 | modbus_tcp_controller |
| CORS_ORIGIN | 允许跨域的前端地址 | http://localhost:5173 |

## 目录结构

```
backend/
├── config/
│   └── db.js            # MySQL 连接池
├── controllers/
│   └── authController.js
├── middleware/
│   ├── auth.js          # JWT 校验
│   └── validate.js      # 参数校验
├── routes/
│   └── auth.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

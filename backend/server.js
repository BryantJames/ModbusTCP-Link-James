import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Modbus TCP 后端服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 路由
app.use('/api/auth', authRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动，监听端口: ${PORT}`);
  console.log(`📍 API 地址: http://localhost:${PORT}/api`);
});

export default app;

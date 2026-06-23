import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'modbus_tcp_controller',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// 测试连接
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL 数据库连接成功');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL 数据库连接失败:', err.message);
  });

// 包装 execute，遇到连接重置时自动重试一次
async function executeWithRetry(sql, params, retries = 1) {
  try {
    return await pool.execute(sql, params);
  } catch (err) {
    const retryable = ['ECONNRESET', 'PROTOCOL_CONNECTION_LOST', 'ECONNREFUSED'];
    if (retries > 0 && retryable.includes(err.code)) {
      console.warn(`[DB] 连接异常 (${err.code})，正在重试...`);
      return executeWithRetry(sql, params, retries - 1);
    }
    throw err;
  }
}

export { executeWithRetry };
export default pool;

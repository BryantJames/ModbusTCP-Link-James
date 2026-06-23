import { executeWithRetry } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 注册
export const register = async (req, res) => {
  const { username, password, display_name } = req.body;

  try {
    // 检查用户名是否已存在
    const [existingUsers] = await executeWithRetry(
      'SELECT id FROM sys_user WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);

    // 插入新用户
    const [result] = await executeWithRetry(
      `INSERT INTO sys_user (username, password_hash, display_name, role, auth_level, status, created_at, updated_at)
       VALUES (?, ?, ?, 'operator', 1, 1, NOW(), NOW())`,
      [username, passwordHash, display_name || username]
    );

    // 生成 JWT
    const token = jwt.sign(
      { userId: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: result.insertId,
        username,
        display_name: display_name || username,
        avatar_url: null,
        token
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 登录
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查询用户
    const [users] = await executeWithRetry(
      'SELECT id, username, password_hash, display_name, role, auth_level, status FROM sys_user WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 检查用户状态
    if (user.status !== 1) {
      return res.status(403).json({
        success: false,
        message: '账号已被禁用'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        role: user.role,
        auth_level: user.auth_level,
        token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 获取当前用户信息
export const getMe = async (req, res) => {
  try {
    const [users] = await executeWithRetry(
      'SELECT id, username, display_name, avatar_url, role, auth_level, status, last_login_time, created_at FROM sys_user WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 登出（前端清除 token 即可，这里用于记录日志）
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: '登出成功'
  });
};

// 更新用户头像（Base64 图片）
export const updateAvatar = async (req, res) => {
  const { avatar_url } = req.body;

  if (!avatar_url || typeof avatar_url !== 'string') {
    return res.status(400).json({
      success: false,
      message: '请提供头像数据'
    });
  }

  // 简单校验 Base64 图片格式
  if (!avatar_url.startsWith('data:image/')) {
    return res.status(400).json({
      success: false,
      message: '头像格式不正确，请上传图片文件'
    });
  }

  // 限制大小约 2MB
  if (avatar_url.length > 2.8 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: '头像文件过大，请压缩后上传'
    });
  }

  try {
    await executeWithRetry(
      'UPDATE sys_user SET avatar_url = ? WHERE id = ?',
      [avatar_url, req.user.userId]
    );

    res.json({
      success: true,
      message: '头像更新成功',
      data: { avatar_url }
    });
  } catch (error) {
    console.error('更新头像失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

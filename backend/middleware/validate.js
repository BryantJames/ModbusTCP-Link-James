import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, '用户名至少 3 个字符').max(50, '用户名最多 50 个字符'),
  password: z.string().min(6, '密码至少 6 个字符').max(100, '密码最多 100 个字符'),
  display_name: z.string().max(100, '显示名称最多 100 个字符').optional()
});

const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
});

export const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: '参数校验失败',
      errors: result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: '参数校验失败',
      errors: result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }
  next();
};

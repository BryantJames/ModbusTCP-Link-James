# Modbus TCP 控制站 - MySQL 数据库设计说明

## 脚本文件清单

| 文件 | 说明 |
|---|---|
| `01_schema.sql` | 创建数据库、表结构、分区、外键、索引 |
| `02_init_data.sql` | 初始化默认用户、设备、寄存器、设置、样例数据 |

## 使用方式

```bash
# 方式 1：命令行登录后执行
mysql -u root -p < 01_schema.sql
mysql -u root -p < 02_init_data.sql

# 方式 2：在 MySQL 客户端内执行
source /path/to/01_schema.sql;
source /path/to/02_init_data.sql;
```

## 表结构总览

| 表名 | 中文名 | 来源页面 | 用途 |
|---|---|---|---|
| `sys_user` | 用户表 | login.html | 操作员登录、权限管理 |
| `mb_device` | Modbus 设备表 | deviceLink.html / setting.html | TCP 连接参数、设备信息 |
| `mb_register` | 寄存器定义表 | registers.html / Monitor.html | 寄存器地址、类型、单位、报警阈值 |
| `mb_register_history` | 寄存器历史数据表 | history.html / Monitor.html | 每次轮询的寄存器数值，按时间分区 |
| `sys_setting` | 系统设置表 | setting.html | 通信/UI/存储/系统信息配置 |
| `sys_operation_log` | 系统操作日志表 | 所有页面 | 事件日志、通信帧、用户操作 |
| `sys_alarm` | 报警记录表 | 报警中心 / Monitor.html | 越限报警、通讯故障 |

## 设计要点

1. **历史数据分区**
   - `mb_register_history` 采用 RANGE 分区，按 `sampled_at` 的年月分区。
   - 高频率采样会产生海量数据，建议配合归档/清理策略使用。

2. **默认值说明**
   - 默认设备 IP：`192.168.1.104`，端口：`502`，从站 ID：`1`
   - 默认扫描频率：`250ms`
   - 默认管理员账号：`admin` / `admin123`
   - 默认操作员账号：`operator` / `operator123`

3. **安全提示**
   - 初始化脚本中的密码哈希为占位符，生产环境请重新生成真实 bcrypt/argon2 哈希。
   - 建议为数据库连接账号授予最小权限（SELECT/INSERT/UPDATE/DELETE）。

## 常用查询

### 查询实时监控数据
```sql
SELECT r.register_label, r.unit, h.decimal_value, h.sampled_at
FROM mb_register r
LEFT JOIN (
    SELECT register_id, MAX(sampled_at) AS max_at
    FROM mb_register_history
    GROUP BY register_id
) latest ON r.id = latest.register_id
LEFT JOIN mb_register_history h ON h.register_id = latest.register_id AND h.sampled_at = latest.max_at
WHERE r.is_monitored = 1 AND r.device_id = 1
ORDER BY r.display_order;
```

### 按时间范围查询寄存器历史
```sql
SELECT * FROM mb_register_history
WHERE device_id = 1 AND register_id = 1
  AND sampled_at BETWEEN '2026-06-23 14:00:00' AND '2026-06-23 15:00:00'
ORDER BY sampled_at DESC;
```

### 查询未处理报警
```sql
SELECT a.*, r.register_name, r.unit
FROM sys_alarm a
LEFT JOIN mb_register r ON a.register_id = r.id
WHERE a.status = 0
ORDER BY a.created_at DESC;
```

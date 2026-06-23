-- ========================================================
-- Modbus TCP 控制站 - 初始化数据脚本
-- 数据库名: modbus_tcp_controller
-- 说明: 基于前端原型页面生成默认数据
-- ========================================================

USE `modbus_tcp_controller`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. 初始化用户数据
-- 默认管理员: admin / admin123
-- 默认操作员: operator / operator123
-- 注意: 生产环境请替换为真实 bcrypt 哈希
-- --------------------------------------------------------
TRUNCATE TABLE `sys_user`;
INSERT INTO `sys_user` (`username`, `password_hash`, `display_name`, `role`, `auth_level`, `status`) VALUES
('admin',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIJj9AhDLEmTg0ZJfKvCfZPzT8Xq2PjG', '系统管理员', 'admin', 4, 1),
('operator', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIJj9AhDLEmTg0ZJfKvCfZPzT8Xq2PjG', '01号工程师', 'operator', 2, 1);

-- --------------------------------------------------------
-- 2. 初始化默认 Modbus 设备
-- 来源: setting.html / deviceLink.html
-- --------------------------------------------------------
TRUNCATE TABLE `mb_device`;
INSERT INTO `mb_device` (
    `device_name`, `device_serial`, `mac_address`, `firmware_version`, `hardware_revision`,
    `host`, `port`, `unit_id`, `timeout_ms`, `scan_rate_ms`, `auto_reconnect`, `log_binary_frame`,
    `status`, `is_default`
) VALUES (
    '产线 PLC #1', 'MB-7749-X21', '00:1A:2B:3C:4D:5E', 'v2.4.0.STABLE', 'PCB_REV_C',
    '192.168.1.104', 502, 1, 1000, 250, 1, 0,
    1, 1
);

-- --------------------------------------------------------
-- 3. 初始化寄存器定义
-- 来源: Monitor.html 实时监控卡片 / registers.html 寄存器表
-- 功能码 03 = 保持寄存器 (Holding Register)
-- --------------------------------------------------------
TRUNCATE TABLE `mb_register`;
INSERT INTO `mb_register` (
    `device_id`, `register_address`, `function_code`, `register_type`, `data_format`,
    `register_name`, `register_label`, `unit`, `scale_factor`, `offset_value`,
    `display_order`, `alarm_upper_limit`, `alarm_lower_limit`, `is_monitored`, `status`
) VALUES
(1, 41, '03', 'UINT16', 'decimal', '温度 A',     'HR_0041 // 温度 A',   '°C',  0.1,   0, 1,  80.0, -20.0, 1, 1),
(1, 42, '03', 'UINT16', 'decimal', '系统压力',   'HR_0042 // 系统压力', 'BAR', 0.1,   0, 2,  200.0, 0.0,   1, 1),
(1, 43, '03', 'UINT16', 'decimal', '流量',       'HR_0043 // 流量',     'M3/H', 0.01, 0, 3,  100.0, 0.0,   1, 1),
(1, 44, '03', 'UINT16', 'decimal', '湿度',       'HR_0044 // 湿度',     '%',   0.1,   0, 4,  90.0,  10.0,  1, 1),
(1, 45, '03', 'UINT16', 'decimal', '功率负载',   'HR_0045 // 功率负载', 'KW',  0.1,   0, 5,  10.0,  0.0,   1, 1),
(1, 46, '03', 'UINT16', 'decimal', '输出频率',   'HR_0046 // 输出频率', 'HZ',  0.1,   0, 6,  60.0,  40.0,  1, 1),
(1, 1,  '03', 'UINT16', 'decimal', '保持寄存器1', '0x0001',              '',    1,     0, 7,  NULL,  NULL,  0, 1),
(1, 2,  '03', 'FLOAT32','decimal', '保持寄存器2', '0x0002',              '',    1,     0, 8,  NULL,  NULL,  0, 1),
(1, 3,  '03', 'UINT16', 'decimal', '保持寄存器3', '0x0003',              '',    1,     0, 9,  NULL,  NULL,  0, 1),
(1, 5,  '03', 'INT16',  'decimal', '保持寄存器5', '0x0005',              '',    1,     0, 10, NULL,  NULL,  0, 1);

-- --------------------------------------------------------
-- 4. 初始化系统设置
-- 来源: setting.html
-- --------------------------------------------------------
TRUNCATE TABLE `sys_setting`;
INSERT INTO `sys_setting` (`config_key`, `config_value`, `config_group`, `description`) VALUES
-- 通信配置
('communication.host',         '192.168.1.104', 'communication', 'TCP 主机地址'),
('communication.port',         '502',           'communication', 'Modbus TCP 端口号'),
('communication.unit_id',      '1',             'communication', '从站 ID'),
('communication.timeout_ms',   '1000',          'communication', '响应超时毫秒'),
('communication.scan_rate_ms', '250',           'communication', '扫描频率毫秒'),
('communication.auto_reconnect','1',            'communication', '自动重连开关'),

-- 界面视觉
('ui_theme.high_contrast',     '1',             'ui_theme',      '高对比度模式'),
('ui_theme.data_animation',    '0',             'ui_theme',      '启用数据动画'),
('ui_theme.ui_scale',          'DEFAULT',       'ui_theme',      '界面缩放：COMPACT/DEFAULT/COMFORT'),

-- 数据存储
('data_storage.log_retention_days', '7',        'data_storage',  '日志保留天数：7/30/90'),
('data_storage.storage_total_gb',   '100',      'data_storage',  '存储总容量 GB'),
('data_storage.storage_used_gb',    '68.4',     'data_storage',  '已用存储 GB'),

-- 系统信息
('system_info.device_serial',     'MB-7749-X21', 'system_info',   '设备序列号'),
('system_info.mac_address',       '00:1A:2B:3C:4D:5E', 'system_info', 'MAC 地址'),
('system_info.firmware_version',  'v2.4.0.STABLE', 'system_info', '固件版本'),
('system_info.hardware_revision', 'PCB_REV_C',   'system_info',   '硬件版本');

-- --------------------------------------------------------
-- 5. 初始化历史数据样例
-- 来源: history.html
-- --------------------------------------------------------
TRUNCATE TABLE `mb_register_history`;
INSERT INTO `mb_register_history` (
    `device_id`, `register_id`, `register_address`, `raw_value`, `decimal_value`, `binary_value`, `status`, `sampled_at`
) VALUES
(1, 1, 41, '0x4207',  74.2,  '0111 0100 0010', 'VALID', '2026-06-23 14:30:05.500'),
(1, 2, 42, '0x2A1C',  120.4, '0010 1010 0001', 'VALID', '2026-06-23 14:30:05.500'),
(1, 3, 43, '0x03E9',  8.42,  '0000 0011 1110', 'WARN',  '2026-06-23 14:30:05.498'),
(1, 1, 41, '0x4208',  74.3,  '0111 0100 0011', 'VALID', '2026-06-23 14:30:05.000'),
(1, 2, 42, '0x2A1B',  120.3, '0010 1010 0001', 'VALID', '2026-06-23 14:30:05.000'),
(1, 1, 41, '0x4206',  74.1,  '0111 0100 0010', 'VALID', '2026-06-23 14:30:04.500');

-- --------------------------------------------------------
-- 6. 初始化报警记录样例
-- 来源: Monitor.html 的温度越限提示 / 报警中心
-- --------------------------------------------------------
TRUNCATE TABLE `sys_alarm`;
INSERT INTO `sys_alarm` (
    `device_id`, `register_id`, `alarm_type`, `alarm_content`, `alarm_value`, `limit_value`, `status`
) VALUES
(1, 1, 'UPPER_LIMIT', '温度 A 超过软限制 (74.0°C)', 74.2, 74.0, 0),
(1, 3, 'UPPER_LIMIT', '流量波动异常', 8.42, 8.00, 1),
(1, NULL, 'COMM_ERROR', 'TCP 连接超时，从站无响应', NULL, NULL, 2);

-- --------------------------------------------------------
-- 7. 初始化系统日志样例
-- 来源: 各页面终端日志 / 系统事件
-- --------------------------------------------------------
TRUNCATE TABLE `sys_operation_log`;
INSERT INTO `sys_operation_log` (`log_level`, `source`, `message`, `raw_data`, `operator_id`, `operator_name`, `device_id`, `created_at`) VALUES
('INFO',  'SYSTEM',   'SYSTEM_INIT: LOADED CONFIG_V2.JSON', NULL, 1, 'admin', 1, '2026-06-23 14:22:15.000'),
('INFO',  'MODBUS',   'TCP_STACK: LISTENING ON PORT 502...', NULL, NULL, NULL, 1, '2026-06-23 14:22:16.000'),
('INFO',  'SECURITY', 'ADMIN_SESSION_KEY VALIDATED', NULL, 1, 'admin', NULL, '2026-06-23 14:22:18.000'),
('INFO',  'MODBUS',   'MONITOR: POLLING SLAVE_01 @ 250MS INTERVAL', NULL, NULL, NULL, 1, '2026-06-23 14:23:45.000'),
('WARN',  'MODBUS',   '温度 A 超过软限制 (74.0°C)', 'TX: [01 03 00 00 00 0A C5 CD]', 2, 'operator', 1, '2026-06-23 14:30:05.500');

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 常用查询示例
-- --------------------------------------------------------
-- 查询实时监控数据
-- SELECT r.register_label, r.unit, h.decimal_value, h.sampled_at
-- FROM mb_register r
-- LEFT JOIN (
--     SELECT register_id, MAX(sampled_at) AS max_at
--     FROM mb_register_history
--     GROUP BY register_id
-- ) latest ON r.id = latest.register_id
-- LEFT JOIN mb_register_history h ON h.register_id = latest.register_id AND h.sampled_at = latest.max_at
-- WHERE r.is_monitored = 1 AND r.device_id = 1
-- ORDER BY r.display_order;

-- 按时间范围查询寄存器历史
-- SELECT * FROM mb_register_history
-- WHERE device_id = 1 AND register_id = 1
--   AND sampled_at BETWEEN '2026-06-23 14:00:00' AND '2026-06-23 15:00:00'
-- ORDER BY sampled_at DESC;

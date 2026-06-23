-- H2 内存数据库初始化数据（用于本地快速验证）

INSERT INTO sys_user (username, password_hash, display_name, role, auth_level, status) VALUES
('admin',    '$2a$10$KJ9inT1JvJ6P8gcf7ekHzO8bKzBqfXMU9h2UQeL6cwIZrjS7qJGTW', '系统管理员', 'admin', 4, 1),
('operator', '$2a$10$9jc4pKl3F2eX9dlCBKKVcu7xYhtTCKUUpR9Ox.l4IJkgiuVOc11F2', '01号工程师', 'operator', 2, 1);

INSERT INTO mb_device (
    device_name, device_serial, mac_address, firmware_version, hardware_revision,
    host, port, unit_id, timeout_ms, scan_rate_ms, auto_reconnect, log_binary_frame,
    status, is_default
) VALUES (
    '产线 PLC #1', 'MB-7749-X21', '00:1A:2B:3C:4D:5E', 'v2.4.0.STABLE', 'PCB_REV_C',
    '192.168.1.104', 502, 1, 1000, 250, 1, 0,
    1, 1
);

INSERT INTO mb_register (
    device_id, register_address, function_code, register_type, data_format,
    register_name, register_label, unit, scale_factor, offset_value,
    display_order, alarm_upper_limit, alarm_lower_limit, is_monitored, status
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

INSERT INTO sys_setting (config_key, config_value, config_group, description) VALUES
('communication.host',          '192.168.1.104', 'communication', 'TCP 主机地址'),
('communication.port',          '502',           'communication', 'Modbus TCP 端口号'),
('communication.unit_id',       '1',             'communication', '从站 ID'),
('communication.timeout_ms',    '1000',          'communication', '响应超时毫秒'),
('communication.scan_rate_ms',  '250',           'communication', '扫描频率毫秒'),
('communication.auto_reconnect','1',             'communication', '自动重连开关'),
('ui_theme.high_contrast',      '1',             'ui_theme',      '高对比度模式'),
('ui_theme.data_animation',     '0',             'ui_theme',      '启用数据动画'),
('ui_theme.ui_scale',           'DEFAULT',       'ui_theme',      '界面缩放'),
('data_storage.log_retention_days', '7',         'data_storage',  '日志保留天数'),
('data_storage.storage_total_gb',   '100',       'data_storage',  '存储总容量 GB');

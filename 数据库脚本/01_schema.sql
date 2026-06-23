-- ========================================================
-- Modbus TCP 控制站 - MySQL 数据库设计脚本
-- 数据库名: modbus_tcp_controller
-- 适用: MySQL 8.0+
-- 创建日期: 2026-06-23
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS `modbus_tcp_controller`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `modbus_tcp_controller`;

-- ========================================================
-- 2. 用户表 (sys_user)
-- 来源页面: login.html
-- 用途: 操作员登录、权限管理
-- ========================================================
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT COMMENT '用户主键 ID',
    `username`        VARCHAR(50)  NOT NULL COMMENT '操作员身份/登录账号',
    `password_hash`   VARCHAR(255) NOT NULL COMMENT '授权密钥哈希 (bcrypt/argon2)',
    `display_name`    VARCHAR(100) DEFAULT NULL COMMENT '显示名称，如：管理员 Alpha',
    `role`            VARCHAR(20)  NOT NULL DEFAULT 'operator' COMMENT '角色：admin-管理员, operator-操作员',
    `auth_level`      TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '权限等级 1-4',
    `status`          TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态：0-禁用, 1-启用',
    `last_login_time` DATETIME     DEFAULT NULL COMMENT '最后登录时间',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统用户表';

-- ========================================================
-- 3. Modbus 设备连接表 (mb_device)
-- 来源页面: deviceLink.html / setting.html
-- 用途: 管理 Modbus TCP 从站设备连接参数
-- ========================================================
DROP TABLE IF EXISTS `mb_device`;
CREATE TABLE `mb_device` (
    `id`                BIGINT UNSIGNED AUTO_INCREMENT COMMENT '设备主键 ID',
    `device_name`       VARCHAR(100) NOT NULL DEFAULT '' COMMENT '设备名称',
    `device_serial`     VARCHAR(100) DEFAULT NULL COMMENT '设备序列号，如：MB-7749-X21',
    `mac_address`       VARCHAR(17)  DEFAULT NULL COMMENT 'MAC 地址，如：00:1A:2B:3C:4D:5E',
    `firmware_version`  VARCHAR(50)  DEFAULT NULL COMMENT '固件版本，如：v2.4.0.STABLE',
    `hardware_revision` VARCHAR(50)  DEFAULT NULL COMMENT '硬件版本，如：PCB_REV_C',
    `host`              VARCHAR(255) NOT NULL DEFAULT '192.168.1.100' COMMENT 'TCP 主机地址/IP',
    `port`              INT UNSIGNED NOT NULL DEFAULT 502 COMMENT 'Modbus TCP 端口号',
    `unit_id`           TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '从站 ID / 单元 ID',
    `timeout_ms`        INT UNSIGNED NOT NULL DEFAULT 1000 COMMENT '响应超时，单位毫秒',
    `scan_rate_ms`      INT UNSIGNED NOT NULL DEFAULT 250 COMMENT '扫描频率/轮询间隔，单位毫秒',
    `auto_reconnect`    TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '自动重连：0-关闭, 1-开启',
    `log_binary_frame`  TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '记录二进制帧：0-关闭, 1-开启',
    `status`            TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '连接状态：0-离线, 1-在线, 2-连接中',
    `is_default`        TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否为默认设备：0-否, 1-是',
    `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_device_serial` (`device_serial`),
    KEY `idx_status` (`status`),
    KEY `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Modbus 设备连接表';

-- ========================================================
-- 4. 寄存器定义表 (mb_register)
-- 来源页面: registers.html / Monitor.html / history.html
-- 用途: 定义每个寄存器的地址、类型、量程、名称、单位、报警阈值
-- ========================================================
DROP TABLE IF EXISTS `mb_register`;
CREATE TABLE `mb_register` (
    `id`                  BIGINT UNSIGNED AUTO_INCREMENT COMMENT '寄存器主键 ID',
    `device_id`           BIGINT UNSIGNED NOT NULL COMMENT '所属设备 ID',
    `register_address`    INT UNSIGNED NOT NULL COMMENT '寄存器地址，如 0x0001 或 40041',
    `function_code`       VARCHAR(10)  NOT NULL DEFAULT '03' COMMENT '功能码：01-线圈, 02-离散输入, 03-保持寄存器, 04-输入寄存器',
    `register_type`       VARCHAR(20)  NOT NULL DEFAULT 'UINT16' COMMENT '数据类型：UINT16/INT16/UINT32/INT32/FLOAT32/FLOAT64/BIT',
    `data_format`         VARCHAR(20)  NOT NULL DEFAULT 'decimal' COMMENT '显示格式：raw/decimal/hex/binary',
    `register_name`       VARCHAR(100) NOT NULL DEFAULT '' COMMENT '寄存器名称，如：温度 A',
    `register_label`      VARCHAR(100) DEFAULT NULL COMMENT '前端展示标签，如：HR_0041 // 温度 A',
    `unit`                VARCHAR(20)  DEFAULT NULL COMMENT '物理单位：°C/BAR/M3/H/%/KW/HZ',
    `scale_factor`        DECIMAL(18,8) NOT NULL DEFAULT 1.00000000 COMMENT '缩放系数，原始值 * scale_factor + offset_value',
    `offset_value`        DECIMAL(18,8) NOT NULL DEFAULT 0.00000000 COMMENT '偏移量',
    `display_order`       INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '监控面板显示顺序',
    `alarm_upper_limit`   DECIMAL(18,4) DEFAULT NULL COMMENT '报警上限',
    `alarm_lower_limit`   DECIMAL(18,4) DEFAULT NULL COMMENT '报警下限',
    `is_monitored`        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '是否纳入实时监控：0-否, 1-是',
    `status`              TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态：0-禁用, 1-启用',
    `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_device_register` (`device_id`, `register_address`, `function_code`),
    KEY `idx_device_id` (`device_id`),
    KEY `idx_monitored` (`device_id`, `is_monitored`, `display_order`),
    CONSTRAINT `fk_register_device` FOREIGN KEY (`device_id`) REFERENCES `mb_device` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='寄存器定义表';

-- ========================================================
-- 5. 寄存器历史数据表 (mb_register_history)
-- 来源页面: history.html / Monitor.html
-- 用途: 保存每次轮询读取到的寄存器数值，支持时间范围查询与趋势分析
-- 注意:
-- 1. 该表数据量极大，建议按时间进行分区或归档
-- 2. 部分 MySQL 版本/云数据库不支持分区表外键，因此本表不设置外键约束，
--    由应用层保证 device_id/register_id 的引用完整性
-- ========================================================
DROP TABLE IF EXISTS `mb_register_history`;
CREATE TABLE `mb_register_history` (
    `id`                BIGINT UNSIGNED AUTO_INCREMENT COMMENT '历史记录主键 ID',
    `device_id`         BIGINT UNSIGNED NOT NULL COMMENT '设备 ID',
    `register_id`       BIGINT UNSIGNED NOT NULL COMMENT '寄存器定义 ID',
    `register_address`  INT UNSIGNED NOT NULL COMMENT '寄存器地址',
    `raw_value`         VARCHAR(100) DEFAULT NULL COMMENT '原始值/十六进制值，如 0x4207',
    `decimal_value`     DECIMAL(18,6) DEFAULT NULL COMMENT '转换后的十进制工程值',
    `binary_value`      VARCHAR(64)  DEFAULT NULL COMMENT '二进制表示',
    `status`            VARCHAR(20)  NOT NULL DEFAULT 'VALID' COMMENT '数据状态：VALID/WARN/ERROR',
    `sampled_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '采样时间，精确到毫秒',
    `created_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`, `sampled_at`),
    KEY `idx_register_sampled` (`device_id`, `register_id`, `sampled_at`),
    KEY `idx_sampled_at` (`sampled_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='寄存器历史数据表'
PARTITION BY RANGE (YEAR(`sampled_at`) * 100 + MONTH(`sampled_at`)) (
    PARTITION p202606 VALUES LESS THAN (202607),
    PARTITION p202607 VALUES LESS THAN (202608),
    PARTITION p202608 VALUES LESS THAN (202609),
    PARTITION p202609 VALUES LESS THAN (202610),
    PARTITION p202610 VALUES LESS THAN (202611),
    PARTITION p202611 VALUES LESS THAN (202612),
    PARTITION p202612 VALUES LESS THAN (202701),
    PARTITION pfuture   VALUES LESS THAN MAXVALUE
);

-- ========================================================
-- 6. 系统设置表 (sys_setting)
-- 来源页面: setting.html
-- 用途: 存储通信、UI、数据存储、系统信息等可配置项
-- ========================================================
DROP TABLE IF EXISTS `sys_setting`;
CREATE TABLE `sys_setting` (
    `id`            BIGINT UNSIGNED AUTO_INCREMENT COMMENT '设置主键 ID',
    `config_key`    VARCHAR(100) NOT NULL COMMENT '配置键，如：communication.host',
    `config_value`  TEXT         DEFAULT NULL COMMENT '配置值',
    `config_group`  VARCHAR(50)  NOT NULL DEFAULT 'system' COMMENT '配置分组：communication/ui_theme/data_storage/system_info',
    `description`   VARCHAR(255) DEFAULT NULL COMMENT '配置说明',
    `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_config_key` (`config_key`),
    KEY `idx_config_group` (`config_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- ========================================================
-- 7. 系统操作日志/事件日志表 (sys_operation_log)
-- 来源页面: 所有页面的终端日志、系统事件
-- 用途: 记录系统事件、Modbus 通信帧、用户操作、安全事件
-- ========================================================
DROP TABLE IF EXISTS `sys_operation_log`;
CREATE TABLE `sys_operation_log` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT COMMENT '日志主键 ID',
    `log_level`       VARCHAR(20)  NOT NULL DEFAULT 'INFO' COMMENT '日志级别：INFO/WARN/ERROR/DEBUG',
    `source`          VARCHAR(50)  NOT NULL DEFAULT 'SYSTEM' COMMENT '来源：SYSTEM/MODBUS/USER/SECURITY',
    `message`         TEXT         NOT NULL COMMENT '日志内容',
    `raw_data`        TEXT         DEFAULT NULL COMMENT '原始数据，如十六进制帧',
    `operator_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT '操作用户 ID（可选）',
    `operator_name`   VARCHAR(100) DEFAULT NULL COMMENT '操作用户名',
    `device_id`       BIGINT UNSIGNED DEFAULT NULL COMMENT '关联设备 ID',
    `created_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '日志时间，精确到毫秒',
    PRIMARY KEY (`id`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_level_source` (`log_level`, `source`),
    KEY `idx_operator` (`operator_id`),
    CONSTRAINT `fk_log_operator` FOREIGN KEY (`operator_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_log_device` FOREIGN KEY (`device_id`) REFERENCES `mb_device` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统操作日志表';

-- ========================================================
-- 8. 报警记录表 (sys_alarm)
-- 来源页面: 报警中心（导航栏）/ Monitor.html 的温度越限提示
-- 用途: 记录寄存器越限、通讯故障等报警事件
-- ========================================================
DROP TABLE IF EXISTS `sys_alarm`;
CREATE TABLE `sys_alarm` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT COMMENT '报警主键 ID',
    `device_id`       BIGINT UNSIGNED NOT NULL COMMENT '设备 ID',
    `register_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT '关联寄存器 ID',
    `alarm_type`      VARCHAR(50)  NOT NULL COMMENT '报警类型：UPPER_LIMIT/LOWER_LIMIT/COMM_ERROR/DEVICE_OFFLINE',
    `alarm_content`   TEXT         NOT NULL COMMENT '报警内容描述',
    `alarm_value`     DECIMAL(18,6) DEFAULT NULL COMMENT '触发报警时的数值',
    `limit_value`     DECIMAL(18,4) DEFAULT NULL COMMENT '报警阈值',
    `status`          TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '状态：0-未处理, 1-已确认, 2-已恢复',
    `confirmed_by`    BIGINT UNSIGNED DEFAULT NULL COMMENT '确认人用户 ID',
    `confirmed_at`    DATETIME     DEFAULT NULL COMMENT '确认时间',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_status_created` (`status`, `created_at`),
    KEY `idx_device_register` (`device_id`, `register_id`),
    CONSTRAINT `fk_alarm_device` FOREIGN KEY (`device_id`) REFERENCES `mb_device` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_alarm_register` FOREIGN KEY (`register_id`) REFERENCES `mb_register` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_alarm_confirmer` FOREIGN KEY (`confirmed_by`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报警记录表';

SET FOREIGN_KEY_CHECKS = 1;

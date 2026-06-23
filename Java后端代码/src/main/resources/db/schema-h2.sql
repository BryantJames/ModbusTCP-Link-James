-- H2 内存数据库初始化脚本（用于本地快速验证）
-- 生产环境请使用 MySQL 8.0+

CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url LONGTEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'operator',
    auth_level TINYINT NOT NULL DEFAULT 1,
    status TINYINT NOT NULL DEFAULT 1,
    last_login_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mb_device (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL DEFAULT '',
    device_serial VARCHAR(100) UNIQUE,
    mac_address VARCHAR(17),
    firmware_version VARCHAR(50),
    hardware_revision VARCHAR(50),
    host VARCHAR(255) NOT NULL DEFAULT '192.168.1.100',
    port INT NOT NULL DEFAULT 502,
    unit_id TINYINT NOT NULL DEFAULT 1,
    timeout_ms INT NOT NULL DEFAULT 1000,
    scan_rate_ms INT NOT NULL DEFAULT 250,
    auto_reconnect TINYINT NOT NULL DEFAULT 1,
    log_binary_frame TINYINT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0,
    is_default TINYINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mb_register (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id BIGINT NOT NULL,
    register_address INT NOT NULL,
    function_code VARCHAR(10) NOT NULL DEFAULT '03',
    register_type VARCHAR(20) NOT NULL DEFAULT 'UINT16',
    data_format VARCHAR(20) NOT NULL DEFAULT 'decimal',
    register_name VARCHAR(100) NOT NULL DEFAULT '',
    register_label VARCHAR(100),
    unit VARCHAR(20),
    scale_factor DECIMAL(18,8) NOT NULL DEFAULT 1.00000000,
    offset_value DECIMAL(18,8) NOT NULL DEFAULT 0.00000000,
    display_order INT NOT NULL DEFAULT 0,
    alarm_upper_limit DECIMAL(18,4),
    alarm_lower_limit DECIMAL(18,4),
    is_monitored TINYINT NOT NULL DEFAULT 1,
    status TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mb_register_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id BIGINT NOT NULL,
    register_id BIGINT NOT NULL,
    register_address INT NOT NULL,
    raw_value VARCHAR(100),
    decimal_value DECIMAL(18,6),
    binary_value VARCHAR(64),
    status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    sampled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_setting (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    config_group VARCHAR(50) NOT NULL DEFAULT 'system',
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_operation_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    log_level VARCHAR(20) NOT NULL DEFAULT 'INFO',
    source VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    message TEXT NOT NULL,
    raw_data TEXT,
    operator_id BIGINT,
    operator_name VARCHAR(100),
    device_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_alarm (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id BIGINT NOT NULL,
    register_id BIGINT,
    alarm_type VARCHAR(50) NOT NULL,
    alarm_content TEXT NOT NULL,
    alarm_value DECIMAL(18,6),
    limit_value DECIMAL(18,4),
    status TINYINT NOT NULL DEFAULT 0,
    confirmed_by BIGINT,
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

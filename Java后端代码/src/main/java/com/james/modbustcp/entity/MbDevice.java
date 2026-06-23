package com.james.modbustcp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Modbus 设备连接表
 */
@Data
@TableName("mb_device")
public class MbDevice {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("device_name")
    private String deviceName;

    @TableField("device_serial")
    private String deviceSerial;

    @TableField("mac_address")
    private String macAddress;

    @TableField("firmware_version")
    private String firmwareVersion;

    @TableField("hardware_revision")
    private String hardwareRevision;

    private String host;

    private Integer port;

    @TableField("unit_id")
    private Integer unitId;

    @TableField("timeout_ms")
    private Integer timeoutMs;

    @TableField("scan_rate_ms")
    private Integer scanRateMs;

    @TableField("auto_reconnect")
    private Integer autoReconnect;

    @TableField("log_binary_frame")
    private Integer logBinaryFrame;

    private Integer status;

    @TableField("is_default")
    private Integer isDefault;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

}

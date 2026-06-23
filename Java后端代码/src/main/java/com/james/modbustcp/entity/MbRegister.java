package com.james.modbustcp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 寄存器定义表
 */
@Data
@TableName("mb_register")
public class MbRegister {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("device_id")
    private Long deviceId;

    @TableField("register_address")
    private Integer registerAddress;

    @TableField("function_code")
    private String functionCode;

    @TableField("register_type")
    private String registerType;

    @TableField("data_format")
    private String dataFormat;

    @TableField("register_name")
    private String registerName;

    @TableField("register_label")
    private String registerLabel;

    private String unit;

    @TableField("scale_factor")
    private BigDecimal scaleFactor;

    @TableField("offset_value")
    private BigDecimal offsetValue;

    @TableField("display_order")
    private Integer displayOrder;

    @TableField("alarm_upper_limit")
    private BigDecimal alarmUpperLimit;

    @TableField("alarm_lower_limit")
    private BigDecimal alarmLowerLimit;

    @TableField("is_monitored")
    private Integer isMonitored;

    private Integer status;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

}

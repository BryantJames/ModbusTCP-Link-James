package com.james.modbustcp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 寄存器历史数据表
 */
@Data
@TableName("mb_register_history")
public class MbRegisterHistory {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("device_id")
    private Long deviceId;

    @TableField("register_id")
    private Long registerId;

    @TableField("register_address")
    private Integer registerAddress;

    @TableField("raw_value")
    private String rawValue;

    @TableField("decimal_value")
    private BigDecimal decimalValue;

    @TableField("binary_value")
    private String binaryValue;

    private String status;

    @TableField("sampled_at")
    private LocalDateTime sampledAt;

    @TableField("created_at")
    private LocalDateTime createdAt;

}

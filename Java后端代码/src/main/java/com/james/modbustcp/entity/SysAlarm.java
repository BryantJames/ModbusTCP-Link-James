package com.james.modbustcp.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 报警记录表
 */
@Data
@TableName("sys_alarm")
public class SysAlarm {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("device_id")
    private Long deviceId;

    @TableField("register_id")
    private Long registerId;

    @TableField("alarm_type")
    private String alarmType;

    @TableField("alarm_content")
    private String alarmContent;

    @TableField("alarm_value")
    private BigDecimal alarmValue;

    @TableField("limit_value")
    private BigDecimal limitValue;

    private Integer status;

    @TableField("confirmed_by")
    private Long confirmedBy;

    @TableField("confirmed_at")
    private LocalDateTime confirmedAt;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

}

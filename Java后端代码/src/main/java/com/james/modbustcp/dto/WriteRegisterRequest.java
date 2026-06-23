package com.james.modbustcp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Modbus 单次写入请求 DTO
 */
@Data
public class WriteRegisterRequest {

    @NotNull(message = "设备 ID 不能为空")
    private Long deviceId;

    @NotNull(message = "寄存器 ID 不能为空")
    private Long registerId;

    @NotNull(message = "写入值不能为空")
    private BigDecimal value;

}

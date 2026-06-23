package com.james.modbustcp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Modbus 单次读取请求 DTO
 */
@Data
public class ReadRegisterRequest {

    @NotNull(message = "设备 ID 不能为空")
    private Long deviceId;

    @NotNull(message = "寄存器 ID 不能为空")
    private Long registerId;

}

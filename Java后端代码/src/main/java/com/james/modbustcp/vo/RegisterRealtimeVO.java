package com.james.modbustcp.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 寄存器实时数据 VO
 */
@Data
public class RegisterRealtimeVO {

    private Long deviceId;
    private Long registerId;
    private Integer registerAddress;
    private String registerName;
    private String registerLabel;
    private String unit;
    private String registerType;
    private String rawValue;
    private BigDecimal decimalValue;
    private String binaryValue;
    private String status;
    private LocalDateTime sampledAt;

}

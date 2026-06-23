package com.james.modbustcp.service;

import com.james.modbustcp.entity.MbDevice;
import com.james.modbustcp.entity.MbRegister;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Modbus TCP 读写服务
 */
public interface IModbusService {

    /**
     * 读取单个寄存器
     *
     * @param device   设备
     * @param register 寄存器定义
     * @return 工程值
     */
    BigDecimal readRegister(MbDevice device, MbRegister register);

    /**
     * 写入单个保持寄存器
     *
     * @param device   设备
     * @param register 寄存器定义
     * @param value    工程值
     */
    void writeRegister(MbDevice device, MbRegister register, BigDecimal value);

    /**
     * 批量读取设备下所有监控寄存器
     *
     * @param device 设备
     * @return key: registerId, value: 工程值
     */
    Map<Long, BigDecimal> pollDeviceRegisters(MbDevice device);

    /**
     * 连接设备
     */
    boolean connect(MbDevice device);

    /**
     * 断开设备
     */
    void disconnect(Long deviceId);

    /**
     * 测试所有启用设备的连接状态
     */
    List<MbDevice> testConnections();

}

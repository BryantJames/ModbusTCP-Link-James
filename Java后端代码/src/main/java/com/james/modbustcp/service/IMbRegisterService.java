package com.james.modbustcp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.james.modbustcp.entity.MbRegister;

import java.util.List;

/**
 * 寄存器定义 Service
 */
public interface IMbRegisterService extends IService<MbRegister> {

    /**
     * 查询设备下所有启用寄存器
     */
    List<MbRegister> getActiveByDeviceId(Long deviceId);

    /**
     * 查询设备下所有监控寄存器
     */
    List<MbRegister> getMonitoredByDeviceId(Long deviceId);

}

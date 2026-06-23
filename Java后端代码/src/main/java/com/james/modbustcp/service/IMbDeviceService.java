package com.james.modbustcp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.james.modbustcp.entity.MbDevice;

/**
 * 设备 Service
 */
public interface IMbDeviceService extends IService<MbDevice> {

    /**
     * 获取默认设备
     */
    MbDevice getDefaultDevice();

}

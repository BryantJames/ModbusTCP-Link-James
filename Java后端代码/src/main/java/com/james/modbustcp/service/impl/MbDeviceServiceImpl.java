package com.james.modbustcp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.james.modbustcp.entity.MbDevice;
import com.james.modbustcp.mapper.MbDeviceMapper;
import com.james.modbustcp.service.IMbDeviceService;
import org.springframework.stereotype.Service;

/**
 * 设备 Service 实现
 */
@Service
public class MbDeviceServiceImpl extends ServiceImpl<MbDeviceMapper, MbDevice> implements IMbDeviceService {

    @Override
    public MbDevice getDefaultDevice() {
        return baseMapper.selectDefaultDevice();
    }

}

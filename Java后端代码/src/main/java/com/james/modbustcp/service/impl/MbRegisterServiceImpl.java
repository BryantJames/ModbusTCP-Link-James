package com.james.modbustcp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.james.modbustcp.entity.MbRegister;
import com.james.modbustcp.mapper.MbRegisterMapper;
import com.james.modbustcp.service.IMbRegisterService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 寄存器定义 Service 实现
 */
@Service
public class MbRegisterServiceImpl extends ServiceImpl<MbRegisterMapper, MbRegister> implements IMbRegisterService {

    @Override
    public List<MbRegister> getActiveByDeviceId(Long deviceId) {
        return baseMapper.selectActiveByDeviceId(deviceId);
    }

    @Override
    public List<MbRegister> getMonitoredByDeviceId(Long deviceId) {
        return baseMapper.selectMonitoredByDeviceId(deviceId);
    }

}

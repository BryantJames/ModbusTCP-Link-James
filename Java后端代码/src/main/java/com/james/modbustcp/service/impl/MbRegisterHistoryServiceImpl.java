package com.james.modbustcp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.james.modbustcp.entity.MbRegisterHistory;
import com.james.modbustcp.mapper.MbRegisterHistoryMapper;
import com.james.modbustcp.service.IMbRegisterHistoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 寄存器历史数据 Service 实现
 */
@Service
public class MbRegisterHistoryServiceImpl extends ServiceImpl<MbRegisterHistoryMapper, MbRegisterHistory>
        implements IMbRegisterHistoryService {

    @Override
    public List<MbRegisterHistory> getHistoryRange(Long deviceId, Long registerId,
                                                 LocalDateTime start, LocalDateTime end) {
        return baseMapper.selectHistoryRange(deviceId, registerId, start, end);
    }

    @Override
    public MbRegisterHistory getLatestByRegisterId(Long registerId) {
        return baseMapper.selectLatestByRegisterId(registerId);
    }

}

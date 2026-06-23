package com.james.modbustcp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.james.modbustcp.entity.MbRegisterHistory;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 寄存器历史数据 Service
 */
public interface IMbRegisterHistoryService extends IService<MbRegisterHistory> {

    /**
     * 查询时间范围内的历史数据
     */
    List<MbRegisterHistory> getHistoryRange(Long deviceId, Long registerId,
                                             LocalDateTime start, LocalDateTime end);

    /**
     * 查询某个寄存器最新一条记录
     */
    MbRegisterHistory getLatestByRegisterId(Long registerId);

}

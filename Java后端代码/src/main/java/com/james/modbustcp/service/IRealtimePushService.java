package com.james.modbustcp.service;

import com.james.modbustcp.entity.MbRegisterHistory;

import java.util.List;

/**
 * 实时数据推送服务
 */
public interface IRealtimePushService {

    /**
     * 广播最新寄存器数据到所有 WebSocket 客户端
     */
    void broadcast(List<MbRegisterHistory> realtimeData);

}

package com.james.modbustcp.service.impl;

import com.james.modbustcp.entity.MbRegisterHistory;
import com.james.modbustcp.service.IRealtimePushService;
import com.james.modbustcp.websocket.RealtimeDataWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 实时数据推送服务实现
 */
@Service
@RequiredArgsConstructor
public class RealtimePushServiceImpl implements IRealtimePushService {

    private final RealtimeDataWebSocketHandler webSocketHandler;

    @Override
    public void broadcast(List<MbRegisterHistory> realtimeData) {
        webSocketHandler.broadcastRealtimeData(realtimeData);
    }

}

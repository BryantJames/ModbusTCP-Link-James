package com.james.modbustcp.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.james.modbustcp.entity.MbRegister;
import com.james.modbustcp.entity.MbRegisterHistory;
import com.james.modbustcp.service.IMbRegisterService;
import com.james.modbustcp.vo.RegisterRealtimeVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 实时数据 WebSocket 处理器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RealtimeDataWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final IMbRegisterService registerService;

    /**
     * 维护所有已连接的 WebSocket Session
     */
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        log.info("WebSocket 客户端连接: {}，当前连接数: {}", session.getId(), sessions.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        log.debug("收到 WebSocket 消息: {}", message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        log.info("WebSocket 客户端断开: {}，当前连接数: {}", session.getId(), sessions.size());
    }

    /**
     * 广播实时数据到所有客户端
     */
    public void broadcastRealtimeData(List<MbRegisterHistory> realtimeData) {
        if (sessions.isEmpty() || realtimeData.isEmpty()) {
            return;
        }

        try {
            List<RegisterRealtimeVO> vos = realtimeData.stream()
                    .map(this::convertToVO)
                    .collect(Collectors.toList());
            String payload = objectMapper.writeValueAsString(vos);
            TextMessage message = new TextMessage(payload);

            sessions.values().forEach(session -> {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(message);
                    } catch (IOException e) {
                        log.warn("WebSocket 发送失败 (sessionId={}): {}", session.getId(), e.getMessage());
                    }
                }
            });
        } catch (IOException e) {
            log.error("序列化实时数据失败", e);
        }
    }

    private RegisterRealtimeVO convertToVO(MbRegisterHistory history) {
        RegisterRealtimeVO vo = new RegisterRealtimeVO();
        vo.setDeviceId(history.getDeviceId());
        vo.setRegisterId(history.getRegisterId());
        vo.setRegisterAddress(history.getRegisterAddress());
        vo.setRawValue(history.getRawValue());
        vo.setDecimalValue(history.getDecimalValue());
        vo.setBinaryValue(history.getBinaryValue());
        vo.setStatus(history.getStatus());
        vo.setSampledAt(history.getSampledAt());

        // 补充寄存器元数据
        MbRegister register = registerService.getById(history.getRegisterId());
        if (register != null) {
            vo.setRegisterName(register.getRegisterName());
            vo.setRegisterLabel(register.getRegisterLabel());
            vo.setUnit(register.getUnit());
            vo.setRegisterType(register.getRegisterType());
        }

        return vo;
    }

}

package com.james.modbustcp.modbus;

import com.james.modbustcp.entity.MbDevice;
import com.james.modbustcp.entity.MbRegister;
import com.james.modbustcp.entity.MbRegisterHistory;
import com.james.modbustcp.service.IMbDeviceService;
import com.james.modbustcp.service.IMbRegisterHistoryService;
import com.james.modbustcp.service.IMbRegisterService;
import com.james.modbustcp.service.IModbusService;
import com.james.modbustcp.service.IRealtimePushService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Modbus 轮询任务
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "modbus.polling", name = "enabled", havingValue = "true", matchIfMissing = true)
public class ModbusPollingTask {

    private final IMbDeviceService deviceService;
    private final IMbRegisterService registerService;
    private final IMbRegisterHistoryService historyService;
    private final IModbusService modbusService;
    private final IRealtimePushService realtimePushService;

    /**
     * 每 1000ms 执行一次轮询
     */
    @Scheduled(fixedRateString = "${modbus.polling.default-scan-rate-ms:1000}")
    public void poll() {
        List<MbDevice> devices = deviceService.list();
        if (devices.isEmpty()) {
            return;
        }

        List<MbRegisterHistory> realtimeData = new ArrayList<>();

        for (MbDevice device : devices) {
            if (device.getStatus() == null || device.getStatus() == 0) {
                // 跳过离线设备
                continue;
            }

            Map<Long, BigDecimal> values = modbusService.pollDeviceRegisters(device);
            List<MbRegister> registers = registerService.getMonitoredByDeviceId(device.getId());

            for (MbRegister register : registers) {
                BigDecimal value = values.get(register.getId());
                if (value == null) {
                    continue;
                }

                MbRegisterHistory history = buildHistory(device, register, value);
                historyService.save(history);
                realtimeData.add(history);
            }
        }

        if (!realtimeData.isEmpty()) {
            realtimePushService.broadcast(realtimeData);
        }
    }

    private MbRegisterHistory buildHistory(MbDevice device, MbRegister register, BigDecimal value) {
        MbRegisterHistory history = new MbRegisterHistory();
        history.setDeviceId(device.getId());
        history.setRegisterId(register.getId());
        history.setRegisterAddress(register.getRegisterAddress());
        history.setRawValue(value.toPlainString());
        history.setDecimalValue(value);
        history.setBinaryValue(Integer.toBinaryString(value.intValue()));
        history.setStatus(detectAlarmStatus(register, value));
        history.setSampledAt(LocalDateTime.now());
        history.setCreatedAt(LocalDateTime.now());
        return history;
    }

    private String detectAlarmStatus(MbRegister register, BigDecimal value) {
        if (register.getAlarmUpperLimit() != null
                && value.compareTo(register.getAlarmUpperLimit()) > 0) {
            return "WARN";
        }
        if (register.getAlarmLowerLimit() != null
                && value.compareTo(register.getAlarmLowerLimit()) < 0) {
            return "WARN";
        }
        return "VALID";
    }

}

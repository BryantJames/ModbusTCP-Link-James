package com.james.modbustcp.modbus;

import com.james.modbustcp.entity.MbDevice;
import com.serotonin.modbus4j.ModbusFactory;
import com.serotonin.modbus4j.ModbusMaster;
import com.serotonin.modbus4j.exception.ModbusInitException;
import com.serotonin.modbus4j.ip.IpParameters;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Modbus TCP Master 连接管理器
 */
@Slf4j
@Component
public class ModbusMasterManager {

    private final Map<Long, ModbusMaster> masterMap = new ConcurrentHashMap<>();
    private final Map<Long, Boolean> connectionStatus = new ConcurrentHashMap<>();

    /**
     * 获取或创建 Modbus Master 连接
     */
    public ModbusMaster getOrCreateMaster(MbDevice device) {
        ModbusMaster master = masterMap.get(device.getId());
        if (master != null && master.isInitialized()) {
            return master;
        }
        return createMaster(device);
    }

    private synchronized ModbusMaster createMaster(MbDevice device) {
        // 二次检查
        ModbusMaster master = masterMap.get(device.getId());
        if (master != null) {
            if (master.isInitialized()) {
                return master;
            }
            closeMaster(device.getId(), master);
        }

        IpParameters params = new IpParameters();
        params.setHost(device.getHost());
        params.setPort(device.getPort());

        master = new ModbusFactory().createTcpMaster(params, true);
        master.setTimeout(device.getTimeoutMs() != null ? device.getTimeoutMs() : 1000);
        master.setRetries(2);
        master.setConnected(true);

        try {
            master.init();
            masterMap.put(device.getId(), master);
            connectionStatus.put(device.getId(), true);
            log.info("Modbus 设备连接成功: {}:{} (deviceId={})", device.getHost(), device.getPort(), device.getId());
            return master;
        } catch (ModbusInitException e) {
            connectionStatus.put(device.getId(), false);
            log.warn("Modbus 设备连接失败: {}:{} (deviceId={}) - {}",
                    device.getHost(), device.getPort(), device.getId(), e.getMessage());
            return null;
        }
    }

    /**
     * 断开指定设备连接
     */
    public void disconnect(Long deviceId) {
        ModbusMaster master = masterMap.remove(deviceId);
        if (master != null) {
            closeMaster(deviceId, master);
        }
    }

    private void closeMaster(Long deviceId, ModbusMaster master) {
        try {
            master.destroy();
        } catch (Exception e) {
            log.warn("关闭 Modbus 连接异常 (deviceId={}): {}", deviceId, e.getMessage());
        } finally {
            connectionStatus.put(deviceId, false);
        }
    }

    /**
     * 判断设备是否已连接
     */
    public boolean isConnected(Long deviceId) {
        ModbusMaster master = masterMap.get(deviceId);
        return master != null && master.isInitialized() && Boolean.TRUE.equals(connectionStatus.get(deviceId));
    }

    /**
     * 更新设备连接状态
     */
    public void setConnectionStatus(Long deviceId, boolean connected) {
        connectionStatus.put(deviceId, connected);
    }

    /**
     * 清空所有连接
     */
    public void disconnectAll() {
        masterMap.forEach((deviceId, master) -> closeMaster(deviceId, master));
        masterMap.clear();
        connectionStatus.clear();
    }

}

package com.james.modbustcp.service.impl;

import com.james.modbustcp.entity.MbDevice;
import com.james.modbustcp.entity.MbRegister;
import com.james.modbustcp.modbus.ModbusMasterManager;
import com.james.modbustcp.service.IMbDeviceService;
import com.james.modbustcp.service.IMbRegisterService;
import com.james.modbustcp.service.IModbusService;
import com.james.modbustcp.util.ModbusDataConverter;
import com.serotonin.modbus4j.ModbusMaster;
import com.serotonin.modbus4j.exception.ModbusTransportException;
import com.serotonin.modbus4j.locator.BaseLocator;
import com.serotonin.modbus4j.msg.ReadCoilsRequest;
import com.serotonin.modbus4j.msg.ReadCoilsResponse;
import com.serotonin.modbus4j.msg.ReadDiscreteInputsRequest;
import com.serotonin.modbus4j.msg.ReadDiscreteInputsResponse;
import com.serotonin.modbus4j.msg.ReadHoldingRegistersRequest;
import com.serotonin.modbus4j.msg.ReadHoldingRegistersResponse;
import com.serotonin.modbus4j.msg.ReadInputRegistersRequest;
import com.serotonin.modbus4j.msg.ReadInputRegistersResponse;
import com.serotonin.modbus4j.msg.WriteRegisterRequest;
import com.serotonin.modbus4j.msg.WriteRegisterResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Modbus TCP 服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ModbusServiceImpl implements IModbusService {

    private final ModbusMasterManager masterManager;
    private final IMbDeviceService deviceService;
    private final IMbRegisterService registerService;

    @Override
    public BigDecimal readRegister(MbDevice device, MbRegister register) {
        ModbusMaster master = masterManager.getOrCreateMaster(device);
        if (master == null) {
            throw new RuntimeException("Modbus 设备未连接: " + device.getHost() + ":" + device.getPort());
        }

        try {
            short[] data = readRawData(master, device, register);
            return ModbusDataConverter.convert(data, register.getRegisterType(),
                    register.getScaleFactor(), register.getOffsetValue(), 0);
        } catch (Exception e) {
            log.warn("读取寄存器失败 (deviceId={}, address={}): {}",
                    device.getId(), register.getRegisterAddress(), e.getMessage());
            masterManager.setConnectionStatus(device.getId(), false);
            throw new RuntimeException("读取寄存器失败: " + e.getMessage());
        }
    }

    @Override
    public void writeRegister(MbDevice device, MbRegister register, BigDecimal value) {
        ModbusMaster master = masterManager.getOrCreateMaster(device);
        if (master == null) {
            throw new RuntimeException("Modbus 设备未连接: " + device.getHost() + ":" + device.getPort());
        }

        try {
            String functionCode = register.getFunctionCode();
            if ("01".equals(functionCode)) {
                // 线圈写入（简化实现）
                BaseLocator<Boolean> locator = BaseLocator.coilStatus(device.getUnitId(), register.getRegisterAddress());
                master.setValue(locator, value.intValue() != 0);
            } else {
                // 默认保持寄存器写入
                short[] data = ModbusDataConverter.toShortArray(value, register.getRegisterType());
                WriteRegisterRequest request = new WriteRegisterRequest(
                        device.getUnitId(), register.getRegisterAddress(), data[0]);
                WriteRegisterResponse response = (WriteRegisterResponse) master.send(request);
                if (response.isException()) {
                    throw new RuntimeException("写入异常: " + response.getExceptionMessage());
                }
            }
        } catch (Exception e) {
            log.warn("写入寄存器失败 (deviceId={}, address={}): {}",
                    device.getId(), register.getRegisterAddress(), e.getMessage());
            throw new RuntimeException("写入寄存器失败: " + e.getMessage());
        }
    }

    @Override
    public Map<Long, BigDecimal> pollDeviceRegisters(MbDevice device) {
        Map<Long, BigDecimal> result = new LinkedHashMap<>();
        List<MbRegister> registers = registerService.getMonitoredByDeviceId(device.getId());
        if (registers.isEmpty()) {
            return result;
        }

        ModbusMaster master = masterManager.getOrCreateMaster(device);
        if (master == null) {
            log.warn("轮询时设备未连接: deviceId={}", device.getId());
            return result;
        }

        for (MbRegister register : registers) {
            try {
                short[] data = readRawData(master, device, register);
                BigDecimal value = ModbusDataConverter.convert(data, register.getRegisterType(),
                        register.getScaleFactor(), register.getOffsetValue(), 0);
                result.put(register.getId(), value);
            } catch (Exception e) {
                log.warn("轮询寄存器失败 (deviceId={}, registerId={}): {}",
                        device.getId(), register.getId(), e.getMessage());
            }
        }

        masterManager.setConnectionStatus(device.getId(), true);
        return result;
    }

    @Override
    public boolean connect(MbDevice device) {
        ModbusMaster master = masterManager.getOrCreateMaster(device);
        return master != null;
    }

    @Override
    public void disconnect(Long deviceId) {
        masterManager.disconnect(deviceId);
    }

    @Override
    public List<MbDevice> testConnections() {
        List<MbDevice> devices = deviceService.list();
        for (MbDevice device : devices) {
            boolean connected = connect(device);
            device.setStatus(connected ? 1 : 0);
        }
        return devices;
    }

    /**
     * 读取原始 short 数据
     */
    private short[] readRawData(ModbusMaster master, MbDevice device, MbRegister register)
            throws ModbusTransportException {
        String functionCode = register.getFunctionCode();
        int address = register.getRegisterAddress();
        int unitId = device.getUnitId();
        int wordCount = getWordCount(register.getRegisterType());

        return switch (functionCode) {
            case "01" -> readCoils(master, unitId, address, 1);
            case "02" -> readDiscreteInputs(master, unitId, address, 1);
            case "04" -> readInputRegisters(master, unitId, address, wordCount);
            default -> readHoldingRegisters(master, unitId, address, wordCount);
        };
    }

    private short[] readCoils(ModbusMaster master, int unitId, int address, int count)
            throws ModbusTransportException {
        ReadCoilsRequest request = new ReadCoilsRequest(unitId, address, count);
        ReadCoilsResponse response = (ReadCoilsResponse) master.send(request);
        boolean[] data = response.getBooleanData();
        short[] result = new short[data.length];
        for (int i = 0; i < data.length; i++) {
            result[i] = data[i] ? (short) 1 : 0;
        }
        return result;
    }

    private short[] readDiscreteInputs(ModbusMaster master, int unitId, int address, int count)
            throws ModbusTransportException {
        ReadDiscreteInputsRequest request = new ReadDiscreteInputsRequest(unitId, address, count);
        ReadDiscreteInputsResponse response = (ReadDiscreteInputsResponse) master.send(request);
        boolean[] data = response.getBooleanData();
        short[] result = new short[data.length];
        for (int i = 0; i < data.length; i++) {
            result[i] = data[i] ? (short) 1 : 0;
        }
        return result;
    }

    private short[] readHoldingRegisters(ModbusMaster master, int unitId, int address, int count)
            throws ModbusTransportException {
        ReadHoldingRegistersRequest request = new ReadHoldingRegistersRequest(unitId, address, count);
        ReadHoldingRegistersResponse response = (ReadHoldingRegistersResponse) master.send(request);
        return response.getShortData();
    }

    private short[] readInputRegisters(ModbusMaster master, int unitId, int address, int count)
            throws ModbusTransportException {
        ReadInputRegistersRequest request = new ReadInputRegistersRequest(unitId, address, count);
        ReadInputRegistersResponse response = (ReadInputRegistersResponse) master.send(request);
        return response.getShortData();
    }

    private int getWordCount(String dataType) {
        return switch (dataType.toUpperCase()) {
            case "UINT32", "INT32", "FLOAT32" -> 2;
            case "FLOAT64" -> 4;
            default -> 1;
        };
    }

}

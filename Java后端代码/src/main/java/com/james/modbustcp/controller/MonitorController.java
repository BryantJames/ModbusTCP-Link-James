package com.james.modbustcp.controller;

import com.james.modbustcp.dto.ReadRegisterRequest;
import com.james.modbustcp.dto.WriteRegisterRequest;
import com.james.modbustcp.entity.MbDevice;
import com.james.modbustcp.entity.MbRegister;
import com.james.modbustcp.entity.MbRegisterHistory;
import com.james.modbustcp.service.IMbDeviceService;
import com.james.modbustcp.service.IMbRegisterHistoryService;
import com.james.modbustcp.service.IMbRegisterService;
import com.james.modbustcp.service.IModbusService;
import com.james.modbustcp.vo.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 实时监控 Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MonitorController {

    private final IMbDeviceService deviceService;
    private final IMbRegisterService registerService;
    private final IMbRegisterHistoryService historyService;
    private final IModbusService modbusService;

    @GetMapping("/monitor/devices/{deviceId}/registers")
    public Result<List<Map<String, Object>>> getLatestValues(@PathVariable Long deviceId) {
        List<MbRegister> registers = registerService.getMonitoredByDeviceId(deviceId);
        List<Map<String, Object>> result = registers.stream().map(register -> {
            Map<String, Object> map = new HashMap<>();
            map.put("register", register);
            map.put("latest", historyService.getLatestByRegisterId(register.getId()));
            return map;
        }).collect(Collectors.toList());
        return Result.ok(result);
    }

    @PostMapping("/modbus/read")
    public Result<BigDecimal> read(@Valid @RequestBody ReadRegisterRequest request) {
        MbDevice device = deviceService.getById(request.getDeviceId());
        MbRegister register = registerService.getById(request.getRegisterId());
        if (device == null || register == null) {
            return Result.fail("设备或寄存器不存在");
        }
        BigDecimal value = modbusService.readRegister(device, register);
        return Result.ok(value);
    }

    @PostMapping("/modbus/write")
    public Result<Void> write(@Valid @RequestBody WriteRegisterRequest request) {
        MbDevice device = deviceService.getById(request.getDeviceId());
        MbRegister register = registerService.getById(request.getRegisterId());
        if (device == null || register == null) {
            return Result.fail("设备或寄存器不存在");
        }
        modbusService.writeRegister(device, register, request.getValue());
        return Result.ok();
    }

}

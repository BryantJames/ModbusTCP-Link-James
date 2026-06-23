package com.james.modbustcp.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.james.modbustcp.entity.MbDevice;
import com.james.modbustcp.service.IMbDeviceService;
import com.james.modbustcp.service.IModbusService;
import com.james.modbustcp.vo.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备管理 Controller
 */
@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final IMbDeviceService deviceService;
    private final IModbusService modbusService;

    @GetMapping
    public Result<List<MbDevice>> list() {
        return Result.ok(deviceService.list(new QueryWrapper<MbDevice>().orderByDesc("created_at")));
    }

    @GetMapping("/{id}")
    public Result<MbDevice> getById(@PathVariable Long id) {
        return Result.ok(deviceService.getById(id));
    }

    @PostMapping
    public Result<MbDevice> create(@RequestBody MbDevice device) {
        device.setId(null);
        device.setStatus(0);
        device.setCreatedAt(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        deviceService.save(device);
        return Result.ok(device);
    }

    @PutMapping("/{id}")
    public Result<MbDevice> update(@PathVariable Long id, @RequestBody MbDevice device) {
        device.setId(id);
        device.setUpdatedAt(LocalDateTime.now());
        deviceService.updateById(device);
        return Result.ok(deviceService.getById(id));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        modbusService.disconnect(id);
        deviceService.removeById(id);
        return Result.ok();
    }

    @PostMapping("/{id}/connect")
    public Result<Boolean> connect(@PathVariable Long id) {
        MbDevice device = deviceService.getById(id);
        if (device == null) {
            return Result.fail("设备不存在");
        }
        boolean connected = modbusService.connect(device);
        device.setStatus(connected ? 1 : 0);
        deviceService.updateById(device);
        return Result.ok(connected);
    }

    @PostMapping("/{id}/disconnect")
    public Result<Void> disconnect(@PathVariable Long id) {
        modbusService.disconnect(id);
        MbDevice device = deviceService.getById(id);
        device.setStatus(0);
        deviceService.updateById(device);
        return Result.ok();
    }

}

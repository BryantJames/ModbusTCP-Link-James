package com.james.modbustcp.controller;

import com.james.modbustcp.entity.MbRegister;
import com.james.modbustcp.service.IMbRegisterService;
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
 * 寄存器定义 Controller
 */
@RestController
@RequestMapping("/api/devices/{deviceId}/registers")
@RequiredArgsConstructor
public class RegisterController {

    private final IMbRegisterService registerService;

    @GetMapping
    public Result<List<MbRegister>> list(@PathVariable Long deviceId) {
        return Result.ok(registerService.getActiveByDeviceId(deviceId));
    }

    @PostMapping
    public Result<MbRegister> create(@PathVariable Long deviceId, @RequestBody MbRegister register) {
        register.setId(null);
        register.setDeviceId(deviceId);
        register.setCreatedAt(LocalDateTime.now());
        register.setUpdatedAt(LocalDateTime.now());
        registerService.save(register);
        return Result.ok(register);
    }

    @PutMapping("/{id}")
    public Result<MbRegister> update(@PathVariable Long deviceId,
                                     @PathVariable Long id,
                                     @RequestBody MbRegister register) {
        register.setId(id);
        register.setDeviceId(deviceId);
        register.setUpdatedAt(LocalDateTime.now());
        registerService.updateById(register);
        return Result.ok(registerService.getById(id));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        registerService.removeById(id);
        return Result.ok();
    }

}

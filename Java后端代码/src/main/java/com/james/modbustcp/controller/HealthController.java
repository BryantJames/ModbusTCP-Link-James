package com.james.modbustcp.controller;

import com.james.modbustcp.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查 Controller
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Result<Map<String, Object>> health() {
        Map<String, Object> data = new HashMap<>();
        data.put("service", "modbus-tcp-java-backend");
        data.put("status", "UP");
        data.put("timestamp", LocalDateTime.now());
        return Result.ok(data);
    }

}

package com.james.modbustcp.controller;

import com.james.modbustcp.entity.MbRegisterHistory;
import com.james.modbustcp.service.IMbRegisterHistoryService;
import com.james.modbustcp.vo.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 历史数据 Controller
 */
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final IMbRegisterHistoryService historyService;

    @GetMapping
    public Result<List<MbRegisterHistory>> list(
            @RequestParam Long deviceId,
            @RequestParam Long registerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return Result.ok(historyService.getHistoryRange(deviceId, registerId, start, end));
    }

}

package com.james.modbustcp.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.james.modbustcp.entity.SysAlarm;
import com.james.modbustcp.mapper.SysAlarmMapper;
import com.james.modbustcp.vo.Result;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 报警记录 Controller
 */
@RestController
@RequestMapping("/api/alarms")
@RequiredArgsConstructor
public class AlarmController {

    private final SysAlarmMapper alarmMapper;

    @GetMapping
    public Result<List<SysAlarm>> list(@RequestParam(required = false) Integer status) {
        QueryWrapper<SysAlarm> wrapper = new QueryWrapper<>();
        if (status != null) {
            wrapper.eq("status", status);
        }
        wrapper.orderByDesc("created_at");
        return Result.ok(alarmMapper.selectList(wrapper));
    }

    @GetMapping("/pending")
    public Result<List<SysAlarm>> pending(@RequestParam(defaultValue = "100") Integer limit) {
        return Result.ok(alarmMapper.selectPendingWithRegisterName(limit));
    }

    @PutMapping("/{id}/confirm")
    public Result<Void> confirm(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        SysAlarm alarm = alarmMapper.selectById(id);
        if (alarm == null) {
            return Result.fail("报警不存在");
        }
        alarm.setStatus(1);
        alarm.setConfirmedBy(userId);
        alarm.setConfirmedAt(LocalDateTime.now());
        alarm.setUpdatedAt(LocalDateTime.now());
        alarmMapper.updateById(alarm);
        return Result.ok();
    }

}

package com.james.modbustcp.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.james.modbustcp.entity.SysSetting;
import com.james.modbustcp.mapper.SysSettingMapper;
import com.james.modbustcp.vo.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 系统设置 Controller
 */
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingController {

    private final SysSettingMapper settingMapper;

    @GetMapping
    public Result<List<SysSetting>> list(@RequestParam(required = false) String group) {
        QueryWrapper<SysSetting> wrapper = new QueryWrapper<>();
        if (group != null && !group.isEmpty()) {
            wrapper.eq("config_group", group);
        }
        wrapper.orderByAsc("config_group", "config_key");
        return Result.ok(settingMapper.selectList(wrapper));
    }

    @GetMapping("/{key}")
    public Result<SysSetting> getByKey(@PathVariable String key) {
        return Result.ok(settingMapper.selectByKey(key));
    }

    @PutMapping("/{key}")
    public Result<SysSetting> update(@PathVariable String key, @RequestBody SysSetting setting) {
        SysSetting existing = settingMapper.selectByKey(key);
        if (existing == null) {
            setting.setConfigKey(key);
            setting.setCreatedAt(LocalDateTime.now());
            setting.setUpdatedAt(LocalDateTime.now());
            settingMapper.insert(setting);
        } else {
            existing.setConfigValue(setting.getConfigValue());
            existing.setConfigGroup(setting.getConfigGroup());
            existing.setDescription(setting.getDescription());
            existing.setUpdatedAt(LocalDateTime.now());
            settingMapper.updateById(existing);
            setting = existing;
        }
        return Result.ok(setting);
    }

}

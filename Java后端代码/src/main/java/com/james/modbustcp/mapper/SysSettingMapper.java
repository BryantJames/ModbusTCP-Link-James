package com.james.modbustcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.james.modbustcp.entity.SysSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 系统设置 Mapper
 */
@Mapper
public interface SysSettingMapper extends BaseMapper<SysSetting> {

    @Select("SELECT * FROM sys_setting WHERE config_key = #{key} LIMIT 1")
    SysSetting selectByKey(@Param("key") String key);

}

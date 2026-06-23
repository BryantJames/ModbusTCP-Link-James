package com.james.modbustcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.james.modbustcp.entity.MbRegister;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 寄存器定义 Mapper
 */
@Mapper
public interface MbRegisterMapper extends BaseMapper<MbRegister> {

    @Select("SELECT * FROM mb_register WHERE device_id = #{deviceId} AND status = 1 ORDER BY display_order, id")
    List<MbRegister> selectActiveByDeviceId(@Param("deviceId") Long deviceId);

    @Select("SELECT * FROM mb_register WHERE device_id = #{deviceId} AND is_monitored = 1 AND status = 1 ORDER BY display_order, id")
    List<MbRegister> selectMonitoredByDeviceId(@Param("deviceId") Long deviceId);

}

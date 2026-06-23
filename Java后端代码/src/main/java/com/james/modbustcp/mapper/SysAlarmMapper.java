package com.james.modbustcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.james.modbustcp.entity.SysAlarm;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 报警记录 Mapper
 */
@Mapper
public interface SysAlarmMapper extends BaseMapper<SysAlarm> {

    /**
     * 查询未处理报警，附带寄存器名称
     */
    List<SysAlarm> selectPendingWithRegisterName(@Param("limit") Integer limit);

}

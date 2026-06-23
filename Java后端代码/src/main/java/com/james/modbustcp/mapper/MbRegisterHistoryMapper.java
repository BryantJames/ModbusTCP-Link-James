package com.james.modbustcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.james.modbustcp.entity.MbRegisterHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 寄存器历史数据 Mapper
 */
@Mapper
public interface MbRegisterHistoryMapper extends BaseMapper<MbRegisterHistory> {

    @Select("SELECT * FROM mb_register_history " +
            "WHERE device_id = #{deviceId} AND register_id = #{registerId} " +
            "AND sampled_at BETWEEN #{start} AND #{end} " +
            "ORDER BY sampled_at DESC")
    List<MbRegisterHistory> selectHistoryRange(@Param("deviceId") Long deviceId,
                                               @Param("registerId") Long registerId,
                                               @Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);

    @Select("SELECT * FROM mb_register_history " +
            "WHERE register_id = #{registerId} " +
            "ORDER BY sampled_at DESC LIMIT 1")
    MbRegisterHistory selectLatestByRegisterId(@Param("registerId") Long registerId);

}

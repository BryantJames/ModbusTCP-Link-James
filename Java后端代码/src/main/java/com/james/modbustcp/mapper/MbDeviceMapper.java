package com.james.modbustcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.james.modbustcp.entity.MbDevice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 设备 Mapper
 */
@Mapper
public interface MbDeviceMapper extends BaseMapper<MbDevice> {

    @Select("SELECT * FROM mb_device WHERE is_default = 1 LIMIT 1")
    MbDevice selectDefaultDevice();

    @Select("SELECT * FROM mb_device WHERE host = #{host} AND port = #{port} LIMIT 1")
    MbDevice selectByHostAndPort(@Param("host") String host, @Param("port") Integer port);

}

package com.james.modbustcp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.james.modbustcp.entity.SysUser;

/**
 * 用户 Service
 */
public interface ISysUserService extends IService<SysUser> {

    /**
     * 根据用户名查询用户
     */
    SysUser getByUsername(String username);

}

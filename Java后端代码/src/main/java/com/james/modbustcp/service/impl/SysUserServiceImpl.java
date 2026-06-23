package com.james.modbustcp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.james.modbustcp.entity.SysUser;
import com.james.modbustcp.mapper.SysUserMapper;
import com.james.modbustcp.service.ISysUserService;
import org.springframework.stereotype.Service;

/**
 * 用户 Service 实现
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements ISysUserService {

    @Override
    public SysUser getByUsername(String username) {
        return baseMapper.selectByUsername(username);
    }

}

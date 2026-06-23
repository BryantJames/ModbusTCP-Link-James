package com.james.modbustcp.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 登录用户信息 VO
 */
@Data
public class UserVO {

    private Long id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private String role;
    private Integer authLevel;
    private Integer status;
    private LocalDateTime lastLoginTime;
    private LocalDateTime createdAt;
    private String token;

}

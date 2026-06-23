package com.james.modbustcp.controller;

import com.james.modbustcp.dto.LoginRequest;
import com.james.modbustcp.dto.RegisterRequest;
import com.james.modbustcp.entity.SysUser;
import com.james.modbustcp.security.JwtUtil;
import com.james.modbustcp.service.ISysUserService;
import com.james.modbustcp.vo.Result;
import com.james.modbustcp.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 认证 Controller
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ISysUserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public Result<UserVO> register(@Valid @RequestBody RegisterRequest request) {
        SysUser existing = userService.getByUsername(request.getUsername());
        if (existing != null) {
            return Result.fail("用户名已存在");
        }

        SysUser user = new SysUser();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName() != null ? request.getDisplayName() : request.getUsername());
        user.setRole("operator");
        user.setAuthLevel(1);
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userService.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return Result.ok(buildUserVO(user, token));
    }

    @PostMapping("/login")
    public Result<UserVO> login(@Valid @RequestBody LoginRequest request) {
        SysUser user = userService.getByUsername(request.getUsername());
        if (user == null) {
            return Result.fail("用户名或密码错误");
        }

        if (user.getStatus() == null || user.getStatus() != 1) {
            return Result.fail("账号已被禁用");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return Result.fail("用户名或密码错误");
        }

        user.setLastLoginTime(LocalDateTime.now());
        userService.updateById(user);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return Result.ok(buildUserVO(user, token));
    }

    @GetMapping("/me")
    public Result<UserVO> me(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        SysUser user = userService.getById(userId);
        if (user == null) {
            return Result.fail("用户不存在");
        }
        return Result.ok(buildUserVO(user, null));
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.ok();
    }

    @PostMapping("/avatar")
    public Result<Map<String, String>> updateAvatar(@RequestBody Map<String, String> body,
                                                    HttpServletRequest request) {
        String avatarUrl = body.get("avatar_url");
        Long userId = (Long) request.getAttribute("userId");
        if (avatarUrl == null || !avatarUrl.startsWith("data:image/")) {
            return Result.fail("头像格式不正确");
        }
        if (avatarUrl.length() > 14 * 1024 * 1024) {
            return Result.fail("头像文件过大");
        }

        SysUser user = userService.getById(userId);
        user.setAvatarUrl(avatarUrl);
        userService.updateById(user);

        return Result.ok(Map.of("avatar_url", avatarUrl));
    }

    private UserVO buildUserVO(SysUser user, String token) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setDisplayName(user.getDisplayName());
        vo.setAvatarUrl(user.getAvatarUrl());
        vo.setRole(user.getRole());
        vo.setAuthLevel(user.getAuthLevel());
        vo.setStatus(user.getStatus());
        vo.setLastLoginTime(user.getLastLoginTime());
        vo.setCreatedAt(user.getCreatedAt());
        vo.setToken(token);
        return vo;
    }

}

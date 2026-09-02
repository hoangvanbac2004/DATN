package com.taskflow.modules.auth.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.auth.dto.AuthResponse;
import com.taskflow.modules.auth.dto.LoginRequest;
import com.taskflow.modules.auth.dto.RefreshTokenRequest;
import com.taskflow.modules.auth.dto.RegisterRequest;
import com.taskflow.modules.auth.service.AuthService;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.entity.RoleEntity;
import com.taskflow.modules.user.entity.UserEntity;
import com.taskflow.modules.user.mapper.UserMapper;
import com.taskflow.modules.user.repository.RoleRepository;
import com.taskflow.modules.user.repository.UserRepository;
import com.taskflow.security.JwtProvider;
import com.taskflow.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ResultCode.CONFLICT, "Email is already registered");
        }

        RoleEntity defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new RoleEntity("ROLE_USER", "Standard User Role")));

        Set<RoleEntity> roles = new HashSet<>(Collections.singletonList(defaultRole));

        UserEntity user = new UserEntity();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setIsEmailVerified(false);
        user.setStatus("ACTIVE");
        user.setRoles(roles);

        UserEntity savedUser = userRepository.save(user);
        UserDto userDto = userMapper.toDto(savedUser);

        String accessToken = jwtProvider.generateTokenFromEmail(savedUser.getEmail());
        String refreshToken = jwtProvider.generateRefreshTokenFromEmail(savedUser.getEmail());

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtProvider.getExpirationInMs(),
                userDto
        );
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        UserEntity user = userRepository.findByEmailWithRolesAndPermissions(principal.getEmail())
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "User not found"));

        if (Boolean.TRUE.equals(user.getIsDeleted()) || "DELETED".equalsIgnoreCase(user.getStatus())) {
            throw new AppException(ResultCode.FORBIDDEN, "Tài khoản này đã bị xóa khỏi hệ thống");
        }
        if ("LOCKED".equalsIgnoreCase(user.getStatus()) || "BLOCKED".equalsIgnoreCase(user.getStatus())) {
            throw new AppException(ResultCode.FORBIDDEN, "Tài khoản này đã bị khóa. Vui lòng liên hệ Quản trị viên");
        }
        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new AppException(ResultCode.FORBIDDEN, "Tài khoản này đang ở trạng thái vô hiệu hóa");
        }

        String accessToken = jwtProvider.generateToken(authentication);
        String refreshToken = jwtProvider.generateRefreshTokenFromEmail(user.getEmail());

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtProvider.getExpirationInMs(),
                userMapper.toDto(user)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!jwtProvider.validateToken(token)) {
            throw new AppException(ResultCode.UNAUTHORIZED, "Invalid or expired refresh token");
        }

        String email = jwtProvider.getUsernameFromJWT(token);
        UserEntity user = userRepository.findByEmailWithRolesAndPermissions(email)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "User not found"));

        if (Boolean.TRUE.equals(user.getIsDeleted()) || "DELETED".equalsIgnoreCase(user.getStatus())) {
            throw new AppException(ResultCode.FORBIDDEN, "Tài khoản này đã bị xóa khỏi hệ thống");
        }
        if ("LOCKED".equalsIgnoreCase(user.getStatus()) || "BLOCKED".equalsIgnoreCase(user.getStatus())) {
            throw new AppException(ResultCode.FORBIDDEN, "Tài khoản này đã bị khóa. Vui lòng liên hệ Quản trị viên");
        }
        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new AppException(ResultCode.FORBIDDEN, "Tài khoản này đang ở trạng thái vô hiệu hóa");
        }

        String newAccessToken = jwtProvider.generateTokenFromEmail(email);
        String newRefreshToken = jwtProvider.generateRefreshTokenFromEmail(email);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                "Bearer",
                jwtProvider.getExpirationInMs(),
                userMapper.toDto(user)
        );
    }

    @Override
    public void logout(String token) {
        // Stateless JWT logout confirmation
    }
}

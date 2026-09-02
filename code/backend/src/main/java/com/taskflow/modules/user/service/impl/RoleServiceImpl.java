package com.taskflow.modules.user.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.user.dto.PermissionDto;
import com.taskflow.modules.user.dto.RoleDto;
import com.taskflow.modules.user.dto.UpdateRolePermissionsRequest;
import com.taskflow.modules.user.entity.PermissionEntity;
import com.taskflow.modules.user.entity.RoleEntity;
import com.taskflow.modules.user.repository.PermissionRepository;
import com.taskflow.modules.user.repository.RoleRepository;
import com.taskflow.modules.user.service.RoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleServiceImpl(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDto> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(p -> new PermissionDto(p.getId(), p.getName(), p.getDescription()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RoleDto updateRolePermissions(UUID roleId, UpdateRolePermissionsRequest request) {
        RoleEntity role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Role not found"));

        List<PermissionEntity> permissions = permissionRepository.findAllById(request.getPermissionIds());
        role.setPermissions(new HashSet<>(permissions));

        RoleEntity saved = roleRepository.save(role);
        return toDto(saved);
    }

    private RoleDto toDto(RoleEntity role) {
        Set<PermissionDto> permDtos = role.getPermissions().stream()
                .map(p -> new PermissionDto(p.getId(), p.getName(), p.getDescription()))
                .collect(Collectors.toSet());
        return new RoleDto(role.getId(), role.getName(), role.getDescription(), permDtos);
    }
}

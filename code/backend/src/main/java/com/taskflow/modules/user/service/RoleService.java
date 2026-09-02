package com.taskflow.modules.user.service;

import com.taskflow.modules.user.dto.PermissionDto;
import com.taskflow.modules.user.dto.RoleDto;
import com.taskflow.modules.user.dto.UpdateRolePermissionsRequest;

import java.util.List;
import java.util.UUID;

public interface RoleService {

    List<RoleDto> getAllRoles();

    List<PermissionDto> getAllPermissions();

    RoleDto updateRolePermissions(UUID roleId, UpdateRolePermissionsRequest request);
}

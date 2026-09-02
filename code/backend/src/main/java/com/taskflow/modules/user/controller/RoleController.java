package com.taskflow.modules.user.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.user.dto.PermissionDto;
import com.taskflow.modules.user.dto.RoleDto;
import com.taskflow.modules.user.dto.UpdateRolePermissionsRequest;
import com.taskflow.modules.user.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Role & Permission Management", description = "Endpoints for managing system roles and configurable permissions")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/roles")
    @Operation(summary = "Get all system roles")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getAllRoles() {
        List<RoleDto> roles = roleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully", roles));
    }

    @GetMapping("/permissions")
    @Operation(summary = "Get all configurable permissions")
    public ResponseEntity<ApiResponse<List<PermissionDto>>> getAllPermissions() {
        List<PermissionDto> permissions = roleService.getAllPermissions();
        return ResponseEntity.ok(ApiResponse.success("Permissions retrieved successfully", permissions));
    }

    @PutMapping("/roles/{roleId}/permissions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update permissions associated with a role (Admin only)")
    public ResponseEntity<ApiResponse<RoleDto>> updateRolePermissions(
            @PathVariable UUID roleId,
            @Valid @RequestBody UpdateRolePermissionsRequest request) {
        RoleDto updated = roleService.updateRolePermissions(roleId, request);
        return ResponseEntity.ok(ApiResponse.success("Role permissions updated successfully", updated));
    }
}

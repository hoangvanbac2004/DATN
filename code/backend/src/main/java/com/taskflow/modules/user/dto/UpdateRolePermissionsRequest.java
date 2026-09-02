package com.taskflow.modules.user.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

public class UpdateRolePermissionsRequest {

    @NotNull(message = "Permission IDs must not be null")
    private Set<UUID> permissionIds;

    public UpdateRolePermissionsRequest() {
    }

    public UpdateRolePermissionsRequest(Set<UUID> permissionIds) {
        this.permissionIds = permissionIds;
    }

    public Set<UUID> getPermissionIds() {
        return permissionIds;
    }

    public void setPermissionIds(Set<UUID> permissionIds) {
        this.permissionIds = permissionIds;
    }
}

package com.taskflow.modules.user.dto;

import java.util.Set;
import java.util.UUID;

public class RoleDto {
    private UUID id;
    private String name;
    private String description;
    private Set<PermissionDto> permissions;

    public RoleDto() {
    }

    public RoleDto(UUID id, String name, String description, Set<PermissionDto> permissions) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<PermissionDto> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<PermissionDto> permissions) {
        this.permissions = permissions;
    }
}

package com.taskflow.modules.workspace.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateMemberRoleRequest {

    @NotBlank(message = "Role must not be blank")
    private String role;

    public UpdateMemberRoleRequest() {
    }

    public UpdateMemberRoleRequest(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

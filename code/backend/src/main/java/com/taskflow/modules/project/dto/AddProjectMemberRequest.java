package com.taskflow.modules.project.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class AddProjectMemberRequest {

    @NotNull(message = "User ID must not be null")
    private UUID userId;

    private String role = "MEMBER";

    public AddProjectMemberRequest() {
    }

    public AddProjectMemberRequest(UUID userId, String role) {
        this.userId = userId;
        this.role = role != null ? role : "MEMBER";
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

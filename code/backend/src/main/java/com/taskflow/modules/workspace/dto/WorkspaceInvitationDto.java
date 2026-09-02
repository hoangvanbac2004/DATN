package com.taskflow.modules.workspace.dto;

import java.time.Instant;
import java.util.UUID;

public class WorkspaceInvitationDto {
    private UUID id;
    private UUID workspaceId;
    private String email;
    private String role;
    private String token;
    private String status;
    private Instant expiresAt;
    private Instant createdAt;

    public WorkspaceInvitationDto() {
    }

    public WorkspaceInvitationDto(UUID id, UUID workspaceId, String email, String role, String token, String status, Instant expiresAt, Instant createdAt) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.email = email;
        this.role = role;
        this.token = token;
        this.status = status;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

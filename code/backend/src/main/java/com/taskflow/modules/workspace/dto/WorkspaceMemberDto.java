package com.taskflow.modules.workspace.dto;

import java.time.Instant;
import java.util.UUID;

public class WorkspaceMemberDto {
    private UUID id;
    private UUID workspaceId;
    private UUID userId;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String role;
    private String status;
    private Instant joinedAt;

    public WorkspaceMemberDto() {
    }

    public WorkspaceMemberDto(UUID id, UUID workspaceId, UUID userId, String email, String fullName, String avatarUrl, String role, String status, Instant joinedAt) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.status = status;
        this.joinedAt = joinedAt;
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

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }
}

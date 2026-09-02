package com.taskflow.modules.workspace.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "workspace_invitations")
public class WorkspaceInvitationEntity extends BaseEntity {

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "role", nullable = false, length = 50)
    private String role = "MEMBER";

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PENDING";

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    public WorkspaceInvitationEntity() {
    }

    public WorkspaceInvitationEntity(UUID workspaceId, String email, String role, String token, Instant expiresAt) {
        this.workspaceId = workspaceId;
        this.email = email;
        this.role = role != null ? role : "MEMBER";
        this.token = token;
        this.status = "PENDING";
        this.expiresAt = expiresAt;
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
}

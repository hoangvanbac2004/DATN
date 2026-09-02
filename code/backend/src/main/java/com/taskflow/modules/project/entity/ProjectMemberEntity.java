package com.taskflow.modules.project.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "project_members")
public class ProjectMemberEntity extends BaseEntity {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "role", nullable = false, length = 50)
    private String role = "MEMBER";

    @Column(name = "joined_at", nullable = false)
    private Instant joinedAt = Instant.now();

    public ProjectMemberEntity() {
    }

    public ProjectMemberEntity(UUID projectId, UUID userId, String role) {
        this.projectId = projectId;
        this.userId = userId;
        this.role = role != null ? role : "MEMBER";
        this.joinedAt = Instant.now();
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
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

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }
}

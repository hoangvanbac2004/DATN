package com.taskflow.modules.activity.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "activity_logs")
public class ActivityLogEntity extends BaseEntity {

    @Column(name = "action", nullable = false, length = 255)
    private String action;

    @Column(name = "entity_type", nullable = false, length = 255)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "workspace_id")
    private UUID workspaceId;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public ActivityLogEntity() {
    }

    public ActivityLogEntity(String action, String entityType, UUID entityId, UUID userId, String details, UUID workspaceId, UUID projectId) {
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.userId = userId;
        this.details = details;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.isDeleted = false;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}

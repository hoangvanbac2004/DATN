package com.taskflow.modules.activity.dto;

import com.taskflow.modules.user.dto.UserDto;

import java.time.Instant;
import java.util.UUID;

public class ActivityLogDto {

    private UUID id;
    private String action;
    private String entityType;
    private UUID entityId;
    private UUID userId;
    private UserDto user;
    private String details;
    private UUID workspaceId;
    private UUID projectId;
    private Instant createdAt;

    public ActivityLogDto() {
    }

    public ActivityLogDto(UUID id, String action, String entityType, UUID entityId, UUID userId, UserDto user, String details, UUID workspaceId, UUID projectId, Instant createdAt) {
        this.id = id;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.userId = userId;
        this.user = user;
        this.details = details;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

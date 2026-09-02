package com.taskflow.modules.activity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateActivityLogRequest {

    @NotBlank(message = "Action must not be blank")
    private String action;

    @NotBlank(message = "Entity type must not be blank")
    private String entityType;

    @NotNull(message = "Entity ID must not be null")
    private UUID entityId;

    private String details;
    private UUID workspaceId;
    private UUID projectId;

    public CreateActivityLogRequest() {
    }

    public CreateActivityLogRequest(String action, String entityType, UUID entityId, String details, UUID workspaceId, UUID projectId) {
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
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
}

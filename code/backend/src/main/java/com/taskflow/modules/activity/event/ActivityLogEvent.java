package com.taskflow.modules.activity.event;

import java.util.UUID;

public class ActivityLogEvent {

    private final UUID userId;
    private final String action;
    private final String entityType;
    private final UUID entityId;
    private final String details;
    private final UUID workspaceId;
    private final UUID projectId;

    public ActivityLogEvent(UUID userId, String action, String entityType, UUID entityId, String details, UUID workspaceId, UUID projectId) {
        this.userId = userId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getAction() {
        return action;
    }

    public String getEntityType() {
        return entityType;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public String getDetails() {
        return details;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public UUID getProjectId() {
        return projectId;
    }
}

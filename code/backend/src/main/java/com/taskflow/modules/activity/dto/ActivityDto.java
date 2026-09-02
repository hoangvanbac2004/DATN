package com.taskflow.modules.activity.dto;

import java.util.UUID;

public class ActivityDto {
    private UUID id;
    private String action;
    private String entityType;
    private UUID entityId;

    public ActivityDto() {}

    public ActivityDto(UUID id, String action, String entityType, UUID entityId) {
        this.id = id;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public UUID getEntityId() { return entityId; }
    public void setEntityId(UUID entityId) { this.entityId = entityId; }
}

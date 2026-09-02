package com.taskflow.modules.whiteboard.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class WhiteboardDto {
    private UUID id;
    private UUID workspaceId;
    private UUID projectId;
    private String title;
    private String description;
    private String backgroundColor;
    private Boolean isArchived;
    private Instant createdAt;
    private Instant updatedAt;
    private UUID createdBy;
    private List<WhiteboardElementDto> elements = new ArrayList<>();

    public WhiteboardDto() {
    }

    public WhiteboardDto(UUID id, UUID workspaceId, UUID projectId, String title, String description, String backgroundColor, Boolean isArchived, Instant createdAt, Instant updatedAt, UUID createdBy, List<WhiteboardElementDto> elements) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.backgroundColor = backgroundColor;
        this.isArchived = isArchived;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.elements = elements != null ? elements : new ArrayList<>();
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

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public Boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(Boolean archived) {
        isArchived = archived;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public List<WhiteboardElementDto> getElements() {
        return elements;
    }

    public void setElements(List<WhiteboardElementDto> elements) {
        this.elements = elements;
    }
}

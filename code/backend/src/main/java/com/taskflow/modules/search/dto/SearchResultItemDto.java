package com.taskflow.modules.search.dto;

import java.time.Instant;
import java.util.UUID;

public class SearchResultItemDto {

    private UUID id;
    private String title;
    private String description;
    private String type; // TASK, PROJECT, TAG, COMMENT
    private String link;
    private UUID workspaceId;
    private UUID projectId;
    private UUID taskId;
    private String status;
    private String priority;
    private String color;
    private Instant createdAt;

    public SearchResultItemDto() {
    }

    public SearchResultItemDto(UUID id, String title, String description, String type, String link, UUID workspaceId, UUID projectId, UUID taskId, String status, String priority, String color, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.link = link;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.taskId = taskId;
        this.status = status;
        this.priority = priority;
        this.color = color;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
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

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

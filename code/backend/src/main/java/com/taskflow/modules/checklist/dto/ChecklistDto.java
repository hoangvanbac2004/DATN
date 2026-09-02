package com.taskflow.modules.checklist.dto;

import java.time.Instant;
import java.util.UUID;

public class ChecklistDto {

    private UUID id;
    private String title;
    private Boolean completed;
    private UUID taskId;
    private Double position;
    private Instant createdAt;
    private Instant updatedAt;

    public ChecklistDto() {
    }

    public ChecklistDto(UUID id, String title, Boolean completed, UUID taskId, Double position, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.taskId = taskId;
        this.position = position;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
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
}

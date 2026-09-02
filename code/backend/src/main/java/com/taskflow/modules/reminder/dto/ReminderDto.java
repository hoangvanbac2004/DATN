package com.taskflow.modules.reminder.dto;

import java.time.Instant;
import java.util.UUID;

public class ReminderDto {

    private UUID id;
    private UUID taskId;
    private UUID userId;
    private Instant remindAt;
    private String status;
    private String type;
    private Instant createdAt;
    private Instant updatedAt;

    public ReminderDto() {
    }

    public ReminderDto(UUID id, UUID taskId, UUID userId, Instant remindAt, String status, String type, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.taskId = taskId;
        this.userId = userId;
        this.remindAt = remindAt;
        this.status = status;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Instant getRemindAt() {
        return remindAt;
    }

    public void setRemindAt(Instant remindAt) {
        this.remindAt = remindAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

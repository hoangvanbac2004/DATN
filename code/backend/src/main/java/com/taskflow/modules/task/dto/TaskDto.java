package com.taskflow.modules.task.dto;

import com.taskflow.modules.user.dto.UserDto;

import java.time.Instant;
import java.util.UUID;

public class TaskDto {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Instant startDate;
    private Instant dueDate;
    private Long durationDays;
    private java.util.List<TaskDependencyDto> dependencies;
    private UUID projectId;
    private UUID assigneeId;
    private UserDto assignee;
    private UUID columnId;
    private Double position;
    private Boolean isArchived;
    private Instant createdAt;
    private Instant updatedAt;

    public TaskDto() {
    }

    public TaskDto(UUID id, String title, String description, String status, String priority, Instant dueDate, UUID projectId, UUID assigneeId, UserDto assignee, Double position, Boolean isArchived, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.projectId = projectId;
        this.assigneeId = assigneeId;
        this.assignee = assignee;
        this.position = position;
        this.isArchived = isArchived;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }

    public UserDto getAssignee() {
        return assignee;
    }

    public void setAssignee(UserDto assignee) {
        this.assignee = assignee;
    }

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }

    public Boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Long getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Long durationDays) {
        this.durationDays = durationDays;
    }

    public java.util.List<TaskDependencyDto> getDependencies() {
        return dependencies;
    }

    public void setDependencies(java.util.List<TaskDependencyDto> dependencies) {
        this.dependencies = dependencies;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}

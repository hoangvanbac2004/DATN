package com.taskflow.modules.task.dto;

import java.time.Instant;
import java.util.UUID;

public class TaskDependencyDto {
    private UUID id;
    private UUID predecessorId;
    private UUID successorId;
    private String dependencyType;
    private Instant createdAt;

    public TaskDependencyDto() {
    }

    public TaskDependencyDto(UUID id, UUID predecessorId, UUID successorId, String dependencyType, Instant createdAt) {
        this.id = id;
        this.predecessorId = predecessorId;
        this.successorId = successorId;
        this.dependencyType = dependencyType;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPredecessorId() {
        return predecessorId;
    }

    public void setPredecessorId(UUID predecessorId) {
        this.predecessorId = predecessorId;
    }

    public UUID getSuccessorId() {
        return successorId;
    }

    public void setSuccessorId(UUID successorId) {
        this.successorId = successorId;
    }

    public String getDependencyType() {
        return dependencyType;
    }

    public void setDependencyType(String dependencyType) {
        this.dependencyType = dependencyType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

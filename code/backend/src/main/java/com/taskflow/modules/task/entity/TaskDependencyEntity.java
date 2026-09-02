package com.taskflow.modules.task.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "task_dependencies")
public class TaskDependencyEntity extends BaseEntity {

    @Column(name = "predecessor_id", nullable = false)
    private UUID predecessorId;

    @Column(name = "successor_id", nullable = false)
    private UUID successorId;

    @Column(name = "dependency_type", nullable = false, length = 50)
    private String dependencyType = "FINISH_TO_START";

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public TaskDependencyEntity() {
    }

    public TaskDependencyEntity(UUID predecessorId, UUID successorId, String dependencyType) {
        this.predecessorId = predecessorId;
        this.successorId = successorId;
        this.dependencyType = dependencyType != null ? dependencyType : "FINISH_TO_START";
        this.isDeleted = false;
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

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}

package com.taskflow.modules.tag.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "task_tags")
@IdClass(TaskTagId.class)
public class TaskTagEntity {

    @Id
    @Column(name = "task_id", nullable = false)
    private UUID taskId;

    @Id
    @Column(name = "tag_id", nullable = false)
    private UUID tagId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "created_by")
    private UUID createdBy;

    public TaskTagEntity() {
    }

    public TaskTagEntity(UUID taskId, UUID tagId, UUID createdBy) {
        this.taskId = taskId;
        this.tagId = tagId;
        this.createdBy = createdBy;
        this.createdAt = Instant.now();
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getTagId() {
        return tagId;
    }

    public void setTagId(UUID tagId) {
        this.tagId = tagId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
}

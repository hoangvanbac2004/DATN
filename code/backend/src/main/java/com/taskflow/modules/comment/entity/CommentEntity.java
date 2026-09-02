package com.taskflow.modules.comment.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "comments")
public class CommentEntity extends BaseEntity {

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "task_id", nullable = false)
    private UUID taskId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "mentioned_user_ids", columnDefinition = "TEXT")
    private String mentionedUserIds;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public CommentEntity() {
    }

    public CommentEntity(String content, UUID taskId, UUID userId, String mentionedUserIds) {
        this.content = content;
        this.taskId = taskId;
        this.userId = userId;
        this.mentionedUserIds = mentionedUserIds;
        this.isDeleted = false;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public String getMentionedUserIds() {
        return mentionedUserIds;
    }

    public void setMentionedUserIds(String mentionedUserIds) {
        this.mentionedUserIds = mentionedUserIds;
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

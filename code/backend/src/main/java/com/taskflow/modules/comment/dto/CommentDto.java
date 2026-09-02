package com.taskflow.modules.comment.dto;

import com.taskflow.modules.user.dto.UserDto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class CommentDto {

    private UUID id;
    private String content;
    private UUID taskId;
    private UUID userId;
    private UserDto author;
    private List<UUID> mentionedUserIds;
    private Instant createdAt;
    private Instant updatedAt;

    public CommentDto() {
    }

    public CommentDto(UUID id, String content, UUID taskId, UUID userId, UserDto author, List<UUID> mentionedUserIds, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.content = content;
        this.taskId = taskId;
        this.userId = userId;
        this.author = author;
        this.mentionedUserIds = mentionedUserIds;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public UserDto getAuthor() {
        return author;
    }

    public void setAuthor(UserDto author) {
        this.author = author;
    }

    public List<UUID> getMentionedUserIds() {
        return mentionedUserIds;
    }

    public void setMentionedUserIds(List<UUID> mentionedUserIds) {
        this.mentionedUserIds = mentionedUserIds;
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

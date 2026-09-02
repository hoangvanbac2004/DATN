package com.taskflow.modules.notification.dto;

import java.time.Instant;
import java.util.UUID;

public class NotificationDto {

    private UUID id;
    private String title;
    private String message;
    private UUID userId;
    private String type;
    private String link;
    private Boolean isRead;
    private Instant readAt;
    private Instant createdAt;

    public NotificationDto() {
    }

    public NotificationDto(UUID id, String title, String message, UUID userId, String type, String link, Boolean isRead, Instant readAt, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.userId = userId;
        this.type = type;
        this.link = link;
        this.isRead = isRead;
        this.readAt = readAt;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

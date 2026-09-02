package com.taskflow.modules.notification.event;

import java.time.Instant;
import java.util.UUID;

public class NotificationCreatedEvent {

    private final UUID notificationId;
    private final UUID userId;
    private final String title;
    private final String message;
    private final String type;
    private final String link;
    private final Instant createdAt;

    public NotificationCreatedEvent(UUID notificationId, UUID userId, String title, String message, String type, String link, Instant createdAt) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.link = link;
        this.createdAt = createdAt;
    }

    public UUID getNotificationId() {
        return notificationId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }

    public String getLink() {
        return link;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

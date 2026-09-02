package com.taskflow.modules.reminder.event;

import java.time.Instant;
import java.util.UUID;

public class ReminderTriggeredEvent {

    private final UUID reminderId;
    private final UUID taskId;
    private final UUID userId;
    private final Instant remindAt;
    private final String type;

    public ReminderTriggeredEvent(UUID reminderId, UUID taskId, UUID userId, Instant remindAt, String type) {
        this.reminderId = reminderId;
        this.taskId = taskId;
        this.userId = userId;
        this.remindAt = remindAt;
        this.type = type;
    }

    public UUID getReminderId() {
        return reminderId;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public UUID getUserId() {
        return userId;
    }

    public Instant getRemindAt() {
        return remindAt;
    }

    public String getType() {
        return type;
    }
}

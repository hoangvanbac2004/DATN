package com.taskflow.modules.reminder.dto;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class UpdateReminderRequest {

    @NotNull(message = "Reminder date and time must not be null")
    private Instant remindAt;

    private String status;
    private String type;

    public UpdateReminderRequest() {
    }

    public UpdateReminderRequest(Instant remindAt, String status, String type) {
        this.remindAt = remindAt;
        this.status = status;
        this.type = type;
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
}

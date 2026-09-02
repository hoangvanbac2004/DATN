package com.taskflow.modules.reminder.dto;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class CreateReminderRequest {

    @NotNull(message = "Reminder date and time must not be null")
    private Instant remindAt;

    private String type = "SYSTEM";

    public CreateReminderRequest() {
    }

    public CreateReminderRequest(Instant remindAt, String type) {
        this.remindAt = remindAt;
        this.type = (type != null && !type.isBlank()) ? type : "SYSTEM";
    }

    public Instant getRemindAt() {
        return remindAt;
    }

    public void setRemindAt(Instant remindAt) {
        this.remindAt = remindAt;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}

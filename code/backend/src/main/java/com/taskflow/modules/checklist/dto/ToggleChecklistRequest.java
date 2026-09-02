package com.taskflow.modules.checklist.dto;

import jakarta.validation.constraints.NotNull;

public class ToggleChecklistRequest {

    @NotNull(message = "Completed status must not be null")
    private Boolean completed;

    public ToggleChecklistRequest() {
    }

    public ToggleChecklistRequest(Boolean completed) {
        this.completed = completed;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}

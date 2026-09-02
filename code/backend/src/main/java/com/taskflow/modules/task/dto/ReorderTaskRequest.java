package com.taskflow.modules.task.dto;

import jakarta.validation.constraints.NotNull;

public class ReorderTaskRequest {

    @NotNull(message = "Position is required")
    private Double position;

    public ReorderTaskRequest() {
    }

    public ReorderTaskRequest(Double position) {
        this.position = position;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }
}

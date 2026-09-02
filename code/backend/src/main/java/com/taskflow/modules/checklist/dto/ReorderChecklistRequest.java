package com.taskflow.modules.checklist.dto;

import jakarta.validation.constraints.NotNull;

public class ReorderChecklistRequest {

    @NotNull(message = "Position must not be null")
    private Double position;

    public ReorderChecklistRequest() {
    }

    public ReorderChecklistRequest(Double position) {
        this.position = position;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }
}

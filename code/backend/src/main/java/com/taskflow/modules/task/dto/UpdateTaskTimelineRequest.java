package com.taskflow.modules.task.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class UpdateTaskTimelineRequest {

    @NotNull(message = "Start date must not be null")
    private Instant startDate;

    @NotNull(message = "Due date must not be null")
    private Instant dueDate;

    public UpdateTaskTimelineRequest() {
    }

    public UpdateTaskTimelineRequest(Instant startDate, Instant dueDate) {
        this.startDate = startDate;
        this.dueDate = dueDate;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }
}

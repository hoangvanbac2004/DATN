package com.taskflow.modules.board.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class MoveTaskRequest {

    @NotNull(message = "Task ID must not be null")
    private UUID taskId;

    @NotNull(message = "Target column ID must not be null")
    private UUID targetColumnId;

    @NotNull(message = "Target position must not be null")
    private Double targetPosition;

    public MoveTaskRequest() {
    }

    public MoveTaskRequest(UUID taskId, UUID targetColumnId, Double targetPosition) {
        this.taskId = taskId;
        this.targetColumnId = targetColumnId;
        this.targetPosition = targetPosition;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getTargetColumnId() {
        return targetColumnId;
    }

    public void setTargetColumnId(UUID targetColumnId) {
        this.targetColumnId = targetColumnId;
    }

    public Double getTargetPosition() {
        return targetPosition;
    }

    public void setTargetPosition(Double targetPosition) {
        this.targetPosition = targetPosition;
    }
}

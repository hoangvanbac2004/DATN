package com.taskflow.modules.task.dto;

import java.util.UUID;

public class AssignTaskRequest {

    private UUID assigneeId;

    public AssignTaskRequest() {
    }

    public AssignTaskRequest(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }
}

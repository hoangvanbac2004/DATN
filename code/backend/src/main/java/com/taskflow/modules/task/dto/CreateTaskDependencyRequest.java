package com.taskflow.modules.task.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateTaskDependencyRequest {

    @NotNull(message = "Predecessor ID must not be null")
    private UUID predecessorId;

    @NotNull(message = "Successor ID must not be null")
    private UUID successorId;

    private String dependencyType = "FINISH_TO_START";

    public CreateTaskDependencyRequest() {
    }

    public CreateTaskDependencyRequest(UUID predecessorId, UUID successorId, String dependencyType) {
        this.predecessorId = predecessorId;
        this.successorId = successorId;
        this.dependencyType = dependencyType != null ? dependencyType : "FINISH_TO_START";
    }

    public UUID getPredecessorId() {
        return predecessorId;
    }

    public void setPredecessorId(UUID predecessorId) {
        this.predecessorId = predecessorId;
    }

    public UUID getSuccessorId() {
        return successorId;
    }

    public void setSuccessorId(UUID successorId) {
        this.successorId = successorId;
    }

    public String getDependencyType() {
        return dependencyType;
    }

    public void setDependencyType(String dependencyType) {
        this.dependencyType = dependencyType;
    }
}

package com.taskflow.modules.whiteboard.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateWhiteboardRequest {

    @NotBlank(message = "Title must not be blank")
    private String title;

    private String description;
    private UUID projectId;
    private String backgroundColor = "#0f172a";

    public CreateWhiteboardRequest() {
    }

    public CreateWhiteboardRequest(String title, String description, UUID projectId, String backgroundColor) {
        this.title = title;
        this.description = description;
        this.projectId = projectId;
        this.backgroundColor = backgroundColor != null ? backgroundColor : "#0f172a";
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }
}

package com.taskflow.modules.whiteboard.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateWhiteboardRequest {

    @NotBlank(message = "Title must not be blank")
    private String title;

    private String description;
    private String backgroundColor;

    public UpdateWhiteboardRequest() {
    }

    public UpdateWhiteboardRequest(String title, String description, String backgroundColor) {
        this.title = title;
        this.description = description;
        this.backgroundColor = backgroundColor;
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

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }
}

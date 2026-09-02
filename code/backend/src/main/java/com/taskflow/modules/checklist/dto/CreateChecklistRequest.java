package com.taskflow.modules.checklist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateChecklistRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    private Boolean completed = false;
    private Double position;

    public CreateChecklistRequest() {
    }

    public CreateChecklistRequest(String title, Boolean completed, Double position) {
        this.title = title;
        this.completed = completed != null ? completed : false;
        this.position = position;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }
}

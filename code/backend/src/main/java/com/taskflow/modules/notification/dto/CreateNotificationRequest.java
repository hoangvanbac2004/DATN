package com.taskflow.modules.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateNotificationRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Message must not be blank")
    private String message;

    @NotNull(message = "User ID must not be null")
    private UUID userId;

    private String type = "SYSTEM";
    private String link;

    public CreateNotificationRequest() {
    }

    public CreateNotificationRequest(String title, String message, UUID userId, String type, String link) {
        this.title = title;
        this.message = message;
        this.userId = userId;
        this.type = (type != null && !type.isBlank()) ? type : "SYSTEM";
        this.link = link;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}

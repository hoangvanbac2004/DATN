package com.taskflow.modules.dashboard.dto;

import java.time.Instant;
import java.util.UUID;

public class ActivityItemDto {
    private UUID id;
    private String type;
    private String title;
    private String description;
    private Instant timestamp;

    public ActivityItemDto() {
    }

    public ActivityItemDto(UUID id, String type, String title, String description, Instant timestamp) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.timestamp = timestamp;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}

package com.taskflow.modules.tag.dto;

import java.time.Instant;
import java.util.UUID;

public class TagDto {

    private UUID id;
    private String name;
    private String color;
    private UUID workspaceId;
    private Instant createdAt;
    private Instant updatedAt;

    public TagDto() {
    }

    public TagDto(UUID id, String name, String color, UUID workspaceId, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.workspaceId = workspaceId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}

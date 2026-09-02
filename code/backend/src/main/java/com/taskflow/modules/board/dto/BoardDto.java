package com.taskflow.modules.board.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BoardDto {
    private UUID id;
    private String name;
    private String description;
    private UUID projectId;
    private BoardSettingsDto settings;
    private List<BoardColumnDto> columns = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public BoardDto() {
    }

    public BoardDto(UUID id, String name, String description, UUID projectId, BoardSettingsDto settings, List<BoardColumnDto> columns, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.projectId = projectId;
        this.settings = settings;
        this.columns = columns != null ? columns : new ArrayList<>();
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

    public BoardSettingsDto getSettings() {
        return settings;
    }

    public void setSettings(BoardSettingsDto settings) {
        this.settings = settings;
    }

    public List<BoardColumnDto> getColumns() {
        return columns;
    }

    public void setColumns(List<BoardColumnDto> columns) {
        this.columns = columns;
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

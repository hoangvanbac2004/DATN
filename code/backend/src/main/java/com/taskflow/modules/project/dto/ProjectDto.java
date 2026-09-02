package com.taskflow.modules.project.dto;

import java.time.Instant;
import java.util.UUID;

public class ProjectDto {
    private UUID id;
    private String name;
    private String description;
    private UUID workspaceId;
    private String color;
    private String icon;
    private Boolean isArchived;
    private Boolean isFavorite;
    private ProjectStatsDto statistics;
    private Instant createdAt;
    private Instant updatedAt;

    public ProjectDto() {
    }

    public ProjectDto(UUID id, String name, String description, UUID workspaceId, String color, String icon, Boolean isArchived, Boolean isFavorite, ProjectStatsDto statistics, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.workspaceId = workspaceId;
        this.color = color;
        this.icon = icon;
        this.isArchived = isArchived;
        this.isFavorite = isFavorite;
        this.statistics = statistics;
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

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public ProjectStatsDto getStatistics() {
        return statistics;
    }

    public void setStatistics(ProjectStatsDto statistics) {
        this.statistics = statistics;
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

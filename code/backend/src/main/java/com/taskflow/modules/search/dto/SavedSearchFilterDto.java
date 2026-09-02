package com.taskflow.modules.search.dto;

import java.time.Instant;
import java.util.UUID;

public class SavedSearchFilterDto {
    private UUID id;
    private UUID userId;
    private UUID workspaceId;
    private String name;
    private String query;
    private String filterConfigJson;
    private Boolean isPinned;
    private Instant createdAt;

    public SavedSearchFilterDto() {
    }

    public SavedSearchFilterDto(UUID id, UUID userId, UUID workspaceId, String name, String query, String filterConfigJson, Boolean isPinned, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.workspaceId = workspaceId;
        this.name = name;
        this.query = query;
        this.filterConfigJson = filterConfigJson;
        this.isPinned = isPinned;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getFilterConfigJson() {
        return filterConfigJson;
    }

    public void setFilterConfigJson(String filterConfigJson) {
        this.filterConfigJson = filterConfigJson;
    }

    public Boolean getIsPinned() {
        return isPinned;
    }

    public void setIsPinned(Boolean pinned) {
        isPinned = pinned;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

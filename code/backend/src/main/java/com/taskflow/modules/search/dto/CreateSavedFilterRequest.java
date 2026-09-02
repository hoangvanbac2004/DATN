package com.taskflow.modules.search.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateSavedFilterRequest {

    @NotBlank(message = "Name must not be blank")
    private String name;

    private String query;

    @NotBlank(message = "Filter config JSON must not be blank")
    private String filterConfigJson;

    private UUID workspaceId;
    private Boolean isPinned = false;

    public CreateSavedFilterRequest() {
    }

    public CreateSavedFilterRequest(String name, String query, String filterConfigJson, UUID workspaceId, Boolean isPinned) {
        this.name = name;
        this.query = query;
        this.filterConfigJson = filterConfigJson;
        this.workspaceId = workspaceId;
        this.isPinned = isPinned != null ? isPinned : false;
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

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public Boolean getIsPinned() {
        return isPinned;
    }

    public void setIsPinned(Boolean pinned) {
        isPinned = pinned;
    }
}

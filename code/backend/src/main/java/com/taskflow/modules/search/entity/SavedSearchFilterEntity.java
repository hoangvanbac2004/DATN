package com.taskflow.modules.search.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "saved_search_filters")
public class SavedSearchFilterEntity extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "workspace_id")
    private UUID workspaceId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "query")
    private String query;

    @Column(name = "filter_config_json", nullable = false, columnDefinition = "TEXT")
    private String filterConfigJson;

    @Column(name = "is_pinned", nullable = false)
    private Boolean isPinned = false;

    public SavedSearchFilterEntity() {
    }

    public SavedSearchFilterEntity(UUID userId, UUID workspaceId, String name, String query, String filterConfigJson, Boolean isPinned) {
        this.userId = userId;
        this.workspaceId = workspaceId;
        this.name = name;
        this.query = query;
        this.filterConfigJson = filterConfigJson;
        this.isPinned = isPinned != null ? isPinned : false;
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
}

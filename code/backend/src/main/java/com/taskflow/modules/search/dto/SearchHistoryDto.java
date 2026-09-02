package com.taskflow.modules.search.dto;

import java.time.Instant;
import java.util.UUID;

public class SearchHistoryDto {
    private UUID id;
    private UUID userId;
    private String query;
    private String entityType;
    private Instant createdAt;

    public SearchHistoryDto() {
    }

    public SearchHistoryDto(UUID id, UUID userId, String query, String entityType, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.query = query;
        this.entityType = entityType;
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

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

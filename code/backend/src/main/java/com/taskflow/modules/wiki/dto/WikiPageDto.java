package com.taskflow.modules.wiki.dto;

import java.time.Instant;
import java.util.UUID;

public class WikiPageDto {
    private UUID id;
    private UUID workspaceId;
    private UUID projectId;
    private UUID parentPageId;
    private String title;
    private String slug;
    private String content;
    private String icon;
    private Integer version;
    private Boolean isArchived;
    private Instant createdAt;
    private Instant updatedAt;
    private UUID createdBy;

    public WikiPageDto() {
    }

    public WikiPageDto(UUID id, UUID workspaceId, UUID projectId, UUID parentPageId, String title, String slug, String content, String icon, Integer version, Boolean isArchived, Instant createdAt, Instant updatedAt, UUID createdBy) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.parentPageId = parentPageId;
        this.title = title;
        this.slug = slug;
        this.content = content;
        this.icon = icon;
        this.version = version;
        this.isArchived = isArchived;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getParentPageId() {
        return parentPageId;
    }

    public void setParentPageId(UUID parentPageId) {
        this.parentPageId = parentPageId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(Boolean archived) {
        isArchived = archived;
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

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
}

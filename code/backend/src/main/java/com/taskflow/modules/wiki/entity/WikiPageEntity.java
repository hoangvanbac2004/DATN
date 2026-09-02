package com.taskflow.modules.wiki.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "wiki_pages")
public class WikiPageEntity extends BaseEntity {

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "parent_page_id")
    private UUID parentPageId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "icon", nullable = false, length = 50)
    private String icon = "FileText";

    @Column(name = "version", nullable = false)
    private Integer version = 1;

    @Column(name = "is_archived", nullable = false)
    private Boolean isArchived = false;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public WikiPageEntity() {
    }

    public WikiPageEntity(UUID workspaceId, UUID projectId, UUID parentPageId, String title, String slug, String content, String icon) {
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.parentPageId = parentPageId;
        this.title = title;
        this.slug = slug;
        this.content = content;
        this.icon = icon != null ? icon : "FileText";
        this.version = 1;
        this.isArchived = false;
        this.isDeleted = false;
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

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}

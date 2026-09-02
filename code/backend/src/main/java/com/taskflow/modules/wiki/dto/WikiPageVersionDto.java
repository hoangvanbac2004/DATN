package com.taskflow.modules.wiki.dto;

import java.time.Instant;
import java.util.UUID;

public class WikiPageVersionDto {
    private UUID id;
    private UUID pageId;
    private Integer version;
    private String title;
    private String content;
    private String changeSummary;
    private Instant createdAt;
    private UUID createdBy;

    public WikiPageVersionDto() {
    }

    public WikiPageVersionDto(UUID id, UUID pageId, Integer version, String title, String content, String changeSummary, Instant createdAt, UUID createdBy) {
        this.id = id;
        this.pageId = pageId;
        this.version = version;
        this.title = title;
        this.content = content;
        this.changeSummary = changeSummary;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPageId() {
        return pageId;
    }

    public void setPageId(UUID pageId) {
        this.pageId = pageId;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getChangeSummary() {
        return changeSummary;
    }

    public void setChangeSummary(String changeSummary) {
        this.changeSummary = changeSummary;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
}

package com.taskflow.modules.wiki.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class WikiPageTreeNodeDto {
    private UUID id;
    private UUID parentPageId;
    private String title;
    private String slug;
    private String icon;
    private List<WikiPageTreeNodeDto> children = new ArrayList<>();

    public WikiPageTreeNodeDto() {
    }

    public WikiPageTreeNodeDto(UUID id, UUID parentPageId, String title, String slug, String icon) {
        this.id = id;
        this.parentPageId = parentPageId;
        this.title = title;
        this.slug = slug;
        this.icon = icon;
        this.children = new ArrayList<>();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public List<WikiPageTreeNodeDto> getChildren() {
        return children;
    }

    public void setChildren(List<WikiPageTreeNodeDto> children) {
        this.children = children;
    }
}

package com.taskflow.modules.wiki.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateWikiPageRequest {

    @NotBlank(message = "Title must not be blank")
    private String title;

    private String content;
    private UUID parentPageId;
    private UUID projectId;
    private String icon = "FileText";

    public CreateWikiPageRequest() {
    }

    public CreateWikiPageRequest(String title, String content, UUID parentPageId, UUID projectId, String icon) {
        this.title = title;
        this.content = content;
        this.parentPageId = parentPageId;
        this.projectId = projectId;
        this.icon = icon != null ? icon : "FileText";
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

    public UUID getParentPageId() {
        return parentPageId;
    }

    public void setParentPageId(UUID parentPageId) {
        this.parentPageId = parentPageId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}

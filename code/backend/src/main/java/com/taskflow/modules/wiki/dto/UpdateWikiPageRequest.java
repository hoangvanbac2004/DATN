package com.taskflow.modules.wiki.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateWikiPageRequest {

    @NotBlank(message = "Title must not be blank")
    private String title;

    private String content;
    private String changeSummary;
    private String icon;

    public UpdateWikiPageRequest() {
    }

    public UpdateWikiPageRequest(String title, String content, String changeSummary, String icon) {
        this.title = title;
        this.content = content;
        this.changeSummary = changeSummary;
        this.icon = icon;
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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}

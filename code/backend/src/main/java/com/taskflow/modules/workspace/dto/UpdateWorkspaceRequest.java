package com.taskflow.modules.workspace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateWorkspaceRequest {

    @NotBlank(message = "Workspace name is required")
    @Size(min = 2, max = 100, message = "Workspace name must be between 2 and 100 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 500, message = "Icon URL must not exceed 500 characters")
    private String iconUrl;

    @Size(max = 50, message = "Theme color must not exceed 50 characters")
    private String themeColor;

    public UpdateWorkspaceRequest() {
    }

    public UpdateWorkspaceRequest(String name, String description, String iconUrl, String themeColor) {
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.themeColor = themeColor;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }
}

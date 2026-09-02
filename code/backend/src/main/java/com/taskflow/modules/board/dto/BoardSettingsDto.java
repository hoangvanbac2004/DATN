package com.taskflow.modules.board.dto;

public class BoardSettingsDto {
    private Integer columnWidth = 280;
    private Boolean showTaskCount = true;
    private Boolean allowWipLimits = false;
    private String defaultColor = "#6366f1";

    public BoardSettingsDto() {
    }

    public BoardSettingsDto(Integer columnWidth, Boolean showTaskCount, Boolean allowWipLimits, String defaultColor) {
        this.columnWidth = columnWidth != null ? columnWidth : 280;
        this.showTaskCount = showTaskCount != null ? showTaskCount : true;
        this.allowWipLimits = allowWipLimits != null ? allowWipLimits : false;
        this.defaultColor = defaultColor != null ? defaultColor : "#6366f1";
    }

    public Integer getColumnWidth() {
        return columnWidth;
    }

    public void setColumnWidth(Integer columnWidth) {
        this.columnWidth = columnWidth;
    }

    public Boolean getShowTaskCount() {
        return showTaskCount;
    }

    public void setShowTaskCount(Boolean showTaskCount) {
        this.showTaskCount = showTaskCount;
    }

    public Boolean getAllowWipLimits() {
        return allowWipLimits;
    }

    public void setAllowWipLimits(Boolean allowWipLimits) {
        this.allowWipLimits = allowWipLimits;
    }

    public String getDefaultColor() {
        return defaultColor;
    }

    public void setDefaultColor(String defaultColor) {
        this.defaultColor = defaultColor;
    }
}

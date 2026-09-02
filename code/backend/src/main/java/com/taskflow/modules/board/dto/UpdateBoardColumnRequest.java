package com.taskflow.modules.board.dto;

import jakarta.validation.constraints.Size;

public class UpdateBoardColumnRequest {

    @Size(max = 100, message = "Column name must not exceed 100 characters")
    private String name;

    private String color;

    private Integer wipLimit;

    private Boolean isCollapsed;

    public UpdateBoardColumnRequest() {
    }

    public UpdateBoardColumnRequest(String name, String color, Integer wipLimit, Boolean isCollapsed) {
        this.name = name;
        this.color = color;
        this.wipLimit = wipLimit;
        this.isCollapsed = isCollapsed;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getWipLimit() {
        return wipLimit;
    }

    public void setWipLimit(Integer wipLimit) {
        this.wipLimit = wipLimit;
    }

    public Boolean getIsCollapsed() {
        return isCollapsed;
    }

    public void setIsCollapsed(Boolean isCollapsed) {
        this.isCollapsed = isCollapsed;
    }
}

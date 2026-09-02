package com.taskflow.modules.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateBoardColumnRequest {

    @NotBlank(message = "Column name must not be blank")
    @Size(max = 100, message = "Column name must not exceed 100 characters")
    private String name;

    private String color = "#64748b";

    private Double position;

    private Integer wipLimit = 0;

    public CreateBoardColumnRequest() {
    }

    public CreateBoardColumnRequest(String name, String color, Double position, Integer wipLimit) {
        this.name = name;
        this.color = color;
        this.position = position;
        this.wipLimit = wipLimit;
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

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }

    public Integer getWipLimit() {
        return wipLimit;
    }

    public void setWipLimit(Integer wipLimit) {
        this.wipLimit = wipLimit;
    }
}

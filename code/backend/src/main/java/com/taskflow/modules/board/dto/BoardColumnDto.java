package com.taskflow.modules.board.dto;

import com.taskflow.modules.task.dto.TaskDto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BoardColumnDto {
    private UUID id;
    private UUID boardId;
    private String name;
    private String color;
    private Double position;
    private Integer wipLimit;
    private Boolean isCollapsed;
    private List<TaskDto> tasks = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public BoardColumnDto() {
    }

    public BoardColumnDto(UUID id, UUID boardId, String name, String color, Double position, Integer wipLimit, Boolean isCollapsed, List<TaskDto> tasks, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.boardId = boardId;
        this.name = name;
        this.color = color;
        this.position = position;
        this.wipLimit = wipLimit;
        this.isCollapsed = isCollapsed;
        this.tasks = tasks != null ? tasks : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getBoardId() {
        return boardId;
    }

    public void setBoardId(UUID boardId) {
        this.boardId = boardId;
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

    public Boolean getIsCollapsed() {
        return isCollapsed;
    }

    public void setIsCollapsed(Boolean isCollapsed) {
        this.isCollapsed = isCollapsed;
    }

    public List<TaskDto> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDto> tasks) {
        this.tasks = tasks;
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
}

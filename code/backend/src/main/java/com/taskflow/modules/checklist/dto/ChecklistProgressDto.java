package com.taskflow.modules.checklist.dto;

import java.util.UUID;

public class ChecklistProgressDto {

    private UUID taskId;
    private long totalItems;
    private long completedItems;
    private double percentage;

    public ChecklistProgressDto() {
    }

    public ChecklistProgressDto(UUID taskId, long totalItems, long completedItems, double percentage) {
        this.taskId = taskId;
        this.totalItems = totalItems;
        this.completedItems = completedItems;
        this.percentage = percentage;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public long getCompletedItems() {
        return completedItems;
    }

    public void setCompletedItems(long completedItems) {
        this.completedItems = completedItems;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}

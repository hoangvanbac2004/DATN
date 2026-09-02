package com.taskflow.modules.dashboard.dto;

public class ProductivityStatsDto {
    private String date;
    private long completedCount;
    private long createdCount;

    public ProductivityStatsDto() {
    }

    public ProductivityStatsDto(String date, long completedCount, long createdCount) {
        this.date = date;
        this.completedCount = completedCount;
        this.createdCount = createdCount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public long getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(long completedCount) {
        this.completedCount = completedCount;
    }

    public long getCreatedCount() {
        return createdCount;
    }

    public void setCreatedCount(long createdCount) {
        this.createdCount = createdCount;
    }
}

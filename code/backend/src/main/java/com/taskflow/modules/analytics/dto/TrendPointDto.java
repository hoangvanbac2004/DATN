package com.taskflow.modules.analytics.dto;

public class TrendPointDto {

    private String dateLabel;
    private long completedCount;
    private long createdCount;

    public TrendPointDto() {
    }

    public TrendPointDto(String dateLabel, long completedCount, long createdCount) {
        this.dateLabel = dateLabel;
        this.completedCount = completedCount;
        this.createdCount = createdCount;
    }

    public String getDateLabel() {
        return dateLabel;
    }

    public void setDateLabel(String dateLabel) {
        this.dateLabel = dateLabel;
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

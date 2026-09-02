package com.taskflow.modules.dashboard.dto;

import java.util.List;

public class DashboardSummaryDto {
    private long todayTasksCount;
    private long upcomingTasksCount;
    private long overdueTasksCount;
    private long completedTasksCount;
    private long totalTasksCount;
    private double completionRate;
    private List<ActivityItemDto> recentActivities;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(long todayTasksCount, long upcomingTasksCount, long overdueTasksCount, long completedTasksCount, long totalTasksCount, double completionRate, List<ActivityItemDto> recentActivities) {
        this.todayTasksCount = todayTasksCount;
        this.upcomingTasksCount = upcomingTasksCount;
        this.overdueTasksCount = overdueTasksCount;
        this.completedTasksCount = completedTasksCount;
        this.totalTasksCount = totalTasksCount;
        this.completionRate = completionRate;
        this.recentActivities = recentActivities;
    }

    public long getTodayTasksCount() {
        return todayTasksCount;
    }

    public void setTodayTasksCount(long todayTasksCount) {
        this.todayTasksCount = todayTasksCount;
    }

    public long getUpcomingTasksCount() {
        return upcomingTasksCount;
    }

    public void setUpcomingTasksCount(long upcomingTasksCount) {
        this.upcomingTasksCount = upcomingTasksCount;
    }

    public long getOverdueTasksCount() {
        return overdueTasksCount;
    }

    public void setOverdueTasksCount(long overdueTasksCount) {
        this.overdueTasksCount = overdueTasksCount;
    }

    public long getCompletedTasksCount() {
        return completedTasksCount;
    }

    public void setCompletedTasksCount(long completedTasksCount) {
        this.completedTasksCount = completedTasksCount;
    }

    public long getTotalTasksCount() {
        return totalTasksCount;
    }

    public void setTotalTasksCount(long totalTasksCount) {
        this.totalTasksCount = totalTasksCount;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public List<ActivityItemDto> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ActivityItemDto> recentActivities) {
        this.recentActivities = recentActivities;
    }
}

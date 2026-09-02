package com.taskflow.modules.analytics.dto;

import java.util.List;
import java.util.Map;

public class ProductivityOverviewDto {

    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    private long pendingTasks;
    private double completionRate; // 0.0 to 100.0
    private String period; // DAILY, WEEKLY, MONTHLY
    private List<TrendPointDto> trendPoints;
    private Map<String, Long> statusBreakdown;
    private Map<String, Long> priorityBreakdown;

    public ProductivityOverviewDto() {
    }

    public ProductivityOverviewDto(long totalTasks, long completedTasks, long overdueTasks, long pendingTasks, double completionRate, String period, List<TrendPointDto> trendPoints, Map<String, Long> statusBreakdown, Map<String, Long> priorityBreakdown) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.overdueTasks = overdueTasks;
        this.pendingTasks = pendingTasks;
        this.completionRate = completionRate;
        this.period = period;
        this.trendPoints = trendPoints;
        this.statusBreakdown = statusBreakdown;
        this.priorityBreakdown = priorityBreakdown;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public List<TrendPointDto> getTrendPoints() {
        return trendPoints;
    }

    public void setTrendPoints(List<TrendPointDto> trendPoints) {
        this.trendPoints = trendPoints;
    }

    public Map<String, Long> getStatusBreakdown() {
        return statusBreakdown;
    }

    public void setStatusBreakdown(Map<String, Long> statusBreakdown) {
        this.statusBreakdown = statusBreakdown;
    }

    public Map<String, Long> getPriorityBreakdown() {
        return priorityBreakdown;
    }

    public void setPriorityBreakdown(Map<String, Long> priorityBreakdown) {
        this.priorityBreakdown = priorityBreakdown;
    }
}

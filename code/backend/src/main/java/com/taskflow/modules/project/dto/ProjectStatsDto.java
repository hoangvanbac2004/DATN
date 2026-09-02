package com.taskflow.modules.project.dto;

public class ProjectStatsDto {
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private double progressPercentage;

    public ProjectStatsDto() {
    }

    public ProjectStatsDto(long totalTasks, long completedTasks, long inProgressTasks, double progressPercentage) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.progressPercentage = progressPercentage;
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

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}

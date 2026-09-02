package com.taskflow.modules.dashboard.service;

import com.taskflow.modules.dashboard.dto.DashboardSummaryDto;
import com.taskflow.modules.dashboard.dto.ProductivityStatsDto;
import com.taskflow.modules.task.dto.TaskDto;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for calculating personal productivity dashboard metrics, task focus lists, and activity streams.
 */
public interface DashboardService {

    /**
     * Calculates aggregated metrics (today count, upcoming count, overdue count, completed count, completion rate, recent activity).
     *
     * @param userId UUID identifier of the user
     * @return DashboardSummaryDto containing high-level statistics
     */
    DashboardSummaryDto getDashboardSummary(UUID userId);

    /**
     * Retrieves all tasks due today across user's accessible workspaces.
     *
     * @param userId UUID identifier of the user
     * @return list of TaskDto instances
     */
    List<TaskDto> getTodayTasks(UUID userId);

    /**
     * Retrieves upcoming tasks due within the next 7 days.
     *
     * @param userId UUID identifier of the user
     * @return list of TaskDto instances
     */
    List<TaskDto> getUpcomingTasks(UUID userId);

    /**
     * Retrieves overdue tasks that are past due date and not completed.
     *
     * @param userId UUID identifier of the user
     * @return list of TaskDto instances
     */
    List<TaskDto> getOverdueTasks(UUID userId);

    /**
     * Calculates 7-day daily completed vs created task trends for productivity charts.
     *
     * @param userId UUID identifier of the user
     * @return list of ProductivityStatsDto instances
     */
    List<ProductivityStatsDto> getProductivityStats(UUID userId);
}

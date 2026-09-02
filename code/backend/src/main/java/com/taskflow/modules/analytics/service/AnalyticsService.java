package com.taskflow.modules.analytics.service;

import com.taskflow.modules.analytics.dto.ProductivityOverviewDto;

import java.util.UUID;

/**
 * Domain Service interface for calculating productivity metrics, task completion trends, and status breakdowns.
 */
public interface AnalyticsService {

    /**
     * Calculates productivity overview metrics.
     *
     * @param userId      UUID identifier of requesting user
     * @param workspaceId optional workspace scope
     * @param projectId   optional project scope
     * @param period      DAILY, WEEKLY, or MONTHLY aggregation window
     * @return ProductivityOverviewDto payload
     */
    ProductivityOverviewDto getProductivityOverview(UUID userId, UUID workspaceId, UUID projectId, String period);
}

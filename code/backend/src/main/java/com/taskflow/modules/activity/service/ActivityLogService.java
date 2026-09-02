package com.taskflow.modules.activity.service;

import com.taskflow.common.PageResponse;
import com.taskflow.modules.activity.dto.ActivityLogDto;
import com.taskflow.modules.activity.dto.CreateActivityLogRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Domain Service interface for managing user action logging and activity feeds.
 */
public interface ActivityLogService {

    /**
     * Records a new activity log entry.
     *
     * @param userId  UUID identifier of acting user
     * @param request creation request payload
     * @return ActivityLogDto instance
     */
    ActivityLogDto logActivity(UUID userId, CreateActivityLogRequest request);

    /**
     * Gets paginated activity feed for a user, with optional entityType filter.
     */
    PageResponse<ActivityLogDto> getUserActivities(UUID userId, String entityType, Pageable pageable);

    /**
     * Gets paginated activity feed for a project with optional entityType filter.
     */
    PageResponse<ActivityLogDto> getProjectActivities(UUID userId, UUID projectId, String entityType, Pageable pageable);

    /**
     * Gets paginated activity feed for a workspace with optional entityType filter.
     */
    PageResponse<ActivityLogDto> getWorkspaceActivities(UUID userId, UUID workspaceId, String entityType, Pageable pageable);
}

package com.taskflow.modules.activity.listener;

import com.taskflow.modules.activity.dto.CreateActivityLogRequest;
import com.taskflow.modules.activity.event.ActivityLogEvent;
import com.taskflow.modules.activity.service.ActivityLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class ActivityLogEventListener {

    private static final Logger log = LoggerFactory.getLogger(ActivityLogEventListener.class);

    private final ActivityLogService activityLogService;

    public ActivityLogEventListener(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @Async
    @EventListener
    public void handleActivityLogEvent(ActivityLogEvent event) {
        log.info("Recording activity log for user {} action {} entity {}", event.getUserId(), event.getAction(), event.getEntityType());

        CreateActivityLogRequest request = new CreateActivityLogRequest(
                event.getAction(),
                event.getEntityType(),
                event.getEntityId(),
                event.getDetails(),
                event.getWorkspaceId(),
                event.getProjectId()
        );

        try {
            activityLogService.logActivity(event.getUserId(), request);
        } catch (Exception e) {
            log.error("Failed to record activity log entry", e);
        }
    }
}

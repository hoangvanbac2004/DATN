package com.taskflow.modules.realtime.service;

import com.taskflow.modules.task.dto.TaskDto;

import java.util.List;
import java.util.UUID;

public interface RealtimePublisher {

    void publishTaskEvent(UUID projectId, String eventType, TaskDto task);

    void publishNotificationEvent(UUID userId, String eventType, Object notification);

    void publishPresenceEvent(UUID workspaceId, List<UUID> onlineUserIds);
}

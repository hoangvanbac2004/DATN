package com.taskflow.modules.realtime.service.impl;

import com.taskflow.modules.realtime.dto.PresenceDto;
import com.taskflow.modules.realtime.dto.RealtimeEventDto;
import com.taskflow.modules.realtime.service.RealtimePublisher;
import com.taskflow.modules.task.dto.TaskDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RealtimePublisherImpl implements RealtimePublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public RealtimePublisherImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void publishTaskEvent(UUID projectId, String eventType, TaskDto task) {
        RealtimeEventDto event = new RealtimeEventDto(eventType, projectId.toString(), task);
        messagingTemplate.convertAndSend("/topic/projects/" + projectId + "/tasks", event);
    }

    @Override
    public void publishNotificationEvent(UUID userId, String eventType, Object notification) {
        RealtimeEventDto event = new RealtimeEventDto(eventType, userId.toString(), notification);
        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/notifications", event);
    }

    @Override
    public void publishPresenceEvent(UUID workspaceId, List<UUID> onlineUserIds) {
        PresenceDto presence = new PresenceDto(workspaceId, onlineUserIds);
        messagingTemplate.convertAndSend("/topic/workspaces/" + workspaceId + "/presence", presence);
    }
}

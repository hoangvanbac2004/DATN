package com.taskflow.modules.notification.listener;

import com.taskflow.modules.notification.dto.CreateNotificationRequest;
import com.taskflow.modules.notification.service.NotificationService;
import com.taskflow.modules.reminder.event.ReminderTriggeredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Async
    @EventListener
    public void handleReminderTriggered(ReminderTriggeredEvent event) {
        log.info("Received ReminderTriggeredEvent for user {} and task {}", event.getUserId(), event.getTaskId());

        CreateNotificationRequest request = new CreateNotificationRequest(
                "Task Reminder Due",
                "You have a task reminder scheduled for now.",
                event.getUserId(),
                "REMINDER_TRIGGERED",
                "/tasks/" + event.getTaskId()
        );

        try {
            notificationService.createNotification(request);
        } catch (Exception e) {
            log.error("Failed to create in-app notification for triggered reminder", e);
        }
    }
}

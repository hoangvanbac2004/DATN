package com.taskflow.modules.notification.service;

import com.taskflow.common.PageResponse;
import com.taskflow.modules.notification.dto.CreateNotificationRequest;
import com.taskflow.modules.notification.dto.NotificationDto;
import com.taskflow.modules.notification.dto.UnreadCountDto;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Domain Service interface for managing in-app notifications, read status, and unread counts.
 */
public interface NotificationService {

    /**
     * Creates a new notification.
     *
     * @param request creation request payload
     * @return NotificationDto instance
     */
    NotificationDto createNotification(CreateNotificationRequest request);

    /**
     * Lists paginated notifications for a user.
     *
     * @param userId     UUID identifier of user
     * @param unreadOnly whether to filter only unread notifications
     * @param pageable   pagination parameters
     * @return PageResponse of NotificationDto items
     */
    PageResponse<NotificationDto> getUserNotifications(UUID userId, boolean unreadOnly, Pageable pageable);

    /**
     * Gets unread notification count for a user.
     *
     * @param userId UUID identifier of user
     * @return UnreadCountDto instance
     */
    UnreadCountDto getUnreadCount(UUID userId);

    /**
     * Marks a single notification as read.
     *
     * @param userId         UUID identifier of requesting user
     * @param notificationId UUID identifier of target notification
     * @return updated NotificationDto instance
     */
    NotificationDto markAsRead(UUID userId, UUID notificationId);

    /**
     * Marks all notifications as read for a user.
     *
     * @param userId UUID identifier of requesting user
     */
    void markAllAsRead(UUID userId);

    /**
     * Soft-deletes a notification.
     *
     * @param userId         UUID identifier of requesting user
     * @param notificationId UUID identifier of target notification
     */
    void deleteNotification(UUID userId, UUID notificationId);
}

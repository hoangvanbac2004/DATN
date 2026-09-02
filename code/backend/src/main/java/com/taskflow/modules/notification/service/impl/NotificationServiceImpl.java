package com.taskflow.modules.notification.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.PageResponse;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.notification.dto.CreateNotificationRequest;
import com.taskflow.modules.notification.dto.NotificationDto;
import com.taskflow.modules.notification.dto.UnreadCountDto;
import com.taskflow.modules.notification.entity.NotificationEntity;
import com.taskflow.modules.notification.event.NotificationCreatedEvent;
import com.taskflow.modules.notification.mapper.NotificationMapper;
import com.taskflow.modules.notification.repository.NotificationRepository;
import com.taskflow.modules.notification.service.NotificationService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            ApplicationEventPublisher eventPublisher,
            NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.eventPublisher = eventPublisher;
        this.notificationMapper = notificationMapper;
    }

    @Override
    @Transactional
    public NotificationDto createNotification(CreateNotificationRequest request) {
        NotificationEntity entity = new NotificationEntity(
                request.getTitle().trim(),
                request.getMessage().trim(),
                request.getUserId(),
                request.getType(),
                request.getLink()
        );

        NotificationEntity saved = notificationRepository.save(entity);

        eventPublisher.publishEvent(new NotificationCreatedEvent(
                saved.getId(),
                saved.getUserId(),
                saved.getTitle(),
                saved.getMessage(),
                saved.getType(),
                saved.getLink(),
                saved.getCreatedAt()
        ));

        return notificationMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> getUserNotifications(UUID userId, boolean unreadOnly, Pageable pageable) {
        Page<NotificationEntity> page = unreadOnly
                ? notificationRepository.findByUserIdAndIsReadFalseAndIsDeletedFalseOrderByCreatedAtDesc(userId, pageable)
                : notificationRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId, pageable);

        List<NotificationDto> dtos = page.getContent().stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());

        return PageResponse.<NotificationDto>builder()
                .items(dtos)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UnreadCountDto getUnreadCount(UUID userId) {
        long count = notificationRepository.countByUserIdAndIsReadFalseAndIsDeletedFalse(userId);
        return new UnreadCountDto(count);
    }

    @Override
    @Transactional
    public NotificationDto markAsRead(UUID userId, UUID notificationId) {
        NotificationEntity notification = findActiveNotificationById(notificationId);

        if (!notification.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to modify this notification");
        }

        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notification.setReadAt(Instant.now());
            notification = notificationRepository.save(notification);
        }

        return notificationMapper.toDto(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadForUser(userId, Instant.now());
    }

    @Override
    @Transactional
    public void deleteNotification(UUID userId, UUID notificationId) {
        NotificationEntity notification = findActiveNotificationById(notificationId);

        if (!notification.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to delete this notification");
        }

        notification.setIsDeleted(true);
        notification.setDeletedAt(Instant.now());
        notificationRepository.save(notification);
    }

    private NotificationEntity findActiveNotificationById(UUID notificationId) {
        return notificationRepository.findByIdAndIsDeletedFalse(notificationId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Notification not found"));
    }
}

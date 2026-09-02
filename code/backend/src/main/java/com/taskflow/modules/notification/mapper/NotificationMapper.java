package com.taskflow.modules.notification.mapper;

import com.taskflow.modules.notification.dto.NotificationDto;
import com.taskflow.modules.notification.entity.NotificationEntity;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDto toDto(NotificationEntity entity) {
        if (entity == null) {
            return null;
        }

        return new NotificationDto(
                entity.getId(),
                entity.getTitle(),
                entity.getMessage(),
                entity.getUserId(),
                entity.getType(),
                entity.getLink(),
                entity.getIsRead(),
                entity.getReadAt(),
                entity.getCreatedAt()
        );
    }
}

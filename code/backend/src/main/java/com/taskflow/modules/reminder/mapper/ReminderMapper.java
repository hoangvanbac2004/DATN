package com.taskflow.modules.reminder.mapper;

import com.taskflow.modules.reminder.dto.ReminderDto;
import com.taskflow.modules.reminder.entity.ReminderEntity;
import org.springframework.stereotype.Component;

@Component
public class ReminderMapper {

    public ReminderDto toDto(ReminderEntity entity) {
        if (entity == null) {
            return null;
        }

        return new ReminderDto(
                entity.getId(),
                entity.getTaskId(),
                entity.getUserId(),
                entity.getRemindAt(),
                entity.getStatus(),
                entity.getType(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}

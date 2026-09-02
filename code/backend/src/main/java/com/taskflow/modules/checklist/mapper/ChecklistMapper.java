package com.taskflow.modules.checklist.mapper;

import com.taskflow.modules.checklist.dto.ChecklistDto;
import com.taskflow.modules.checklist.entity.ChecklistEntity;
import org.springframework.stereotype.Component;

@Component
public class ChecklistMapper {

    public ChecklistDto toDto(ChecklistEntity entity) {
        if (entity == null) {
            return null;
        }

        return new ChecklistDto(
                entity.getId(),
                entity.getTitle(),
                entity.getCompleted(),
                entity.getTaskId(),
                entity.getPosition(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}

package com.taskflow.modules.activity.mapper;

import com.taskflow.modules.activity.dto.ActivityLogDto;
import com.taskflow.modules.activity.entity.ActivityLogEntity;
import com.taskflow.modules.user.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class ActivityLogMapper {

    public ActivityLogDto toDto(ActivityLogEntity entity, UserDto user) {
        if (entity == null) {
            return null;
        }

        return new ActivityLogDto(
                entity.getId(),
                entity.getAction(),
                entity.getEntityType(),
                entity.getEntityId(),
                entity.getUserId(),
                user,
                entity.getDetails(),
                entity.getWorkspaceId(),
                entity.getProjectId(),
                entity.getCreatedAt()
        );
    }
}

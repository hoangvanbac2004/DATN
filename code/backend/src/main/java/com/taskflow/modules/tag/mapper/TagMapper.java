package com.taskflow.modules.tag.mapper;

import com.taskflow.modules.tag.dto.TagDto;
import com.taskflow.modules.tag.entity.TagEntity;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    public TagDto toDto(TagEntity entity) {
        if (entity == null) {
            return null;
        }

        return new TagDto(
                entity.getId(),
                entity.getName(),
                entity.getColor(),
                entity.getWorkspaceId(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}

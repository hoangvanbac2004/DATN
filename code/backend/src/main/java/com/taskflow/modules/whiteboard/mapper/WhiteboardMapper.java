package com.taskflow.modules.whiteboard.mapper;

import com.taskflow.modules.whiteboard.dto.WhiteboardDto;
import com.taskflow.modules.whiteboard.dto.WhiteboardElementDto;
import com.taskflow.modules.whiteboard.entity.WhiteboardElementEntity;
import com.taskflow.modules.whiteboard.entity.WhiteboardEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WhiteboardMapper {

    public WhiteboardElementDto toElementDto(WhiteboardElementEntity entity) {
        if (entity == null) return null;
        return new WhiteboardElementDto(
                entity.getId(),
                entity.getWhiteboardId(),
                entity.getType(),
                entity.getX(),
                entity.getY(),
                entity.getWidth(),
                entity.getHeight(),
                entity.getRotation(),
                entity.getContent(),
                entity.getStyleJson(),
                entity.getStartElementId(),
                entity.getEndElementId(),
                entity.getZIndex()
        );
    }

    public WhiteboardDto toDto(WhiteboardEntity entity, List<WhiteboardElementEntity> elements) {
        if (entity == null) return null;
        List<WhiteboardElementDto> elementDtos = elements != null
                ? elements.stream().map(this::toElementDto).collect(Collectors.toList())
                : List.of();

        return new WhiteboardDto(
                entity.getId(),
                entity.getWorkspaceId(),
                entity.getProjectId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getBackgroundColor(),
                entity.getIsArchived(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getCreatedBy(),
                elementDtos
        );
    }
}

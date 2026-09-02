package com.taskflow.modules.project.mapper;

import com.taskflow.modules.project.dto.ProjectDto;
import com.taskflow.modules.project.dto.ProjectStatsDto;
import com.taskflow.modules.project.entity.ProjectEntity;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectDto toDto(ProjectEntity entity, ProjectStatsDto stats) {
        if (entity == null) {
            return null;
        }

        return new ProjectDto(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getWorkspaceId(),
                entity.getColor(),
                entity.getIcon(),
                entity.getIsArchived(),
                entity.getIsFavorite(),
                stats,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}

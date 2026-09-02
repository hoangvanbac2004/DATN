package com.taskflow.modules.task.mapper;

import com.taskflow.modules.task.dto.TaskDependencyDto;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.entity.TaskDependencyEntity;
import com.taskflow.modules.task.entity.TaskEntity;
import com.taskflow.modules.user.dto.UserDto;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {

    public TaskDto toDto(TaskEntity entity, UserDto assignee) {
        return toDto(entity, assignee, new ArrayList<>());
    }

    public TaskDto toDto(TaskEntity entity, UserDto assignee, List<TaskDependencyEntity> dependencyEntities) {
        if (entity == null) {
            return null;
        }

        Instant startDate = entity.getStartDate();
        Instant dueDate = entity.getDueDate();
        if (startDate == null) {
            startDate = entity.getCreatedAt() != null ? entity.getCreatedAt() : Instant.now();
        }
        if (dueDate == null) {
            dueDate = startDate.plus(1, ChronoUnit.DAYS);
        }

        long durationDays = Math.max(1, Duration.between(startDate, dueDate).toDays());

        List<TaskDependencyDto> dependencies = dependencyEntities != null
                ? dependencyEntities.stream().map(this::toDependencyDto).collect(Collectors.toList())
                : new ArrayList<>();

        TaskDto dto = new TaskDto(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getPriority(),
                dueDate,
                entity.getProjectId(),
                entity.getAssigneeId(),
                assignee,
                entity.getPosition(),
                entity.getIsArchived(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
        dto.setColumnId(entity.getColumnId());
        dto.setStartDate(startDate);
        dto.setDurationDays(durationDays);
        dto.setDependencies(dependencies);
        return dto;
    }

    public TaskDependencyDto toDependencyDto(TaskDependencyEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TaskDependencyDto(
                entity.getId(),
                entity.getPredecessorId(),
                entity.getSuccessorId(),
                entity.getDependencyType(),
                entity.getCreatedAt()
        );
    }
}

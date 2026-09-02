package com.taskflow.modules.workspace.mapper;

import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.workspace.dto.WorkspaceDto;
import com.taskflow.modules.workspace.dto.WorkspaceMemberDto;
import com.taskflow.modules.workspace.entity.WorkspaceEntity;
import com.taskflow.modules.workspace.entity.WorkspaceMemberEntity;
import org.springframework.stereotype.Component;

@Component
public class WorkspaceMapper {

    public WorkspaceDto toDto(WorkspaceEntity entity, long memberCount, String userRole) {
        if (entity == null) {
            return null;
        }

        return new WorkspaceDto(
                entity.getId(),
                entity.getName(),
                entity.getSlug(),
                entity.getDescription(),
                entity.getOwnerId(),
                entity.getIconUrl(),
                entity.getThemeColor(),
                memberCount,
                userRole,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public WorkspaceMemberDto toMemberDto(WorkspaceMemberEntity memberEntity, UserDto userDto) {
        if (memberEntity == null) {
            return null;
        }

        return new WorkspaceMemberDto(
                memberEntity.getId(),
                memberEntity.getWorkspaceId(),
                memberEntity.getUserId(),
                userDto != null ? userDto.getEmail() : null,
                userDto != null ? userDto.getFullName() : null,
                userDto != null ? userDto.getAvatarUrl() : null,
                memberEntity.getRole(),
                memberEntity.getStatus(),
                memberEntity.getJoinedAt()
        );
    }
}

package com.taskflow.modules.comment.mapper;

import com.taskflow.modules.comment.dto.CommentDto;
import com.taskflow.modules.comment.entity.CommentEntity;
import com.taskflow.modules.comment.util.MentionUtils;
import com.taskflow.modules.user.dto.UserDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class CommentMapper {

    public CommentDto toDto(CommentEntity entity, UserDto author) {
        if (entity == null) {
            return null;
        }

        List<UUID> mentionedUserIds = MentionUtils.deserializeMentionedUserIds(entity.getMentionedUserIds());

        return new CommentDto(
                entity.getId(),
                entity.getContent(),
                entity.getTaskId(),
                entity.getUserId(),
                author,
                mentionedUserIds,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}

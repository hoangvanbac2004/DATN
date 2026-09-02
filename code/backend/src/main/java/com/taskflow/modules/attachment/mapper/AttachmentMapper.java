package com.taskflow.modules.attachment.mapper;

import com.taskflow.modules.attachment.dto.AttachmentDto;
import com.taskflow.modules.attachment.entity.AttachmentEntity;
import org.springframework.stereotype.Component;

@Component
public class AttachmentMapper {

    public AttachmentDto toDto(AttachmentEntity entity) {
        if (entity == null) {
            return null;
        }

        return new AttachmentDto(
                entity.getId(),
                entity.getFileName(),
                entity.getFileUrl(),
                entity.getFileSize(),
                entity.getTaskId(),
                entity.getUserId(),
                entity.getMimeType(),
                entity.getFileExtension(),
                entity.getStorageProvider(),
                entity.getCreatedAt()
        );
    }
}

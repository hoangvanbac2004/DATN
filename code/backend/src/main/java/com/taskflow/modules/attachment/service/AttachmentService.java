package com.taskflow.modules.attachment.service;

import com.taskflow.modules.attachment.dto.AttachmentDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing file uploads, attachments, and cloud storage providers.
 */
public interface AttachmentService {

    /**
     * Uploads a file attachment for a task.
     *
     * @param userId UUID identifier of requesting user
     * @param taskId UUID identifier of target task
     * @param file   uploaded MultipartFile payload
     * @return AttachmentDto instance
     */
    AttachmentDto uploadTaskAttachment(UUID userId, UUID taskId, MultipartFile file);

    /**
     * Gets all active attachments for a task.
     *
     * @param userId UUID identifier of requesting user
     * @param taskId UUID identifier of target task
     * @return list of AttachmentDto instances
     */
    List<AttachmentDto> getTaskAttachments(UUID userId, UUID taskId);

    /**
     * Gets attachment details by ID.
     *
     * @param userId       UUID identifier of requesting user
     * @param attachmentId UUID identifier of target attachment
     * @return AttachmentDto instance
     */
    AttachmentDto getAttachmentDetails(UUID userId, UUID attachmentId);

    /**
     * Soft-deletes an attachment and removes from storage provider.
     *
     * @param userId       UUID identifier of requesting user
     * @param attachmentId UUID identifier of target attachment
     */
    void deleteAttachment(UUID userId, UUID attachmentId);
}

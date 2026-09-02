package com.taskflow.modules.attachment.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.attachment.config.StorageProperties;
import com.taskflow.modules.attachment.dto.AttachmentDto;
import com.taskflow.modules.attachment.entity.AttachmentEntity;
import com.taskflow.modules.attachment.mapper.AttachmentMapper;
import com.taskflow.modules.attachment.repository.AttachmentRepository;
import com.taskflow.modules.attachment.service.AttachmentService;
import com.taskflow.modules.attachment.storage.FileStorageService;
import com.taskflow.modules.task.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskService taskService;
    private final FileStorageService fileStorageService;
    private final StorageProperties storageProperties;
    private final AttachmentMapper attachmentMapper;

    public AttachmentServiceImpl(
            AttachmentRepository attachmentRepository,
            TaskService taskService,
            FileStorageService fileStorageService,
            StorageProperties storageProperties,
            AttachmentMapper attachmentMapper) {
        this.attachmentRepository = attachmentRepository;
        this.taskService = taskService;
        this.fileStorageService = fileStorageService;
        this.storageProperties = storageProperties;
        this.attachmentMapper = attachmentMapper;
    }

    @Override
    @Transactional
    public AttachmentDto uploadTaskAttachment(UUID userId, UUID taskId, MultipartFile file) {
        taskService.getTaskDetails(userId, taskId);

        validateFile(file);

        FileStorageService.StorageResult uploadResult = fileStorageService.uploadFile(file, "tasks/" + taskId);

        AttachmentEntity entity = new AttachmentEntity(
                file.getOriginalFilename(),
                uploadResult.getFileUrl(),
                uploadResult.getFileSize(),
                taskId,
                userId,
                uploadResult.getMimeType(),
                uploadResult.getFileExtension(),
                uploadResult.getProvider(),
                uploadResult.getPublicId()
        );

        AttachmentEntity saved = attachmentRepository.save(entity);
        return attachmentMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttachmentDto> getTaskAttachments(UUID userId, UUID taskId) {
        taskService.getTaskDetails(userId, taskId);

        List<AttachmentEntity> attachments = attachmentRepository.findByTaskIdAndIsDeletedFalseOrderByCreatedAtDesc(taskId);
        return attachments.stream()
                .map(attachmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AttachmentDto getAttachmentDetails(UUID userId, UUID attachmentId) {
        AttachmentEntity attachment = findActiveAttachmentById(attachmentId);
        taskService.getTaskDetails(userId, attachment.getTaskId());
        return attachmentMapper.toDto(attachment);
    }

    @Override
    @Transactional
    public void deleteAttachment(UUID userId, UUID attachmentId) {
        AttachmentEntity attachment = findActiveAttachmentById(attachmentId);
        taskService.getTaskDetails(userId, attachment.getTaskId());

        if (!attachment.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to delete this attachment");
        }

        if (attachment.getPublicId() != null) {
            try {
                fileStorageService.deleteFile(attachment.getPublicId());
            } catch (Exception ignored) {
            }
        }

        attachment.setIsDeleted(true);
        attachment.setDeletedAt(Instant.now());
        attachmentRepository.save(attachment);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ResultCode.BAD_REQUEST, "File payload is empty");
        }

        if (file.getSize() > storageProperties.getMaxFileSize()) {
            long maxMb = storageProperties.getMaxFileSize() / (1024 * 1024);
            throw new AppException(ResultCode.BAD_REQUEST, "File size exceeds maximum allowed limit of " + maxMb + " MB");
        }

        String mimeType = file.getContentType();
        List<String> allowedTypes = storageProperties.getAllowedTypesList();
        if (mimeType != null && !allowedTypes.isEmpty() && !allowedTypes.contains(mimeType)) {
            throw new AppException(ResultCode.BAD_REQUEST, "File type [" + mimeType + "] is not supported");
        }
    }

    private AttachmentEntity findActiveAttachmentById(UUID attachmentId) {
        return attachmentRepository.findByIdAndIsDeletedFalse(attachmentId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Attachment not found"));
    }
}

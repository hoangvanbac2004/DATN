package com.taskflow.modules.attachment.dto;

import java.time.Instant;
import java.util.UUID;

public class AttachmentDto {

    private UUID id;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private UUID taskId;
    private UUID userId;
    private String mimeType;
    private String fileExtension;
    private String storageProvider;
    private Instant createdAt;

    public AttachmentDto() {
    }

    public AttachmentDto(UUID id, String fileName, String fileUrl, Long fileSize, UUID taskId, UUID userId, String mimeType, String fileExtension, String storageProvider, Instant createdAt) {
        this.id = id;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileSize = fileSize;
        this.taskId = taskId;
        this.userId = userId;
        this.mimeType = mimeType;
        this.fileExtension = fileExtension;
        this.storageProvider = storageProvider;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension;
    }

    public String getStorageProvider() {
        return storageProvider;
    }

    public void setStorageProvider(String storageProvider) {
        this.storageProvider = storageProvider;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

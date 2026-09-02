package com.taskflow.modules.attachment.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "attachments")
public class AttachmentEntity extends BaseEntity {

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_url", nullable = false, length = 512)
    private String fileUrl;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "task_id")
    private UUID taskId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_extension", length = 20)
    private String fileExtension;

    @Column(name = "storage_provider", nullable = false, length = 50)
    private String storageProvider = "CLOUDINARY";

    @Column(name = "public_id", length = 255)
    private String publicId;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public AttachmentEntity() {
    }

    public AttachmentEntity(String fileName, String fileUrl, Long fileSize, UUID taskId, UUID userId, String mimeType, String fileExtension, String storageProvider, String publicId) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileSize = fileSize;
        this.taskId = taskId;
        this.userId = userId;
        this.mimeType = mimeType;
        this.fileExtension = fileExtension;
        this.storageProvider = (storageProvider != null && !storageProvider.isBlank()) ? storageProvider : "CLOUDINARY";
        this.publicId = publicId;
        this.isDeleted = false;
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

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}

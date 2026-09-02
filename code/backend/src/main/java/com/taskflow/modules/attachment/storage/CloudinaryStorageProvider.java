package com.taskflow.modules.attachment.storage;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.attachment.config.StorageProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class CloudinaryStorageProvider implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryStorageProvider.class);

    private final StorageProperties storageProperties;

    public CloudinaryStorageProvider(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public StorageResult uploadFile(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new AppException(ResultCode.BAD_REQUEST, "Cannot upload empty file");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = extractExtension(originalFilename);
        String mimeType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
        String publicId = UUID.randomUUID().toString();

        // Local Storage Fallback implementation for seamless development
        try {
            String uploadDir = "uploads/" + (folder != null ? folder : "attachments");
            Path dirPath = Paths.get(uploadDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String storedFileName = publicId + (extension.isBlank() ? "" : "." + extension);
            Path filePath = dirPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/api/v1/attachments/files/" + storedFileName;
            log.info("Uploaded file locally to {} with publicId {}", filePath, publicId);

            return new StorageResult(
                    fileUrl,
                    publicId,
                    file.getSize(),
                    mimeType,
                    extension,
                    storageProperties.getProvider()
            );
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new AppException(ResultCode.INTERNAL_SERVER_ERROR, "Failed to upload file");
        }
    }

    @Override
    public boolean deleteFile(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return false;
        }
        log.info("Deleting file with publicId {}", publicId);
        return true;
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}

package com.taskflow.modules.attachment.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    class StorageResult {
        private final String fileUrl;
        private final String publicId;
        private final long fileSize;
        private final String mimeType;
        private final String fileExtension;
        private final String provider;

        public StorageResult(String fileUrl, String publicId, long fileSize, String mimeType, String fileExtension, String provider) {
            this.fileUrl = fileUrl;
            this.publicId = publicId;
            this.fileSize = fileSize;
            this.mimeType = mimeType;
            this.fileExtension = fileExtension;
            this.provider = provider;
        }

        public String getFileUrl() { return fileUrl; }
        public String getPublicId() { return publicId; }
        public long getFileSize() { return fileSize; }
        public String getMimeType() { return mimeType; }
        public String getFileExtension() { return fileExtension; }
        public String getProvider() { return provider; }
    }

    StorageResult uploadFile(MultipartFile file, String folder);

    boolean deleteFile(String publicId);
}

package com.taskflow.modules.attachment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "taskflow.storage")
public class StorageProperties {

    private long maxFileSize = 10485760L; // 10MB default
    private String allowedTypes = "image/png,image/jpeg,image/jpg,image/gif,image/webp,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip";
    private String provider = "CLOUDINARY";
    private String cloudinaryCloudName;
    private String cloudinaryApiKey;
    private String cloudinaryApiSecret;

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public String getAllowedTypes() {
        return allowedTypes;
    }

    public void setAllowedTypes(String allowedTypes) {
        this.allowedTypes = allowedTypes;
    }

    public List<String> getAllowedTypesList() {
        if (allowedTypes == null || allowedTypes.isBlank()) {
            return List.of();
        }
        return Arrays.stream(allowedTypes.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getCloudinaryCloudName() {
        return cloudinaryCloudName;
    }

    public void setCloudinaryCloudName(String cloudinaryCloudName) {
        this.cloudinaryCloudName = cloudinaryCloudName;
    }

    public String getCloudinaryApiKey() {
        return cloudinaryApiKey;
    }

    public void setCloudinaryApiKey(String cloudinaryApiKey) {
        this.cloudinaryApiKey = cloudinaryApiKey;
    }

    public String getCloudinaryApiSecret() {
        return cloudinaryApiSecret;
    }

    public void setCloudinaryApiSecret(String cloudinaryApiSecret) {
        this.cloudinaryApiSecret = cloudinaryApiSecret;
    }
}

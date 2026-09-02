package com.taskflow.modules.automation.dto;

import java.time.Instant;
import java.util.UUID;

public class AutomationLogDto {
    private UUID id;
    private UUID ruleId;
    private String status;
    private String message;
    private Instant createdAt;

    public AutomationLogDto() {
    }

    public AutomationLogDto(UUID id, UUID ruleId, String status, String message, Instant createdAt) {
        this.id = id;
        this.ruleId = ruleId;
        this.status = status;
        this.message = message;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getRuleId() {
        return ruleId;
    }

    public void setRuleId(UUID ruleId) {
        this.ruleId = ruleId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

package com.taskflow.modules.ai.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "ai_prompt_logs")
public class AiPromptLogEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String response;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    public AiPromptLogEntity() {}

    public AiPromptLogEntity(UUID id, String prompt, String response, UUID userId) {
        this.id = id;
        this.prompt = prompt;
        this.response = response;
        this.userId = userId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}

package com.taskflow.modules.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class AiPromptRequest {

    @NotBlank(message = "Prompt is required")
    private String prompt;

    public AiPromptRequest() {}

    public AiPromptRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
}

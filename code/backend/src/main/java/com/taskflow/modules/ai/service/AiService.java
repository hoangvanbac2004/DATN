package com.taskflow.modules.ai.service;

import com.taskflow.modules.ai.dto.AiPromptRequest;
import com.taskflow.modules.ai.dto.AiResponseDto;

public interface AiService {
    AiResponseDto processPrompt(AiPromptRequest request);
}

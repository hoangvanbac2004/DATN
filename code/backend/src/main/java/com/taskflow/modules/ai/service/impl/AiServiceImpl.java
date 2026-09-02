package com.taskflow.modules.ai.service.impl;

import com.taskflow.modules.ai.dto.AiPromptRequest;
import com.taskflow.modules.ai.dto.AiResponseDto;
import com.taskflow.modules.ai.service.AiService;
import org.springframework.stereotype.Service;

@Service
public class AiServiceImpl implements AiService {

    @Override
    public AiResponseDto processPrompt(AiPromptRequest request) {
        return AiResponseDto.builder()
                .response("AI assistant integration architecture ready.")
                .tokensUsed(0)
                .build();
    }
}

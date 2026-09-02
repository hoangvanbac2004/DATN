package com.taskflow.modules.ai.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.ai.dto.AiPromptRequest;
import com.taskflow.modules.ai.dto.AiResponseDto;
import com.taskflow.modules.ai.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiResponseDto>> processPrompt(@Valid @RequestBody AiPromptRequest request) {
        return ResponseEntity.ok(ApiResponse.success(aiService.processPrompt(request)));
    }
}

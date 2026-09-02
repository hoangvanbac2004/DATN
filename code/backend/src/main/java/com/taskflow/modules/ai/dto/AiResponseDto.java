package com.taskflow.modules.ai.dto;

public class AiResponseDto {
    private String response;
    private Integer tokensUsed;

    public AiResponseDto() {}

    public AiResponseDto(String response, Integer tokensUsed) {
        this.response = response;
        this.tokensUsed = tokensUsed;
    }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public Integer getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(Integer tokensUsed) { this.tokensUsed = tokensUsed; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String response;
        private Integer tokensUsed;

        public Builder response(String response) { this.response = response; return this; }
        public Builder tokensUsed(Integer tokensUsed) { this.tokensUsed = tokensUsed; return this; }

        public AiResponseDto build() {
            return new AiResponseDto(response, tokensUsed);
        }
    }
}

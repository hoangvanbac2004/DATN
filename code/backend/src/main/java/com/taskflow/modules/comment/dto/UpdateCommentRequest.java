package com.taskflow.modules.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public class UpdateCommentRequest {

    @NotBlank(message = "Comment content must not be blank")
    @Size(max = 5000, message = "Comment content must not exceed 5000 characters")
    private String content;

    private List<UUID> mentionedUserIds;

    public UpdateCommentRequest() {
    }

    public UpdateCommentRequest(String content, List<UUID> mentionedUserIds) {
        this.content = content;
        this.mentionedUserIds = mentionedUserIds;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<UUID> getMentionedUserIds() {
        return mentionedUserIds;
    }

    public void setMentionedUserIds(List<UUID> mentionedUserIds) {
        this.mentionedUserIds = mentionedUserIds;
    }
}

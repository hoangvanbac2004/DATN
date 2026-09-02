package com.taskflow.modules.realtime.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class PresenceDto {
    private UUID workspaceId;
    private List<UUID> onlineUserIds;
    private Instant timestamp = Instant.now();

    public PresenceDto() {
    }

    public PresenceDto(UUID workspaceId, List<UUID> onlineUserIds) {
        this.workspaceId = workspaceId;
        this.onlineUserIds = onlineUserIds;
        this.timestamp = Instant.now();
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public List<UUID> getOnlineUserIds() {
        return onlineUserIds;
    }

    public void setOnlineUserIds(List<UUID> onlineUserIds) {
        this.onlineUserIds = onlineUserIds;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}

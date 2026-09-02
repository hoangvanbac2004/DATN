package com.taskflow.modules.realtime.service;

import java.util.List;
import java.util.UUID;

public interface PresenceService {

    void registerOnlineUser(UUID userId, String sessionId);

    void unregisterOnlineUser(String sessionId);

    List<UUID> getOnlineUsers();
}

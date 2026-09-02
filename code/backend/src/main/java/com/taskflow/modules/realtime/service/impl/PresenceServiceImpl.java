package com.taskflow.modules.realtime.service.impl;

import com.taskflow.modules.realtime.service.PresenceService;
import com.taskflow.security.UserPrincipal;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceServiceImpl implements PresenceService {

    private final Map<String, UUID> sessionUserMap = new ConcurrentHashMap<>();

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (accessor.getUser() instanceof UsernamePasswordAuthenticationToken auth) {
            if (auth.getPrincipal() instanceof UserPrincipal principal) {
                registerOnlineUser(principal.getId(), accessor.getSessionId());
            }
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        unregisterOnlineUser(event.getSessionId());
    }

    @Override
    public void registerOnlineUser(UUID userId, String sessionId) {
        if (userId != null && sessionId != null) {
            sessionUserMap.put(sessionId, userId);
        }
    }

    @Override
    public void unregisterOnlineUser(String sessionId) {
        if (sessionId != null) {
            sessionUserMap.remove(sessionId);
        }
    }

    @Override
    public List<UUID> getOnlineUsers() {
        return new ArrayList<>(sessionUserMap.values());
    }
}

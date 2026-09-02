package com.taskflow.modules.realtime.dto;

import java.time.Instant;

public class RealtimeEventDto {
    private String eventType;
    private String targetId;
    private Object payload;
    private Instant timestamp = Instant.now();

    public RealtimeEventDto() {
    }

    public RealtimeEventDto(String eventType, String targetId, Object payload) {
        this.eventType = eventType;
        this.targetId = targetId;
        this.payload = payload;
        this.timestamp = Instant.now();
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}

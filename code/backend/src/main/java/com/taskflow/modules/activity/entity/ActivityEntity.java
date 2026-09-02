package com.taskflow.modules.activity.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "activity_logs")
public class ActivityEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String action;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    public ActivityEntity() {}

    public ActivityEntity(UUID id, String action, String entityType, UUID entityId, UUID userId) {
        this.id = id;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.userId = userId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public UUID getEntityId() { return entityId; }
    public void setEntityId(UUID entityId) { this.entityId = entityId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}

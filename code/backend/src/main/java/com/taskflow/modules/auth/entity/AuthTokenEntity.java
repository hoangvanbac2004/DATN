package com.taskflow.modules.auth.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "auth_tokens")
public class AuthTokenEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "refresh_token", nullable = false, unique = true)
    private String refreshToken;

    @Column(name = "revoked")
    private boolean revoked;

    public AuthTokenEntity() {}

    public AuthTokenEntity(UUID id, UUID userId, String refreshToken, boolean revoked) {
        this.id = id;
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.revoked = revoked;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }
}

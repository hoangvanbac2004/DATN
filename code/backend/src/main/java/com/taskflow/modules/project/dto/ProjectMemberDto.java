package com.taskflow.modules.project.dto;

import com.taskflow.modules.user.dto.UserDto;

import java.time.Instant;
import java.util.UUID;

public class ProjectMemberDto {
    private UUID id;
    private UUID projectId;
    private UUID userId;
    private String role;
    private Instant joinedAt;
    private UserDto user;

    public ProjectMemberDto() {
    }

    public ProjectMemberDto(UUID id, UUID projectId, UUID userId, String role, Instant joinedAt, UserDto user) {
        this.id = id;
        this.projectId = projectId;
        this.userId = userId;
        this.role = role;
        this.joinedAt = joinedAt;
        this.user = user;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}

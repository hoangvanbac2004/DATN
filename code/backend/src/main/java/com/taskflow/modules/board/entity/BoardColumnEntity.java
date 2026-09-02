package com.taskflow.modules.board.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "board_columns")
public class BoardColumnEntity extends BaseEntity {

    @Column(name = "board_id", nullable = false)
    private UUID boardId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "color", length = 50)
    private String color = "#64748b";

    @Column(name = "position", nullable = false)
    private Double position = 1000.0;

    @Column(name = "wip_limit")
    private Integer wipLimit = 0;

    @Column(name = "is_collapsed", nullable = false)
    private Boolean isCollapsed = false;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public BoardColumnEntity() {
    }

    public BoardColumnEntity(UUID boardId, String name, String color, Double position, Integer wipLimit, Boolean isCollapsed) {
        this.boardId = boardId;
        this.name = name;
        this.color = color != null ? color : "#64748b";
        this.position = position != null ? position : 1000.0;
        this.wipLimit = wipLimit != null ? wipLimit : 0;
        this.isCollapsed = isCollapsed != null ? isCollapsed : false;
        this.isDeleted = false;
    }

    public UUID getBoardId() {
        return boardId;
    }

    public void setBoardId(UUID boardId) {
        this.boardId = boardId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }

    public Integer getWipLimit() {
        return wipLimit;
    }

    public void setWipLimit(Integer wipLimit) {
        this.wipLimit = wipLimit;
    }

    public Boolean getIsCollapsed() {
        return isCollapsed;
    }

    public void setIsCollapsed(Boolean isCollapsed) {
        this.isCollapsed = isCollapsed;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}

package com.taskflow.modules.whiteboard.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "whiteboard_elements")
public class WhiteboardElementEntity extends BaseEntity {

    @Column(name = "whiteboard_id", nullable = false)
    private UUID whiteboardId;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "x", nullable = false)
    private Double x = 0.0;

    @Column(name = "y", nullable = false)
    private Double y = 0.0;

    @Column(name = "width", nullable = false)
    private Double width = 160.0;

    @Column(name = "height", nullable = false)
    private Double height = 160.0;

    @Column(name = "rotation", nullable = false)
    private Double rotation = 0.0;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "style_json", columnDefinition = "TEXT")
    private String styleJson;

    @Column(name = "start_element_id")
    private UUID startElementId;

    @Column(name = "end_element_id")
    private UUID endElementId;

    @Column(name = "z_index", nullable = false)
    private Integer zIndex = 1;

    public WhiteboardElementEntity() {
    }

    public WhiteboardElementEntity(UUID whiteboardId, String type, Double x, Double y, Double width, Double height, Double rotation, String content, String styleJson, UUID startElementId, UUID endElementId, Integer zIndex) {
        this.whiteboardId = whiteboardId;
        this.type = type;
        this.x = x != null ? x : 0.0;
        this.y = y != null ? y : 0.0;
        this.width = width != null ? width : 160.0;
        this.height = height != null ? height : 160.0;
        this.rotation = rotation != null ? rotation : 0.0;
        this.content = content;
        this.styleJson = styleJson;
        this.startElementId = startElementId;
        this.endElementId = endElementId;
        this.zIndex = zIndex != null ? zIndex : 1;
    }

    public UUID getWhiteboardId() {
        return whiteboardId;
    }

    public void setWhiteboardId(UUID whiteboardId) {
        this.whiteboardId = whiteboardId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getRotation() {
        return rotation;
    }

    public void setRotation(Double rotation) {
        this.rotation = rotation;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getStyleJson() {
        return styleJson;
    }

    public void setStyleJson(String styleJson) {
        this.styleJson = styleJson;
    }

    public UUID getStartElementId() {
        return startElementId;
    }

    public void setStartElementId(UUID startElementId) {
        this.startElementId = startElementId;
    }

    public UUID getEndElementId() {
        return endElementId;
    }

    public void setEndElementId(UUID endElementId) {
        this.endElementId = endElementId;
    }

    public Integer getZIndex() {
        return zIndex;
    }

    public void setZIndex(Integer zIndex) {
        this.zIndex = zIndex;
    }
}

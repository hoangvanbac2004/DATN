package com.taskflow.modules.whiteboard.dto;

import java.util.UUID;

public class WhiteboardElementDto {
    private UUID id;
    private UUID whiteboardId;
    private String type;
    private Double x;
    private Double y;
    private Double width;
    private Double height;
    private Double rotation;
    private String content;
    private String styleJson;
    private UUID startElementId;
    private UUID endElementId;
    private Integer zIndex;

    public WhiteboardElementDto() {
    }

    public WhiteboardElementDto(UUID id, UUID whiteboardId, String type, Double x, Double y, Double width, Double height, Double rotation, String content, String styleJson, UUID startElementId, UUID endElementId, Integer zIndex) {
        this.id = id;
        this.whiteboardId = whiteboardId;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.content = content;
        this.styleJson = styleJson;
        this.startElementId = startElementId;
        this.endElementId = endElementId;
        this.zIndex = zIndex;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

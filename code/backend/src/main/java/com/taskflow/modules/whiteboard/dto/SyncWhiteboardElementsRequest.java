package com.taskflow.modules.whiteboard.dto;

import java.util.ArrayList;
import java.util.List;

public class SyncWhiteboardElementsRequest {
    private List<WhiteboardElementDto> elements = new ArrayList<>();

    public SyncWhiteboardElementsRequest() {
    }

    public SyncWhiteboardElementsRequest(List<WhiteboardElementDto> elements) {
        this.elements = elements != null ? elements : new ArrayList<>();
    }

    public List<WhiteboardElementDto> getElements() {
        return elements;
    }

    public void setElements(List<WhiteboardElementDto> elements) {
        this.elements = elements;
    }
}

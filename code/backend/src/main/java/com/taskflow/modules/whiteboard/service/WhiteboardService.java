package com.taskflow.modules.whiteboard.service;

import com.taskflow.modules.whiteboard.dto.CreateWhiteboardRequest;
import com.taskflow.modules.whiteboard.dto.SyncWhiteboardElementsRequest;
import com.taskflow.modules.whiteboard.dto.UpdateWhiteboardRequest;
import com.taskflow.modules.whiteboard.dto.WhiteboardDto;

import java.util.List;
import java.util.UUID;

public interface WhiteboardService {

    WhiteboardDto createWhiteboard(UUID userId, UUID workspaceId, CreateWhiteboardRequest request);

    List<WhiteboardDto> getWorkspaceWhiteboards(UUID userId, UUID workspaceId);

    WhiteboardDto getWhiteboardDetails(UUID userId, UUID whiteboardId);

    WhiteboardDto updateWhiteboard(UUID userId, UUID whiteboardId, UpdateWhiteboardRequest request);

    void deleteWhiteboard(UUID userId, UUID whiteboardId);

    WhiteboardDto syncElements(UUID userId, UUID whiteboardId, SyncWhiteboardElementsRequest request);
}

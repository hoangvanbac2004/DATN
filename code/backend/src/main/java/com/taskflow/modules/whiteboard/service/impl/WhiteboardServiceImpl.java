package com.taskflow.modules.whiteboard.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.workspace.service.WorkspaceService;
import com.taskflow.modules.whiteboard.dto.CreateWhiteboardRequest;
import com.taskflow.modules.whiteboard.dto.SyncWhiteboardElementsRequest;
import com.taskflow.modules.whiteboard.dto.UpdateWhiteboardRequest;
import com.taskflow.modules.whiteboard.dto.WhiteboardDto;
import com.taskflow.modules.whiteboard.dto.WhiteboardElementDto;
import com.taskflow.modules.whiteboard.entity.WhiteboardElementEntity;
import com.taskflow.modules.whiteboard.entity.WhiteboardEntity;
import com.taskflow.modules.whiteboard.mapper.WhiteboardMapper;
import com.taskflow.modules.whiteboard.repository.WhiteboardElementRepository;
import com.taskflow.modules.whiteboard.repository.WhiteboardRepository;
import com.taskflow.modules.whiteboard.service.WhiteboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WhiteboardServiceImpl implements WhiteboardService {

    private final WhiteboardRepository whiteboardRepository;
    private final WhiteboardElementRepository elementRepository;
    private final WorkspaceService workspaceService;
    private final WhiteboardMapper whiteboardMapper;

    public WhiteboardServiceImpl(
            WhiteboardRepository whiteboardRepository,
            WhiteboardElementRepository elementRepository,
            WorkspaceService workspaceService,
            WhiteboardMapper whiteboardMapper) {
        this.whiteboardRepository = whiteboardRepository;
        this.elementRepository = elementRepository;
        this.workspaceService = workspaceService;
        this.whiteboardMapper = whiteboardMapper;
    }

    @Override
    @Transactional
    public WhiteboardDto createWhiteboard(UUID userId, UUID workspaceId, CreateWhiteboardRequest request) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);

        WhiteboardEntity board = new WhiteboardEntity(
                workspaceId,
                request.getProjectId(),
                request.getTitle().trim(),
                request.getDescription(),
                request.getBackgroundColor()
        );

        WhiteboardEntity saved = whiteboardRepository.save(board);
        return whiteboardMapper.toDto(saved, List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WhiteboardDto> getWorkspaceWhiteboards(UUID userId, UUID workspaceId) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);
        List<WhiteboardEntity> boards = whiteboardRepository.findByWorkspaceIdAndIsDeletedFalse(workspaceId);
        return boards.stream().map(b -> {
            List<WhiteboardElementEntity> elements = elementRepository.findByWhiteboardIdOrderByZIndexAsc(b.getId());
            return whiteboardMapper.toDto(b, elements);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WhiteboardDto getWhiteboardDetails(UUID userId, UUID whiteboardId) {
        WhiteboardEntity board = findActiveWhiteboardById(whiteboardId);
        workspaceService.getWorkspaceDetails(userId, board.getWorkspaceId());
        List<WhiteboardElementEntity> elements = elementRepository.findByWhiteboardIdOrderByZIndexAsc(whiteboardId);
        return whiteboardMapper.toDto(board, elements);
    }

    @Override
    @Transactional
    public WhiteboardDto updateWhiteboard(UUID userId, UUID whiteboardId, UpdateWhiteboardRequest request) {
        WhiteboardEntity board = findActiveWhiteboardById(whiteboardId);
        workspaceService.getWorkspaceDetails(userId, board.getWorkspaceId());

        board.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) {
            board.setDescription(request.getDescription());
        }
        if (request.getBackgroundColor() != null) {
            board.setBackgroundColor(request.getBackgroundColor());
        }

        WhiteboardEntity updated = whiteboardRepository.save(board);
        List<WhiteboardElementEntity> elements = elementRepository.findByWhiteboardIdOrderByZIndexAsc(whiteboardId);
        return whiteboardMapper.toDto(updated, elements);
    }

    @Override
    @Transactional
    public void deleteWhiteboard(UUID userId, UUID whiteboardId) {
        WhiteboardEntity board = findActiveWhiteboardById(whiteboardId);
        workspaceService.getWorkspaceDetails(userId, board.getWorkspaceId());

        board.setIsDeleted(true);
        board.setDeletedAt(Instant.now());
        whiteboardRepository.save(board);
    }

    @Override
    @Transactional
    public WhiteboardDto syncElements(UUID userId, UUID whiteboardId, SyncWhiteboardElementsRequest request) {
        WhiteboardEntity board = findActiveWhiteboardById(whiteboardId);
        workspaceService.getWorkspaceDetails(userId, board.getWorkspaceId());

        elementRepository.deleteByWhiteboardId(whiteboardId);

        List<WhiteboardElementEntity> newElements = new ArrayList<>();
        if (request.getElements() != null) {
            for (WhiteboardElementDto dto : request.getElements()) {
                WhiteboardElementEntity entity = new WhiteboardElementEntity(
                        whiteboardId,
                        dto.getType(),
                        dto.getX(),
                        dto.getY(),
                        dto.getWidth(),
                        dto.getHeight(),
                        dto.getRotation(),
                        dto.getContent(),
                        dto.getStyleJson(),
                        dto.getStartElementId(),
                        dto.getEndElementId(),
                        dto.getZIndex()
                );
                newElements.add(entity);
            }
        }

        List<WhiteboardElementEntity> savedElements = elementRepository.saveAll(newElements);
        return whiteboardMapper.toDto(board, savedElements);
    }

    private WhiteboardEntity findActiveWhiteboardById(UUID whiteboardId) {
        return whiteboardRepository.findByIdAndIsDeletedFalse(whiteboardId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Whiteboard not found"));
    }
}

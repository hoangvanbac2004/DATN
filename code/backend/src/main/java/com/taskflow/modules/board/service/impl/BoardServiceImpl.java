package com.taskflow.modules.board.service.impl;

import com.taskflow.modules.board.dto.BoardColumnDto;
import com.taskflow.modules.board.dto.BoardDto;
import com.taskflow.modules.board.dto.BoardSettingsDto;
import com.taskflow.modules.board.dto.ColumnOrderDto;
import com.taskflow.modules.board.dto.CreateBoardColumnRequest;
import com.taskflow.modules.board.dto.MoveTaskRequest;
import com.taskflow.modules.board.dto.ReorderColumnsRequest;
import com.taskflow.modules.board.dto.UpdateBoardColumnRequest;
import com.taskflow.modules.board.dto.UpdateBoardSettingsRequest;
import com.taskflow.modules.board.entity.BoardColumnEntity;
import com.taskflow.modules.board.entity.BoardEntity;
import com.taskflow.modules.board.mapper.BoardMapper;
import com.taskflow.modules.board.repository.BoardColumnRepository;
import com.taskflow.modules.board.repository.BoardRepository;
import com.taskflow.modules.board.service.BoardService;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final BoardColumnRepository columnRepository;
    private final BoardMapper boardMapper;
    private final TaskService taskService;

    public BoardServiceImpl(
            BoardRepository boardRepository,
            BoardColumnRepository columnRepository,
            BoardMapper boardMapper,
            TaskService taskService) {
        this.boardRepository = boardRepository;
        this.columnRepository = columnRepository;
        this.boardMapper = boardMapper;
        this.taskService = taskService;
    }

    @Override
    @Transactional
    public BoardDto getBoardByProjectId(UUID userId, UUID projectId) {
        BoardEntity board = boardRepository.findByProjectIdAndIsDeletedFalse(projectId)
                .orElseGet(() -> createDefaultBoardForProject(projectId));

        return buildBoardDto(userId, board);
    }

    @Override
    @Transactional(readOnly = true)
    public BoardDto getBoardById(UUID userId, UUID boardId) {
        BoardEntity board = boardRepository.findByIdAndIsDeletedFalse(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with ID: " + boardId));

        return buildBoardDto(userId, board);
    }

    @Override
    @Transactional
    public BoardDto updateBoardSettings(UUID userId, UUID boardId, UpdateBoardSettingsRequest request) {
        BoardEntity board = boardRepository.findByIdAndIsDeletedFalse(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with ID: " + boardId));

        if (request.getName() != null && !request.getName().isBlank()) {
            board.setName(request.getName());
        }
        if (request.getDescription() != null) {
            board.setDescription(request.getDescription());
        }
        if (request.getSettings() != null) {
            board.setSettings(boardMapper.serializeSettings(request.getSettings()));
        }

        BoardEntity saved = boardRepository.save(board);
        return buildBoardDto(userId, saved);
    }

    @Override
    @Transactional
    public BoardColumnDto addColumn(UUID userId, UUID boardId, CreateBoardColumnRequest request) {
        BoardEntity board = boardRepository.findByIdAndIsDeletedFalse(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with ID: " + boardId));

        List<BoardColumnEntity> existingColumns = columnRepository.findByBoardIdAndIsDeletedFalseOrderByPositionAsc(boardId);
        double maxPosition = existingColumns.stream()
                .mapToDouble(BoardColumnEntity::getPosition)
                .max()
                .orElse(0.0);

        Double position = request.getPosition() != null ? request.getPosition() : maxPosition + 1000.0;

        BoardColumnEntity column = new BoardColumnEntity(
                board.getId(),
                request.getName(),
                request.getColor(),
                position,
                request.getWipLimit(),
                false
        );

        BoardColumnEntity saved = columnRepository.save(column);
        return boardMapper.toColumnDto(saved, new ArrayList<>());
    }

    @Override
    @Transactional
    public BoardColumnDto updateColumn(UUID userId, UUID columnId, UpdateBoardColumnRequest request) {
        BoardColumnEntity column = columnRepository.findByIdAndIsDeletedFalse(columnId)
                .orElseThrow(() -> new IllegalArgumentException("Column not found with ID: " + columnId));

        if (request.getName() != null && !request.getName().isBlank()) {
            column.setName(request.getName());
        }
        if (request.getColor() != null) {
            column.setColor(request.getColor());
        }
        if (request.getWipLimit() != null) {
            column.setWipLimit(request.getWipLimit());
        }
        if (request.getIsCollapsed() != null) {
            column.setIsCollapsed(request.getIsCollapsed());
        }

        BoardColumnEntity saved = columnRepository.save(column);
        return boardMapper.toColumnDto(saved, new ArrayList<>());
    }

    @Override
    @Transactional
    public void deleteColumn(UUID userId, UUID columnId) {
        BoardColumnEntity column = columnRepository.findByIdAndIsDeletedFalse(columnId)
                .orElseThrow(() -> new IllegalArgumentException("Column not found with ID: " + columnId));

        column.setIsDeleted(true);
        column.setDeletedAt(Instant.now());
        columnRepository.save(column);
    }

    @Override
    @Transactional
    public BoardDto reorderColumns(UUID userId, UUID boardId, ReorderColumnsRequest request) {
        BoardEntity board = boardRepository.findByIdAndIsDeletedFalse(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with ID: " + boardId));

        for (ColumnOrderDto order : request.getOrders()) {
            columnRepository.findByIdAndIsDeletedFalse(order.getColumnId()).ifPresent(column -> {
                column.setPosition(order.getPosition());
                columnRepository.save(column);
            });
        }

        return buildBoardDto(userId, board);
    }

    @Override
    @Transactional
    public TaskDto moveTask(UUID userId, UUID boardId, MoveTaskRequest request) {
        BoardColumnEntity targetColumn = columnRepository.findByIdAndIsDeletedFalse(request.getTargetColumnId())
                .orElseThrow(() -> new IllegalArgumentException("Target column not found with ID: " + request.getTargetColumnId()));

        String status = mapColumnNameToTaskStatus(targetColumn.getName());
        return taskService.moveTaskToColumn(
                userId,
                request.getTaskId(),
                targetColumn.getId(),
                status,
                request.getTargetPosition()
        );
    }

    private BoardEntity createDefaultBoardForProject(UUID projectId) {
        BoardEntity board = new BoardEntity(
                "Kanban Board",
                "Default project kanban board",
                projectId,
                boardMapper.serializeSettings(new BoardSettingsDto())
        );
        BoardEntity savedBoard = boardRepository.save(board);

        createDefaultColumn(savedBoard.getId(), "To Do", "#64748b", 1000.0);
        createDefaultColumn(savedBoard.getId(), "In Progress", "#6366f1", 2000.0);
        createDefaultColumn(savedBoard.getId(), "In Review", "#f59e0b", 3000.0);
        createDefaultColumn(savedBoard.getId(), "Completed", "#10b981", 4000.0);

        return savedBoard;
    }

    private void createDefaultColumn(UUID boardId, String name, String color, double position) {
        BoardColumnEntity column = new BoardColumnEntity(boardId, name, color, position, 0, false);
        columnRepository.save(column);
    }

    private BoardDto buildBoardDto(UUID userId, BoardEntity board) {
        List<BoardColumnEntity> columnEntities = columnRepository.findByBoardIdAndIsDeletedFalseOrderByPositionAsc(board.getId());
        List<TaskDto> projectTasks = taskService.getProjectTasks(userId, board.getProjectId(), null, null, null, false);

        List<BoardColumnDto> columnDtos = columnEntities.stream().map(col -> {
            List<TaskDto> matchingTasks = projectTasks.stream()
                    .filter(task -> matchesColumn(task, col))
                    .sorted((t1, t2) -> Double.compare(
                            t1.getPosition() != null ? t1.getPosition() : 1000.0,
                            t2.getPosition() != null ? t2.getPosition() : 1000.0
                    ))
                    .collect(Collectors.toList());
            return boardMapper.toColumnDto(col, matchingTasks);
        }).collect(Collectors.toList());

        return boardMapper.toDto(board, columnDtos);
    }

    private boolean matchesColumn(TaskDto task, BoardColumnEntity col) {
        if (task.getColumnId() != null) {
            return task.getColumnId().equals(col.getId());
        }
        // Fallback status matching for legacy tasks
        String columnStatus = mapColumnNameToTaskStatus(col.getName());
        return task.getStatus() != null && task.getStatus().equalsIgnoreCase(columnStatus);
    }

    private String mapColumnNameToTaskStatus(String columnName) {
        if (columnName == null) return "TODO";
        String normalized = columnName.trim().toLowerCase();
        if (normalized.contains("progress") || normalized.contains("doing")) return "IN_PROGRESS";
        if (normalized.contains("review") || normalized.contains("testing")) return "IN_REVIEW";
        if (normalized.contains("done") || normalized.contains("complete")) return "COMPLETED";
        return "TODO";
    }
}

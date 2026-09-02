package com.taskflow.modules.board.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.board.dto.BoardColumnDto;
import com.taskflow.modules.board.dto.BoardDto;
import com.taskflow.modules.board.dto.CreateBoardColumnRequest;
import com.taskflow.modules.board.dto.MoveTaskRequest;
import com.taskflow.modules.board.dto.ReorderColumnsRequest;
import com.taskflow.modules.board.dto.UpdateBoardColumnRequest;
import com.taskflow.modules.board.dto.UpdateBoardSettingsRequest;
import com.taskflow.modules.board.service.BoardService;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Board Management", description = "Endpoints for managing Kanban boards, columns, positions, and settings")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/projects/{projectId}/board")
    @Operation(summary = "Get or create primary Kanban board for a project")
    public ResponseEntity<ApiResponse<BoardDto>> getBoardByProjectId(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        BoardDto board = boardService.getBoardByProjectId(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Kanban board retrieved successfully", board));
    }

    @GetMapping("/boards/{boardId}")
    @Operation(summary = "Get board details by ID")
    public ResponseEntity<ApiResponse<BoardDto>> getBoardById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID boardId) {
        BoardDto board = boardService.getBoardById(principal.getId(), boardId);
        return ResponseEntity.ok(ApiResponse.success("Board details retrieved successfully", board));
    }

    @PatchMapping("/boards/{boardId}/settings")
    @Operation(summary = "Update board name, description, or settings")
    public ResponseEntity<ApiResponse<BoardDto>> updateBoardSettings(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID boardId,
            @RequestBody UpdateBoardSettingsRequest request) {
        BoardDto updated = boardService.updateBoardSettings(principal.getId(), boardId, request);
        return ResponseEntity.ok(ApiResponse.success("Board settings updated successfully", updated));
    }

    @PostMapping("/boards/{boardId}/columns")
    @Operation(summary = "Add a new column to a board")
    public ResponseEntity<ApiResponse<BoardColumnDto>> addColumn(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID boardId,
            @Valid @RequestBody CreateBoardColumnRequest request) {
        BoardColumnDto column = boardService.addColumn(principal.getId(), boardId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Board column created successfully", column));
    }

    @PatchMapping("/board-columns/{columnId}")
    @Operation(summary = "Update column title, color, WIP limit, or collapsed state")
    public ResponseEntity<ApiResponse<BoardColumnDto>> updateColumn(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID columnId,
            @RequestBody UpdateBoardColumnRequest request) {
        BoardColumnDto column = boardService.updateColumn(principal.getId(), columnId, request);
        return ResponseEntity.ok(ApiResponse.success("Board column updated successfully", column));
    }

    @DeleteMapping("/board-columns/{columnId}")
    @Operation(summary = "Delete a column from a board")
    public ResponseEntity<ApiResponse<Void>> deleteColumn(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID columnId) {
        boardService.deleteColumn(principal.getId(), columnId);
        return ResponseEntity.ok(ApiResponse.success("Board column deleted successfully", null));
    }

    @PatchMapping("/boards/{boardId}/columns/reorder")
    @Operation(summary = "Reorder columns on a board")
    public ResponseEntity<ApiResponse<BoardDto>> reorderColumns(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID boardId,
            @Valid @RequestBody ReorderColumnsRequest request) {
        BoardDto board = boardService.reorderColumns(principal.getId(), boardId, request);
        return ResponseEntity.ok(ApiResponse.success("Board columns reordered successfully", board));
    }

    @PostMapping("/boards/{boardId}/tasks/move")
    @Operation(summary = "Move task to target column and card position")
    public ResponseEntity<ApiResponse<TaskDto>> moveTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID boardId,
            @Valid @RequestBody MoveTaskRequest request) {
        TaskDto movedTask = boardService.moveTask(principal.getId(), boardId, request);
        return ResponseEntity.ok(ApiResponse.success("Task moved successfully", movedTask));
    }
}

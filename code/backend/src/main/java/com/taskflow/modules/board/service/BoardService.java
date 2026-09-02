package com.taskflow.modules.board.service;

import com.taskflow.modules.board.dto.BoardColumnDto;
import com.taskflow.modules.board.dto.BoardDto;
import com.taskflow.modules.board.dto.CreateBoardColumnRequest;
import com.taskflow.modules.board.dto.MoveTaskRequest;
import com.taskflow.modules.board.dto.ReorderColumnsRequest;
import com.taskflow.modules.board.dto.UpdateBoardColumnRequest;
import com.taskflow.modules.board.dto.UpdateBoardSettingsRequest;
import com.taskflow.modules.task.dto.TaskDto;

import java.util.UUID;

public interface BoardService {

    BoardDto getBoardByProjectId(UUID userId, UUID projectId);

    BoardDto getBoardById(UUID userId, UUID boardId);

    BoardDto updateBoardSettings(UUID userId, UUID boardId, UpdateBoardSettingsRequest request);

    BoardColumnDto addColumn(UUID userId, UUID boardId, CreateBoardColumnRequest request);

    BoardColumnDto updateColumn(UUID userId, UUID columnId, UpdateBoardColumnRequest request);

    void deleteColumn(UUID userId, UUID columnId);

    BoardDto reorderColumns(UUID userId, UUID boardId, ReorderColumnsRequest request);

    TaskDto moveTask(UUID userId, UUID boardId, MoveTaskRequest request);
}

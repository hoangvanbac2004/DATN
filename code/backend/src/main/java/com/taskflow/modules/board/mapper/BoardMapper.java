package com.taskflow.modules.board.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.modules.board.dto.BoardColumnDto;
import com.taskflow.modules.board.dto.BoardDto;
import com.taskflow.modules.board.dto.BoardSettingsDto;
import com.taskflow.modules.board.entity.BoardColumnEntity;
import com.taskflow.modules.board.entity.BoardEntity;
import com.taskflow.modules.task.dto.TaskDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BoardMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public BoardDto toDto(BoardEntity boardEntity, List<BoardColumnDto> columns) {
        if (boardEntity == null) {
            return null;
        }

        BoardSettingsDto settings = parseSettings(boardEntity.getSettings());

        return new BoardDto(
                boardEntity.getId(),
                boardEntity.getName(),
                boardEntity.getDescription(),
                boardEntity.getProjectId(),
                settings,
                columns != null ? columns : new ArrayList<>(),
                boardEntity.getCreatedAt(),
                boardEntity.getUpdatedAt()
        );
    }

    public BoardColumnDto toColumnDto(BoardColumnEntity columnEntity, List<TaskDto> tasks) {
        if (columnEntity == null) {
            return null;
        }

        return new BoardColumnDto(
                columnEntity.getId(),
                columnEntity.getBoardId(),
                columnEntity.getName(),
                columnEntity.getColor(),
                columnEntity.getPosition(),
                columnEntity.getWipLimit(),
                columnEntity.getIsCollapsed(),
                tasks != null ? tasks : new ArrayList<>(),
                columnEntity.getCreatedAt(),
                columnEntity.getUpdatedAt()
        );
    }

    public BoardSettingsDto parseSettings(String settingsJson) {
        if (settingsJson == null || settingsJson.isBlank()) {
            return new BoardSettingsDto();
        }
        try {
            return objectMapper.readValue(settingsJson, BoardSettingsDto.class);
        } catch (Exception e) {
            return new BoardSettingsDto();
        }
    }

    public String serializeSettings(BoardSettingsDto settings) {
        if (settings == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(settings);
        } catch (Exception e) {
            return "{}";
        }
    }
}

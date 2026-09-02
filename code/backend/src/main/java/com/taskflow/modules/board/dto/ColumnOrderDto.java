package com.taskflow.modules.board.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ColumnOrderDto {

    @NotNull(message = "Column ID must not be null")
    private UUID columnId;

    @NotNull(message = "Position must not be null")
    private Double position;

    public ColumnOrderDto() {
    }

    public ColumnOrderDto(UUID columnId, Double position) {
        this.columnId = columnId;
        this.position = position;
    }

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }
}

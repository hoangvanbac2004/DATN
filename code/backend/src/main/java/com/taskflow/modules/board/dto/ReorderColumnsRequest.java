package com.taskflow.modules.board.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class ReorderColumnsRequest {

    @NotEmpty(message = "Column orders list must not be empty")
    @Valid
    private List<ColumnOrderDto> orders;

    public ReorderColumnsRequest() {
    }

    public ReorderColumnsRequest(List<ColumnOrderDto> orders) {
        this.orders = orders;
    }

    public List<ColumnOrderDto> getOrders() {
        return orders;
    }

    public void setOrders(List<ColumnOrderDto> orders) {
        this.orders = orders;
    }
}

package com.taskflow.modules.checklist.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class BatchUpdateChecklistRequest {

    @NotEmpty(message = "Items list must not be empty")
    @Valid
    private List<ChecklistItemUpdate> items;

    public BatchUpdateChecklistRequest() {
    }

    public BatchUpdateChecklistRequest(List<ChecklistItemUpdate> items) {
        this.items = items;
    }

    public List<ChecklistItemUpdate> getItems() {
        return items;
    }

    public void setItems(List<ChecklistItemUpdate> items) {
        this.items = items;
    }

    public static class ChecklistItemUpdate {
        @NotNull(message = "Item ID must not be null")
        private UUID id;
        private String title;
        private Boolean completed;
        private Double position;

        public ChecklistItemUpdate() {
        }

        public ChecklistItemUpdate(UUID id, String title, Boolean completed, Double position) {
            this.id = id;
            this.title = title;
            this.completed = completed;
            this.position = position;
        }

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Boolean getCompleted() {
            return completed;
        }

        public void setCompleted(Boolean completed) {
            this.completed = completed;
        }

        public Double getPosition() {
            return position;
        }

        public void setPosition(Double position) {
            this.position = position;
        }
    }
}
